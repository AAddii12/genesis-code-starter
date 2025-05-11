
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';

export const useTextGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const generateText = async (userProfile: UserProfile) => {
    setIsGenerating(true);
    
    try {
      // Generate the prompt with userProfile data
      const prompt = `Write a short marketing caption for a ${userProfile.businessType} business. The target audience is ${userProfile.targetAudience}. The goal is ${userProfile.businessGoal}. The style should be ${userProfile.styleVibe} and the color vibe is ${userProfile.colorPalette}. Include 1–2 hashtags and a clear call to action.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant for small business owners writing engaging social media captions."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content.trim();
      
      // Save the generated text
      setGeneratedText(text);
      sessionStorage.setItem('generatedText', text);
      
      return text;
    } catch (error) {
      console.error('Error generating text:', error);
      toast({
        title: "Error generating text",
        description: "Could not generate marketing caption. Please try again.",
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
