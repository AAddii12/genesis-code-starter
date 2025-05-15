
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImageGenerationRequest {
  businessName?: string;
  businessType?: string;
  targetAudience?: string;
  styleVibe?: string;
  colorPalette?: string;
  businessGoal?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the user profile data instead of direct prompt
    const userData: ImageGenerationRequest = await req.json();
    
    // Validate required parameters
    if (!userData.businessType && !userData.businessName) {
      throw new Error("Missing required business information");
    }

    // Sanitize inputs to prevent injection
    const sanitize = (input: string | undefined): string => {
      if (!input) return "";
      // Basic sanitization - remove potential script tags and limit length
      return input.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100);
    };

    const businessName = sanitize(userData.businessName);
    const businessType = sanitize(userData.businessType);
    const targetAudience = sanitize(userData.targetAudience);
    const styleVibe = sanitize(userData.styleVibe);
    const colorPalette = sanitize(userData.colorPalette);
    const businessGoal = sanitize(userData.businessGoal);

    // Construct the prompt server-side
    const prompt = `A modern and attractive social media image for a ${businessType || businessName} brand, targeting ${targetAudience || "general audience"}, in a ${styleVibe || "professional"} style with ${colorPalette || "balanced"} colors. Instagram-ready and visually clean.${businessGoal ? ` Created with the goal of ${businessGoal}.` : ""}`;

    // Get FAL API key from environment variables
    const falApiKey = Deno.env.get("FAL_API_KEY");
    
    if (!falApiKey) {
      console.error("FAL_API_KEY environment variable not found");
      throw new Error("FAL_API_KEY not found in environment variables");
    }

    console.log("Generating image with prompt:", prompt.substring(0, 100) + "...");
    
    // Direct approach using the FAL queue API as specified in the documentation
    const response = await fetch('https://queue.fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_size: "landscape_4_3",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true
      }),
    });
      
    if (!response.ok) {
      const errorData = await response.text();
      console.error("FAL API returned an error:", response.status, errorData);
      throw new Error(`FAL API error: ${response.status} ${errorData}`);
    }
      
    const result = await response.json();
    console.log("FAL API response received:", JSON.stringify(result).substring(0, 200) + "...");
    
    // Check if we have a request_id and need to poll for results
    if (result.request_id) {
      console.log("Request queued with ID:", result.request_id);
      
      // Poll for results (up to 10 attempts, waiting 1 second between each)
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Polling for results, attempt ${attempts}/${maxAttempts}`);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const statusResponse = await fetch(`https://queue.fal.run/fal-ai/flux/requests/${result.request_id}/status`, {
          method: 'GET',
          headers: {
            'Authorization': `Key ${falApiKey}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!statusResponse.ok) {
          console.warn(`Status check failed on attempt ${attempts}:`, statusResponse.status);
          continue;
        }
        
        const statusResult = await statusResponse.json();
        console.log(`Status check result (attempt ${attempts}):`, JSON.stringify(statusResult).substring(0, 100) + "...");
        
        // If completed, get the full result
        if (statusResult.status === "COMPLETED") {
          const resultResponse = await fetch(`https://queue.fal.run/fal-ai/flux/requests/${result.request_id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Key ${falApiKey}`,
              'Content-Type': 'application/json',
            }
          });
          
          if (!resultResponse.ok) {
            console.error("Failed to fetch result:", resultResponse.status);
            throw new Error(`Failed to fetch result: ${resultResponse.status}`);
          }
          
          const finalResult = await resultResponse.json();
          console.log("Image generation completed:", JSON.stringify(finalResult).substring(0, 100) + "...");
          
          if (finalResult.images && finalResult.images.length > 0) {
            const imageUrl = finalResult.images[0].url;
            console.log("Image URL:", imageUrl.substring(0, 50) + "...");
            
            return new Response(
              JSON.stringify({ imageUrl }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
        
        if (statusResult.status === "FAILED") {
          throw new Error(`Image generation failed: ${statusResult.error || "Unknown error"}`);
        }
      }
      
      throw new Error("Image generation timed out after maximum polling attempts");
    }
    
    // If there are images in the initial response (sync mode)
    if (result.images && result.images.length > 0) {
      const imageUrl = result.images[0].url;
      console.log("Image generated successfully:", imageUrl.substring(0, 50) + "...");
      
      return new Response(
        JSON.stringify({ imageUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If we reach here, the API didn't give us what we expected
    console.error("Unexpected API response format:", JSON.stringify(result).substring(0, 200) + "...");
    throw new Error("Unexpected API response format");
    
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Generate a fallback image URL based on the passed data
    const userData: ImageGenerationRequest = await req.json().catch(() => ({}));
    const businessText = encodeURIComponent((userData.businessName || userData.businessType || "image generation failed").substring(0, 100));
    
    let colorHex = "f5f0fa";
    
    if (userData.colorPalette === "soft pastels") colorHex = "f5e1e9";
    else if (userData.colorPalette === "neon bold") colorHex = "00ff8c";
    else if (userData.colorPalette === "monochrome") colorHex = "e0e0e0";
    
    const fallbackImageUrl = `https://placehold.co/1024x1024/${colorHex}/7e69ab?text=${businessText}`;
    
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
