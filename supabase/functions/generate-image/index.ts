
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createFalClient } from "npm:@fal-ai/serverless-client@0.7.0";

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
      console.log("Setting up FAL client...");
      
      // Initialize the FAL client
      const fal = createFalClient({
        credentials: falApiKey,
      });
      
      console.log("FAL client initialized successfully");
      console.log("Sending request to FAL API with prompt:", prompt.substring(0, 50) + "...");
      
      // Use the FAL client to generate an image
      const result = await fal.run({
        modelId: "flux:dev",  // Using the flux model
        input: {
          prompt: prompt,
        },
        outputSchema: {
          images: ["string"],
        },
      });
      
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
