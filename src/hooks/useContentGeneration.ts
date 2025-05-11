
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useImageGeneration } from "./useImageGeneration";
import { useTextGeneration } from "./useTextGeneration";

export const useContentGeneration = (userProfile: UserProfile | null) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { generateImage, isGenerating: isGeneratingImage } = useImageGeneration();
  const { generateText, isGenerating: isGeneratingText } = useTextGeneration();
  
  // Load generated content from session storage
  useEffect(() => {
    const savedText = sessionStorage.getItem("generatedText");
    if (savedText) {
      setCaption(savedText);
    }
    
    const savedImage = sessionStorage.getItem("generatedImage");
    if (savedImage) {
      setGeneratedImage(savedImage);
    }
    
    // Load user credits from the database
    if (userProfile) {
      loadUserCredits();
    }
  }, [userProfile]);
  
  const loadUserCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_remaining")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setUserCredits(data.credits_remaining);
      } else {
        // If no record exists, they may be on the free tier with default credits
        setUserCredits(5);
      }
    } catch (error) {
      console.error("Error loading user credits:", error);
      toast({
        title: "Failed to load credits",
        description: "Could not retrieve your available credits",
        variant: "destructive",
      });
    }
  };
  
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
  
  const deductCredit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Deduct one credit
      const newCreditCount = userCredits! - 1;
      
      const { error } = await supabase
        .from("user_credits")
        .update({ credits_remaining: newCreditCount })
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      setUserCredits(newCreditCount);
    } catch (error) {
      console.error("Error deducting credit:", error);
      toast({
        title: "Credit error",
        description: "Failed to update your credits",
        variant: "destructive",
      });
    }
  };
  
  const saveToMyContent = async () => {
    if (!generatedImage || !caption || !userProfile) return;
    
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("user_content")
        .insert({
          user_id: user.id,
          image_url: generatedImage,
          caption: caption
        });
        
      if (error) throw error;
      
      toast({
        title: "Content saved",
        description: "Your content has been saved to My Content.",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error saving content",
        description: "Failed to save your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadContent = async () => {
    if (!generatedImage) return;
    
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // Set the href to the image URL
      link.href = generatedImage;
      
      // Set the download attribute to save with a filename
      link.download = `social-content-${new Date().getTime()}.png`;
      
      // Append to the body
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Remove the element
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your content is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading content:", error);
      toast({
        title: "Download failed",
        description: "Failed to download your content. Please try again.",
        variant: "destructive",
      });
    }
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
    downloadContent
  };
};
