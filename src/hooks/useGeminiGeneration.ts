
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';
import { supabase } from "@/integrations/supabase/client";

export const useGeminiGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const generateWithGemini = async (userProfile: UserProfile) => {
    if (!userProfile) return null;
    
    setIsGenerating(true);
    
    try {
      // Create prompt with userProfile data
      const prompt = `Write a short marketing post for a ${userProfile.businessType} targeting ${userProfile.targetAudience} in a ${userProfile.styleVibe} tone. Add hashtags and a call to action.`;

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-gemini', {
        body: { prompt }
      });
      
      if (error) {
        console.error("Error from generate-gemini function:", error);
        throw new Error(error.message || "Failed to call Gemini generation function");
      }
      
      if (!data?.text) {
        throw new Error("No text returned from Gemini generation function");
      }
      
      // Save the generated text
      const text = data.text;
      setGeneratedText(text);
      sessionStorage.setItem('generatedText', text);
      toast({
        title: "Gemini caption generated",
        description: "Your AI-powered marketing caption is ready",
      });
      
      return text;
    } catch (error) {
      console.error('Error generating text with Gemini:', error);
      toast({
        title: "Gemini caption generation failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateWithGemini,
    isGenerating,
    generatedText
  };
};
