
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
        
        // Generate a more visual placeholder image based on user profile
        let colorHex;
        switch (userProfile.colorPalette) {
          case "soft pastels": colorHex = "f5e1e9"; break;
          case "neon bold": colorHex = "00ff8c"; break;
          case "monochrome": colorHex = "e0e0e0"; break;
          case "custom": 
          default: colorHex = "f5f0fa"; break;
        }
        
        // Create a better placeholder with user data embedded
        const businessText = encodeURIComponent(userProfile.businessName || userProfile.businessType);
        const placeholderImage = `https://placehold.co/800x800/${colorHex}/7e69ab?text=${businessText}`;
        
        setImageUrl(placeholderImage);
        sessionStorage.setItem("generatedImage", placeholderImage);
        
        toast({
          title: "Using placeholder image",
          description: "Could not connect to image generation service. Using a placeholder for testing.",
        });
        
        return placeholderImage;
      }
      
      if (!data?.imageUrl) {
        // Also use enhanced placeholder if no URL returned
        let colorHex;
        switch (userProfile.colorPalette) {
          case "soft pastels": colorHex = "f5e1e9"; break;
          case "neon bold": colorHex = "00ff8c"; break;
          case "monochrome": colorHex = "e0e0e0"; break;
          case "custom": 
          default: colorHex = "f5f0fa"; break;
        }
        
        const businessText = encodeURIComponent(userProfile.businessName || userProfile.businessType);
        const placeholderImage = `https://placehold.co/800x800/${colorHex}/7e69ab?text=${businessText}`;
        
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
      
      // For testing, use an enhanced placeholder image
      let colorHex = "f5f0fa";
      if (userProfile.colorPalette === "soft pastels") colorHex = "f5e1e9";
      else if (userProfile.colorPalette === "neon bold") colorHex = "00ff8c";
      else if (userProfile.colorPalette === "monochrome") colorHex = "e0e0e0";
      
      const businessText = encodeURIComponent(userProfile.businessName || userProfile.businessType);
      const placeholderImage = `https://placehold.co/800x800/${colorHex}/7e69ab?text=${businessText}`;
      
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
