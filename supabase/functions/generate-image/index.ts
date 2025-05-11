
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get FAL API key from environment variables
    const falApiKey = Deno.env.get("FAL_API_KEY");
    
    if (!falApiKey) {
      throw new Error("FAL_API_KEY not found in environment variables");
    }

    console.log("Generating image with prompt:", prompt);

    // Call FAL API to generate image
    const response = await fetch("https://api.fal.ai/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${falApiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: "stabilityai/stable-diffusion-xl-base-1.0", // Use appropriate model
        width: 1024,
        height: 1024,
        num_images: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`FAL API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // Extract image URL from response
    const imageUrl = data.images?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error("Failed to generate image: No image URL in response");
    }

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ imageUrl }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
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
