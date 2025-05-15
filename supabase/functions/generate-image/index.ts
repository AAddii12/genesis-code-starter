
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
    console.log("FAL API key available:", !!falApiKey);

    try {
      console.log("Sending request to FAL API using improved structure...");
      // Using the recommended structure for the FAL request
      const response = await fetch("https://api.fal.ai/v1/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${falApiKey}`,
        },
        body: JSON.stringify({
          model: "fal-ai/flux/dev", // Using the model as specified in the example
          input: {
            prompt: prompt,
          },
          logs: true,
          stream: false // Get the full result at once instead of streaming
        }),
      });

      console.log("FAL API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("FAL API error response:", errorText);
        throw new Error(`FAL API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("FAL API response received successfully");

      // Extract image URL from response
      // The structure is different based on the example provided
      const imageUrl = data.data?.images?.[0] || data.data?.image;
      
      if (!imageUrl) {
        console.error("No image URL in response:", JSON.stringify(data));
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
      
      // If FAL API fails, we'll use a placeholder image based on the prompt
      console.log("Using fallback image service:", falError.message);
      
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
