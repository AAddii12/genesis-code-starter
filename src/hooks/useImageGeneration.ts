
import { useState } from "react";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackImage, setIsFallbackImage] = useState(false);

  const generateImage = async (userProfile: UserProfile) => {
    if (!userProfile) return null;
    
    setIsGenerating(true);
    setError(null);
    setIsFallbackImage(false);
    
    try {
      console.log("Sending user profile data to generate-image function");
      
      // Send only essential user profile data - no direct prompt or API endpoint references
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          businessName: userProfile.businessName,
          businessType: userProfile.businessType,
          targetAudience: userProfile.targetAudience,
          styleVibe: userProfile.styleVibe,
          colorPalette: userProfile.colorPalette,
          businessGoal: userProfile.businessGoal
        }
      });
      
      console.log("Edge function response:", data ? "success" : "no data", error ? `error: ${error.message}` : "no error");
      
      if (error) {
        console.error("Error from generate-image function:", error);
        
        // Generate a visual placeholder image based on user profile
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
        setIsFallbackImage(true);
        sessionStorage.setItem("generatedImage", placeholderImage);
        sessionStorage.setItem("isFallbackImage", "true");
        
        toast({
          title: "Using placeholder image",
          description: `Could not connect to image generation service: ${error.message}. Using a placeholder for testing.`,
          variant: "default",
        });
        
        return placeholderImage;
      }
      
      if (!data?.imageUrl) {
        console.error("No image URL in response:", data);
        
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
        setIsFallbackImage(true);
        sessionStorage.setItem("generatedImage", placeholderImage);
        sessionStorage.setItem("isFallbackImage", "true");
        
        toast({
          title: "Using placeholder image",
          description: "Image generation service returned no data. Using a placeholder for testing.",
          variant: "default",
        });
        
        return placeholderImage;
      }
      
      // Check if the response indicates this is a fallback image
      if (data.isFallback) {
        console.log("Using fallback image from edge function:", data.imageUrl.substring(0, 50) + "...");
        setIsFallbackImage(true);
        sessionStorage.setItem("isFallbackImage", "true");
        
        toast({
          title: "Using placeholder image",
          description: data.error ? `Image generation service error: ${data.error}` : "Using placeholder image due to service issues.",
          variant: "default",
        });
      } else {
        setIsFallbackImage(false);
        sessionStorage.removeItem("isFallbackImage");
        
        toast({
          title: "Image generated",
          description: "Your social media image has been created",
        });
      }
      
      // Store the generated image URL
      console.log("Image URL received:", data.imageUrl.substring(0, 50) + "...");
      setImageUrl(data.imageUrl);
      sessionStorage.setItem("generatedImage", data.imageUrl);
      
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
      setIsFallbackImage(true);
      sessionStorage.setItem("generatedImage", placeholderImage);
      sessionStorage.setItem("isFallbackImage", "true");
      
      toast({
        title: "Using placeholder image",
        description: `Encountered an error during image generation: ${error instanceof Error ? error.message : "Unknown error"}. Using a placeholder for testing.`,
        variant: "default",
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
    isFallbackImage
  };
};
