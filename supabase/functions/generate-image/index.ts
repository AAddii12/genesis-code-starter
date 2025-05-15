
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    // Get FAL API key from environment variables
    const falApiKey = Deno.env.get("FAL_API_KEY");
    
    if (!falApiKey) {
      console.error("FAL_API_KEY environment variable not found");
      throw new Error("FAL_API_KEY not found in environment variables");
    }

    console.log("Generating image with prompt:", prompt);
    
    // Step 1: Submit the generation request
    const response = await fetch('https://api.fal.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        model: 'fal-ai/flux/dev',
        width: 1024,
        height: 1024,
        num_images: 1
      }),
    });
      
    if (!response.ok) {
      const errorData = await response.text();
      console.error("FAL API returned an error:", response.status, errorData);
      throw new Error(`FAL API error: ${response.status} ${errorData}`);
    }
      
    const result = await response.json();
    console.log("FAL API response received:", JSON.stringify(result).substring(0, 200) + "...");
    
    // Check if we have an image URL directly
    if (result.images && result.images.length > 0) {
      const imageUrl = result.images[0].url;
      console.log("Image generated successfully:", imageUrl.substring(0, 50) + "...");
      
      return new Response(
        JSON.stringify({ imageUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If we have a request ID, need to poll for results
    if (result.request_id) {
      console.log("Request queued with ID:", result.request_id);
      
      // Poll for results (up to 10 attempts, waiting 1 second between each)
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Polling for results, attempt ${attempts}/${maxAttempts}`);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const statusResponse = await fetch(`https://api.fal.ai/v1/images/generations/${result.request_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${falApiKey}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!statusResponse.ok) {
          console.warn(`Status check failed on attempt ${attempts}:`, statusResponse.status);
          continue;
        }
        
        const statusResult = await statusResponse.json();
        console.log(`Status check result (attempt ${attempts}):`, JSON.stringify(statusResult).substring(0, 100) + "...");
        
        if (statusResult.status === "COMPLETED" && statusResult.images && statusResult.images.length > 0) {
          const imageUrl = statusResult.images[0].url;
          console.log("Image generation completed:", imageUrl.substring(0, 50) + "...");
          
          return new Response(
            JSON.stringify({ imageUrl }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        if (statusResult.status === "FAILED") {
          throw new Error(`Image generation failed: ${statusResult.error || "Unknown error"}`);
        }
      }
      
      throw new Error("Image generation timed out after maximum polling attempts");
    }
    
    // If we don't have images or request_id, try alternative endpoint
    console.log("Using alternative approach due to unexpected API response format");
    
    try {
      const altResponse = await fetch('https://queue.fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          image_model: 'fal-ai/flux/dev'
        }),
      });
      
      if (!altResponse.ok) {
        const altErrorData = await altResponse.text();
        console.error("Alternative endpoint failed:", altResponse.status, altErrorData);
        throw new Error(`Alternative endpoint failed: ${altErrorData}`);
      }
      
      const altResult = await altResponse.json();
      console.log("Alternative endpoint response:", JSON.stringify(altResult).substring(0, 200) + "...");
      
      // Check if result is queued
      if (altResult.status === "IN_QUEUE" && altResult.request_id) {
        console.log("Request queued with ID:", altResult.request_id);
        
        // Poll for results (up to 10 attempts, waiting 1 second between each)
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
          attempts++;
          console.log(`Polling queue, attempt ${attempts}/${maxAttempts}`);
          
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          
          const queueResponse = await fetch(altResult.status_url, {
            method: 'GET',
            headers: {
              'Authorization': `Key ${falApiKey}`,
              'Content-Type': 'application/json',
            }
          });
          
          if (!queueResponse.ok) {
            console.warn(`Queue check failed on attempt ${attempts}:`, queueResponse.status);
            continue;
          }
          
          const queueResult = await queueResponse.json();
          console.log(`Queue status (attempt ${attempts}):`, JSON.stringify(queueResult).substring(0, 100) + "...");
          
          if (queueResult.status === "COMPLETED" && queueResult.images && queueResult.images.length > 0) {
            const imageUrl = queueResult.images[0];
            console.log("Queue processing completed:", imageUrl.substring(0, 50) + "...");
            
            return new Response(
              JSON.stringify({ imageUrl }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          
          if (queueResult.status === "FAILED") {
            throw new Error(`Queue processing failed: ${queueResult.error || "Unknown error"}`);
          }
        }
        
        throw new Error("Queue processing timed out after maximum polling attempts");
      }
      
      if (altResult.images && altResult.images.length > 0) {
        const imageUrl = altResult.images[0];
        console.log("Alternative endpoint returned image:", imageUrl.substring(0, 50) + "...");
        
        return new Response(
          JSON.stringify({ imageUrl }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("No images in alternative endpoint response");
    } catch (altError) {
      console.error("Alternative endpoint request failed:", altError.message);
      throw altError; // Rethrow to be caught by outer catch
    }
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Generate a fallback image URL based on the prompt
    console.log("Using fallback image service due to API failures");
    const encodedPrompt = encodeURIComponent((error.prompt || "image generation failed").substring(0, 100));
    const fallbackImageUrl = `https://placehold.co/1024x1024/random/white?text=${encodedPrompt}`;
    
    console.log("Using fallback image URL:", fallbackImageUrl);
    
    return new Response(
      JSON.stringify({ 
        imageUrl: fallbackImageUrl,
        isFallback: true,
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
