
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

    // Log some debug information
    console.log("Generating image with prompt:", prompt);
    console.log("FAL API key available:", !!falApiKey);
    console.log("FAL API key length:", falApiKey.length);
    console.log("FAL API key first 4 chars:", falApiKey.substring(0, 4));
    
    try {
      console.log("Making direct HTTP request to FAL API...");
      
      // Make direct HTTP request to FAL API
      const response = await fetch('https://queue.fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("FAL API returned an error:", response.status, errorData);
        throw new Error(`FAL API error: ${response.status} ${errorData}`);
      }
      
      const result = await response.json();
      console.log("FAL API response received:", JSON.stringify(result).substring(0, 200) + "...");
      
      if (!result || !result.images || !result.images.length) {
        console.error("No images in response:", result);
        throw new Error("Failed to generate image: No images in response");
      }
      
      const imageUrl = result.images[0];
      console.log("Image generated successfully:", imageUrl.substring(0, 50) + "...");
      
      return new Response(
        JSON.stringify({ imageUrl }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
      
    } catch (falError) {
      console.error("FAL API request failed:", falError.message);
      console.error("Error details:", falError.stack || "No stack trace available");
      
      // Try one alternative endpoint as fallback
      try {
        console.log("Trying alternative FAL API endpoint...");
        
        const altResponse = await fetch('https://api.fal.ai/text-to-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${falApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "flux",
            prompt: prompt,
            image_size: "1024x1024",
          }),
        });
        
        if (!altResponse.ok) {
          const altErrorData = await altResponse.text();
          console.error("Alternative endpoint also failed:", altResponse.status, altErrorData);
          throw new Error(`Alternative endpoint also failed: ${altErrorData}`);
        }
        
        const altResult = await altResponse.json();
        
        if (altResult && altResult.images && altResult.images.length > 0) {
          const altImageUrl = altResult.images[0];
          console.log("Image generated from alternative endpoint:", altImageUrl.substring(0, 50) + "...");
          
          return new Response(
            JSON.stringify({ imageUrl: altImageUrl }),
            { 
              headers: { 
                ...corsHeaders,
                "Content-Type": "application/json" 
              } 
            }
          );
        } else {
          throw new Error("No images in alternative endpoint response");
        }
      } catch (altError) {
        console.error("Alternative endpoint failed:", altError.message);
        console.error("Error details:", altError.stack || "No stack trace available");
        
        // Generate a fallback image URL based on the prompt
        console.log("Using fallback image service due to API failures");
        const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
        const fallbackImageUrl = `https://placehold.co/1024x1024/random/white?text=${encodedPrompt}`;
        
        console.log("Using fallback image URL:", fallbackImageUrl);
        
        return new Response(
          JSON.stringify({ 
            imageUrl: fallbackImageUrl,
            isFallback: true,
            error: falError.message 
          }),
          { 
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
    console.error("Error stack:", error.stack || "No stack trace available");
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
});
