
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types";
import { ContentPreviewCard } from "@/components/preview/ContentPreviewCard";
import { UserProfileSummary } from "@/components/preview/UserProfileSummary";
import { BackgroundDecorations } from "@/components/preview/BackgroundDecorations";

const Preview = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);

  useEffect(() => {
    // Load user profile from session storage
    const storedProfile = sessionStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      // If no profile, redirect to onboarding
      navigate("/onboarding");
    }

    // Check user credits
    checkUserCredits();
  }, [navigate]);

  const checkUserCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        if (data) {
          setUserCredits(data.credits_remaining);
        }
      }
    } catch (error) {
      console.error("Error checking credits:", error);
    }
  };

  const generateContent = async () => {
    if (!userProfile) return;
    try {
      setIsGenerating(true);

      // Check if user has credits
      if (userCredits !== null && userCredits <= 0) {
        toast({
          title: "No credits available",
          description: "You've used all your credits. Please upgrade to continue.",
          variant: "destructive"
        });
        navigate("/pricing");
        return;
      }

      // First, generate image with FAL API
      const imagePrompt = `Create a modern social media post for a ${userProfile.businessType} targeting ${userProfile.targetAudience}, in a ${userProfile.styleVibe} style with ${userProfile.colorPalette} colors.`;

      // Mock image generation (replace with actual FAL API call)
      // In a real implementation, you would call the FAL API edge function
      setTimeout(() => {
        // Using placeholder image for now
        setGeneratedImage("/placeholder.svg");
      }, 1500);

      // Then, generate marketing text with OpenAI
      const textPrompt = `Write a short marketing caption for a ${userProfile.businessType} targeting ${userProfile.targetAudience}, with the goal of ${userProfile.businessGoal}. Use a ${userProfile.styleVibe} tone and include hashtags and a CTA.`;

      // Mock text generation (replace with actual OpenAI API call)
      // In a real implementation, you would call the OpenAI API edge function
      setTimeout(() => {
        const sampleCaption = `✨ Elevate your ${userProfile.businessType} experience with our latest offerings! Perfect for ${userProfile.targetAudience} looking to make a statement. \n\nTap the link in bio to explore more and transform your routine today! \n\n#${userProfile.businessType.charAt(0).toUpperCase() + userProfile.businessType.slice(1)}Life #${userProfile.businessGoal.charAt(0).toUpperCase() + userProfile.businessGoal.slice(1)}Goals #ContentForYou`;
        setCaption(sampleCaption);

        // Deduct credit after successful generation
        deductCredit();
      }, 2500);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deductCredit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && userCredits !== null) {
        const newCredits = userCredits - 1;
        const { error } = await supabase
          .from('user_credits')
          .update({
            credits_remaining: newCredits,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
        setUserCredits(newCredits);
      }
    } catch (error) {
      console.error("Error deducting credit:", error);
    }
  };

  const saveToMyContent = async () => {
    if (!generatedImage || !caption) {
      toast({
        title: "Nothing to save",
        description: "Please generate content first before saving."
      });
      return;
    }
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from("user_content")
          .insert({
            user_id: user.id,
            image_url: generatedImage,
            caption: caption
          });
          
        if (error) throw error;
        toast({
          title: "Saved to My Content",
          description: "Your content has been saved successfully."
        });
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Save failed",
        description: "Failed to save content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadContent = () => {
    // In a real implementation, this would create a PNG or PDF for download
    toast({
      title: "Download started",
      description: "Your content is being prepared for download."
    });
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#efe1f8] font-rubik relative rounded-none">
      <BackgroundDecorations />

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Content Preview</h1>
        
        <ContentPreviewCard
          generatedImage={generatedImage}
          caption={caption}
          setCaption={setCaption}
          userCredits={userCredits}
          isGenerating={isGenerating}
          isLoading={isLoading}
          generateContent={generateContent}
          downloadContent={downloadContent}
          saveToMyContent={saveToMyContent}
        />

        <UserProfileSummary userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Preview;
