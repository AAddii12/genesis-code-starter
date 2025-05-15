
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
      const prompt = `Write a short marketing post for a ${userProfile.businessType} targeting ${userProfile.targetAudience} in a ${userProfile.styleVibe} tone. Add hashtags and a call to action.`;

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: { prompt }
      });
      
      if (error) {
        console.error("Error from generate-text function:", error);
        
        // Create a placeholder text based on user profile
        const placeholderText = `✨ Introducing our latest ${userProfile.businessType} collection designed specifically for ${userProfile.targetAudience}! Our ${userProfile.styleVibe} approach ensures you'll stand out. Check out our website and follow us for more updates. #${userProfile.businessType.replace(/\s+/g, '')} #Trending`;
        
        setGeneratedText(placeholderText);
        sessionStorage.setItem('generatedText', placeholderText);
        
        toast({
          title: "Using placeholder text",
          description: "Text generation service is not available. Using placeholder text for testing.",
        });
        
        return placeholderText;
      }
      
      if (!data?.text) {
        // Also use placeholder if no text returned
        const placeholderText = `✨ Introducing our latest ${userProfile.businessType} collection designed specifically for ${userProfile.targetAudience}! Our ${userProfile.styleVibe} approach ensures you'll stand out. Check out our website and follow us for more updates. #${userProfile.businessType.replace(/\s+/g, '')} #Trending`;
        
        setGeneratedText(placeholderText);
        sessionStorage.setItem('generatedText', placeholderText);
        
        toast({
          title: "Using placeholder text",
          description: "Text generation service is not available. Using placeholder text for testing.",
        });
        
        return placeholderText;
      }
      
      // Check if it's a fallback text from the server
      if (data.isFallback) {
        toast({
          title: "Using generated fallback text",
          description: data.error || "Text generation service encountered an issue",
        });
      } else {
        toast({
          title: "Caption generated",
          description: "Your marketing caption is ready",
        });
      }
      
      // Save the generated text
      const text = data.text;
      setGeneratedText(text);
      sessionStorage.setItem('generatedText', text);
      
      return text;
    } catch (error) {
      console.error('Error generating text:', error);
      
      // Use a placeholder text in case of error
      const placeholderText = `✨ Introducing our latest ${userProfile.businessType} collection designed specifically for ${userProfile.targetAudience}! Our ${userProfile.styleVibe} approach ensures you'll stand out. Check out our website and follow us for more updates. #${userProfile.businessType.replace(/\s+/g, '')} #Trending`;
      
      setGeneratedText(placeholderText);
      sessionStorage.setItem('generatedText', placeholderText);
      
      toast({
        title: "Using placeholder text",
        description: "Text generation service is not available. Using placeholder text for testing.",
      });
      
      return placeholderText;
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
