
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types";
import { toast } from "@/hooks/use-toast";

export const useContentGeneration = (userProfile: UserProfile | null) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
        .single();
        
      if (error) throw error;
      
      if (data) {
        setUserCredits(data.credits_remaining);
      } else {
        // If no record exists, they may be on the free tier with default credits
        setUserCredits(5);
      }
    } catch (error) {
      console.error("Error loading user credits:", error);
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
      // Here would be the call to generateImage API
      // For now, just using a placeholder
      const savedImage = sessionStorage.getItem("generatedImage");
      if (savedImage) {
        setGeneratedImage(savedImage);
      } else {
        setGeneratedImage("/placeholder.svg");
      }
      
      // Load the existing caption or generate a new one
      const existingCaption = sessionStorage.getItem("generatedText");
      if (existingCaption) {
        setCaption(existingCaption);
      }
      
      // Deduct a credit if successful
      if (userCredits !== null) {
        await deductCredit();
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
  
  const downloadContent = () => {
    // This would be implemented to download the image and caption
    toast({
      title: "Download started",
      description: "Your content is being prepared for download.",
    });
  };
  
  return {
    generatedImage,
    caption,
    setCaption,
    userCredits,
    isGenerating,
    isLoading,
    generateContent,
    saveToMyContent,
    downloadContent
  };
};
