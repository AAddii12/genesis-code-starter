
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
    // Parse the user profile data
    const userData: ImageGenerationRequest = await req.json();
    
    // Validate required parameters
    if (!userData.businessType && !userData.businessName) {
      throw new Error("Missing required business information");
    }

    // Sanitize inputs to prevent injection
    const sanitize = (input: string | undefined): string => {
      if (!input) return "";
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

    // Get Stability API key from environment variables
    const stabilityApiKey = Deno.env.get("STABILITY_API_KEY");
    
    if (!stabilityApiKey) {
      console.error("STABILITY_API_KEY environment variable not found");
      throw new Error("STABILITY_API_KEY not found in environment variables");
    }

    console.log("Generating image with prompt:", prompt.substring(0, 100) + "...");
    
    // Determine the aspect ratio based on preferences (defaulting to square)
    let aspectRatio = "1:1"; // Square default
    if (userData.styleVibe === "minimalist" || userData.styleVibe === "elegant") {
      aspectRatio = "4:5"; // Portrait for Instagram
    } else if (userData.styleVibe === "playful") {
      aspectRatio = "16:9"; // Landscape for broader content
    }
    
    // Call the Stability API for image generation
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/ultra", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stabilityApiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: aspectRatio,
        output_format: "png",
        seed: Math.floor(Math.random() * 1000000) // Random seed for variety
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stability API returned an error:", response.status, errorText);
      throw new Error(`Stability API error: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Stability API response received:", JSON.stringify(result).substring(0, 200) + "...");
    
    // Check if we have images in the response
    if (result.image_url || (result.artifacts && result.artifacts.length > 0)) {
      // Extract image URL - handle both possible response formats
      const imageUrl = result.image_url || result.artifacts[0].url || result.artifacts[0].base64;
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
