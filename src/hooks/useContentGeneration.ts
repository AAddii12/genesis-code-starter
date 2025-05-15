import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useImageGeneration } from "./useImageGeneration";
import { useTextGeneration } from "./useTextGeneration";
import { useUserCredits } from "./useUserCredits";
import { useContentSaving } from "./useContentSaving";

export const useContentGeneration = (userProfile: UserProfile | null) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFallbackImage, setIsFallbackImage] = useState(false);
  
  const { generateImage, isGenerating: isGeneratingImage } = useImageGeneration();
  const { generateText, isGenerating: isGeneratingText } = useTextGeneration();
  const { userCredits, deductCredit } = useUserCredits(userProfile);
  const { isLoading, saveToMyContent: saveContent, downloadContent: download } = useContentSaving();
  
  // Load generated content from session storage
  useEffect(() => {
    const savedText = sessionStorage.getItem("generatedText");
    if (savedText) {
      setCaption(savedText);
    }
    
    const savedImage = sessionStorage.getItem("generatedImage");
    if (savedImage) {
      setGeneratedImage(savedImage);
      setIsFallbackImage(sessionStorage.getItem("isFallbackImage") === "true");
    }
  }, []);
  
  const generateContent = async () => {
    if (!userProfile || isGenerating) return;
    
    if (userCredits !== null && userCredits <= 0) {
      toast({
        title: "No credits left",
        description: "You've used all your credits. Upgrade to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    toast({
      title: "Generating content",
      description: "Creating your custom content...",
    });
    
    try {
      // Generate image and text in parallel
      const [imageResult, textResult] = await Promise.all([
        generateImage(userProfile),
        generateText(userProfile)
      ]);
      
      if (imageResult) {
        setGeneratedImage(imageResult);
        setIsFallbackImage(sessionStorage.getItem("isFallbackImage") === "true");
      }
      
      if (textResult) {
        setCaption(textResult);
      }
      
      // Check if either succeeded
      if (imageResult || textResult) {
        // Deduct a credit if successful
        if (userCredits !== null) {
          await deductCredit();
        }
        
        toast({
          title: "Content created",
          description: "Your social media content is ready to use!",
        });
      } else {
        throw new Error("Failed to generate content");
      }
      
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const saveToMyContent = async () => {
    await saveContent(generatedImage, caption);
  };
  
  const downloadContent = async () => {
    await download(generatedImage);
  };
  
  return {
    generatedImage,
    caption,
    setCaption,
    userCredits,
    isGenerating: isGenerating || isGeneratingImage || isGeneratingText,
    isLoading,
    generateContent,
    saveToMyContent,
    downloadContent,
    isFallbackImage
  };
};
