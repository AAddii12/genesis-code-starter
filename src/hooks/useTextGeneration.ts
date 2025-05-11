
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';
import { supabase } from "@/integrations/supabase/client";

export const useTextGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const generateText = async (userProfile: UserProfile) => {
    if (!userProfile) return null;
    
    setIsGenerating(true);
    
    try {
      // Generate the prompt with userProfile data
      const prompt = `Write a short marketing caption for a ${userProfile.businessType} business. The target audience is ${userProfile.targetAudience}. The goal is ${userProfile.businessGoal}. The style should be ${userProfile.styleVibe} and the color vibe is ${userProfile.colorPalette}. Include 1–2 hashtags and a clear call to action.`;

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: { prompt }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to call text generation function");
      }
      
      if (!data?.text) {
        throw new Error("No text returned from generation function");
      }
      
      // Save the generated text
      const text = data.text;
      setGeneratedText(text);
      sessionStorage.setItem('generatedText', text);
      toast({
        title: "Caption generated",
        description: "Your marketing caption is ready",
      });
      
      return text;
    } catch (error) {
      console.error('Error generating text:', error);
      toast({
        title: "Caption generation failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateText,
    isGenerating,
    generatedText
  };
};
