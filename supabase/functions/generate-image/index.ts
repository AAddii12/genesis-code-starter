
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

    // Log some debug information about the API key (without revealing the full key)
    console.log("Generating image with prompt:", prompt);
    console.log("FAL API key available:", !!falApiKey);
    console.log("FAL API key length:", falApiKey.length);
    console.log("FAL API key first 4 chars:", falApiKey.substring(0, 4));
    console.log("FAL API key format check:", falApiKey.startsWith("fal_") ? "Valid prefix" : "Invalid prefix");

    try {
      console.log("Preparing to send request to FAL API...");
      
      // Log the full request structure (except the API key)
      const requestBody = {
        model: "fal-ai/flux/dev",
        input: {
          prompt: prompt,
        },
        logs: true,
        stream: false
      };
      console.log("Request body:", JSON.stringify(requestBody));
      
      console.log("Sending request to FAL API endpoint: https://api.fal.ai/v1/subscriptions");
      const response = await fetch("https://api.fal.ai/v1/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${falApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("FAL API response status:", response.status);
      console.log("FAL API response headers:", JSON.stringify(Object.fromEntries([...response.headers])));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("FAL API error response:", errorText);
        throw new Error(`FAL API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("FAL API response data structure:", JSON.stringify(Object.keys(data)));
      console.log("FAL API full response:", JSON.stringify(data).substring(0, 500) + "...");

      // Extract image URL from response
      const imageUrl = data.data?.images?.[0] || data.data?.image;
      
      if (!imageUrl) {
        console.error("No image URL in response data structure:", JSON.stringify(data));
        throw new Error("Failed to generate image: No image URL in response");
      }

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
      
      // Try alternative API endpoint as a fallback
      try {
        console.log("Attempting with alternative FAL endpoint: https://api.fal.ai/text-to-image");
        const altResponse = await fetch("https://api.fal.ai/text-to-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Key ${falApiKey}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            width: 1024,
            height: 1024,
            num_images: 1,
          }),
        });
        
        console.log("Alternative endpoint response status:", altResponse.status);
        
        if (!altResponse.ok) {
          const altErrorText = await altResponse.text();
          console.error("Alternative endpoint error:", altErrorText);
          throw new Error("Both FAL endpoints failed");
        }
        
        const altData = await altResponse.json();
        const altImageUrl = altData.images?.[0]?.url;
        
        if (altImageUrl) {
          console.log("Alternative endpoint succeeded:", altImageUrl.substring(0, 50) + "...");
          return new Response(
            JSON.stringify({ imageUrl: altImageUrl }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (altError) {
        console.error("Alternative endpoint also failed:", altError.message);
      }
      
      // If both API endpoints fail, use a placeholder image based on the prompt
      console.log("Using fallback image service due to API failures");
      
      // Create a fallback image URL with the prompt encoded in it
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
