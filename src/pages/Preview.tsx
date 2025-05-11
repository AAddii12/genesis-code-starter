import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types";
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
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        const {
          data,
          error
        } = await supabase.from('user_credits').select('credits_remaining').eq('user_id', user.id).single();
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
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user && userCredits !== null) {
        const newCredits = userCredits - 1;
        const {
          error
        } = await supabase.from('user_credits').update({
          credits_remaining: newCredits,
          updated_at: new Date().toISOString()
        }).eq('user_id', user.id);
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
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        const {
          error
        } = await supabase.from("user_content").insert({
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
    return <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>;
  }
  return <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#efe1f8] rounded-none">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Content Preview</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              {generatedImage ? <img src={generatedImage} alt="Generated content" className="w-full h-auto rounded-lg object-cover" /> : <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Image will appear here</p>
                </div>}
            </div>
            
            <div className="flex-1">
              <Textarea placeholder="Your caption will appear here after generation" value={caption} onChange={e => setCaption(e.target.value)} className="min-h-[200px]" />
              
              <div className="mt-4 flex flex-col space-y-2">
                {userCredits !== null && <p className="text-sm text-gray-500 mb-2">
                    Credits remaining: {userCredits}
                  </p>}
                <Button onClick={generateContent} disabled={isGenerating} className="w-full text-base bg-[#c1f2b1]/[0.53] text-gray-950 font-semibold">
                  {isGenerating ? "Generating..." : "Generate Content"}
                </Button>
                <Button variant="outline" onClick={downloadContent} disabled={!generatedImage || isLoading} className="w-full">
                  Download
                </Button>
                <Button onClick={saveToMyContent} disabled={!generatedImage || isLoading} className="w-full font-normal text-base bg-[#bceeab]/[0.53] text-gray-950">
                  {isLoading ? "Saving..." : "Save to My Content"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Your Business Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Business Name</p>
                <p>{userProfile.businessName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Business Type</p>
                <p>{userProfile.businessType}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Target Audience</p>
                <p>{userProfile.targetAudience}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Business Goal</p>
                <p>{userProfile.businessGoal}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Color Palette</p>
                <p>{userProfile.colorPalette}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Style Vibe</p>
                <p>{userProfile.styleVibe}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Preview;