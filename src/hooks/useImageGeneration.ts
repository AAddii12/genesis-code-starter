
import { useState } from "react";
import { UserProfile } from "@/types";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (userProfile: UserProfile) => {
    if (!userProfile) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Prepare the prompt with userProfile data
      const prompt = `A modern and attractive social media image for a ${userProfile.businessType} brand, targeting ${userProfile.targetAudience}, in a ${userProfile.styleVibe} style with ${userProfile.colorPalette} colors. Instagram-ready and visually clean.`;
      
      // Make API call to FAL AI
      const response = await fetch("https://api.fal.ai/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer e41e3dbf-615d-4a81-95a0-1646d824e9be:79b7f63206f8e20f19e8b9865866c944"
        },
        body: JSON.stringify({
          model: "fal-ai/fast-style-transfer",
          input: {
            prompt
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate image");
      }
      
      const data = await response.json();
      
      // Extract image URL from response
      const generatedImage = data.output?.url || data.image_url;
      
      // Store the generated image URL
      if (generatedImage) {
        setImageUrl(generatedImage);
        sessionStorage.setItem("generatedImage", generatedImage);
        return generatedImage;
      } else {
        throw new Error("No image URL found in response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setError(error instanceof Error ? error.message : "Failed to generate image");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateImage,
    imageUrl,
    isGenerating,
    error,
  };
};
