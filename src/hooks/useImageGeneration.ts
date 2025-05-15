
import { useState } from "react";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (userProfile: UserProfile) => {
    if (!userProfile) return null;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Prepare the prompt with userProfile data
      const prompt = `A modern and attractive social media image for a ${userProfile.businessType} brand, targeting ${userProfile.targetAudience}, in a ${userProfile.styleVibe} style with ${userProfile.colorPalette} colors. Instagram-ready and visually clean.`;
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });
      
      if (error) {
        console.error("Error from generate-image function:", error);
        
        // For testing purposes, use a placeholder image if function fails
        const placeholderImage = "https://placehold.co/600x600/f5f0fa/7e69ab?text=Generated+Content";
        setImageUrl(placeholderImage);
        sessionStorage.setItem("generatedImage", placeholderImage);
        
        toast({
          title: "Using placeholder image",
          description: "Could not connect to image generation service. Using a placeholder for testing.",
        });
        
        return placeholderImage;
      }
      
      if (!data?.imageUrl) {
        // Also use placeholder if no URL returned
        const placeholderImage = "https://placehold.co/600x600/f5f0fa/7e69ab?text=Generated+Content";
        setImageUrl(placeholderImage);
        sessionStorage.setItem("generatedImage", placeholderImage);
        
        toast({
          title: "Using placeholder image",
          description: "Image generation service is not available. Using a placeholder for testing.",
        });
        
        return placeholderImage;
      }
      
      // Store the generated image URL
      setImageUrl(data.imageUrl);
      sessionStorage.setItem("generatedImage", data.imageUrl);
      toast({
        title: "Image generated",
        description: "Your social media image has been created",
      });
      return data.imageUrl;
      
    } catch (error) {
      console.error("Error generating image:", error);
      setError(error instanceof Error ? error.message : "Failed to generate image");
      
      // For testing, use a placeholder image
      const placeholderImage = "https://placehold.co/600x600/f5f0fa/7e69ab?text=Generated+Content";
      setImageUrl(placeholderImage);
      sessionStorage.setItem("generatedImage", placeholderImage);
      
      toast({
        title: "Using placeholder image",
        description: "Encountered an error during image generation. Using a placeholder for testing.",
      });
      
      return placeholderImage;
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
