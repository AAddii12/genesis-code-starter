
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
    
    // Create a FormData object to send multipart/form-data request
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("aspect_ratio", aspectRatio);
    formData.append("output_format", "png");
    formData.append("seed", Math.floor(Math.random() * 1000000).toString()); // Random seed for variety
    
    console.log("Sending multipart/form-data request to Stability API...");
    
    // Call the Stability API for image generation with multipart/form-data
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/ultra", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stabilityApiKey}`,
        // Don't set Content-Type header here - it will be set automatically with boundary when using FormData
        "Accept": "image/*"
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stability API returned an error:", response.status, errorText);
      throw new Error(`Stability API error: ${response.status} ${errorText}`);
    }
    
    console.log("Response status:", response.status);
    const contentType = response.headers.get("Content-Type");
    console.log("Response content type:", contentType);
    
    // Handle image response - could be binary or JSON depending on the API
    let imageUrl;
    
    if (contentType?.includes("application/json")) {
      // Handle JSON response format
      const result = await response.json();
      console.log("API returned JSON response:", JSON.stringify(result).substring(0, 200) + "...");
      
      if (result.image_url || (result.artifacts && result.artifacts.length > 0)) {
        imageUrl = result.image_url || result.artifacts[0].url || result.artifacts[0].base64;
      } else {
        throw new Error("No image URL in JSON response");
      }
    } else if (contentType?.includes("image/")) {
      // Handle direct image response
      const imageBlob = await response.blob();
      const buffer = await imageBlob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      imageUrl = `data:${contentType};base64,${base64}`;
    } else {
      throw new Error(`Unexpected response content type: ${contentType}`);
    }
    
    console.log("Image URL generated successfully:", imageUrl?.substring(0, 50) + "...");
    
    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
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
