
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
        
        // Use a placeholder text if the function fails
        const placeholderText = `🌟 [Gemini AI] Elevate your ${userProfile.businessType} experience with our innovative solutions tailored for ${userProfile.targetAudience}! Our ${userProfile.styleVibe} approach will help you achieve your ${userProfile.businessGoal}. Visit our website today to learn more! #${userProfile.businessType.replace(/\s+/g, '')}Life #InnovationMatters`;
        
        setGeneratedText(placeholderText);
        sessionStorage.setItem('generatedText', placeholderText);
        
        toast({
          title: "Using placeholder text",
          description: "Gemini service is not available. Using placeholder text for testing.",
        });
        
        return placeholderText;
      }
      
      if (!data?.text) {
        // Also use placeholder if no text returned
        const placeholderText = `🌟 [Gemini AI] Elevate your ${userProfile.businessType} experience with our innovative solutions tailored for ${userProfile.targetAudience}! Our ${userProfile.styleVibe} approach will help you achieve your ${userProfile.businessGoal}. Visit our website today to learn more! #${userProfile.businessType.replace(/\s+/g, '')}Life #InnovationMatters`;
        
        setGeneratedText(placeholderText);
        sessionStorage.setItem('generatedText', placeholderText);
        
        toast({
          title: "Using placeholder text",
          description: "Gemini service is not available. Using placeholder text for testing.",
        });
        
        return placeholderText;
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
      
      // Use a placeholder text in case of error
      const placeholderText = `🌟 [Gemini AI] Elevate your ${userProfile.businessType} experience with our innovative solutions tailored for ${userProfile.targetAudience}! Our ${userProfile.styleVibe} approach will help you achieve your ${userProfile.businessGoal}. Visit our website today to learn more! #${userProfile.businessType.replace(/\s+/g, '')}Life #InnovationMatters`;
      
      setGeneratedText(placeholderText);
      sessionStorage.setItem('generatedText', placeholderText);
      
      toast({
        title: "Using placeholder text",
        description: "Gemini service is not available. Using placeholder text for testing.",
      });
      
      return placeholderText;
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
