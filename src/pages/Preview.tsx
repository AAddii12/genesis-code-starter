
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const userProfile = location.state?.userProfile;

  useEffect(() => {
    if (!user) {
      toast.error("You need to be logged in");
      navigate("/auth");
      return;
    }
    
    if (!userProfile) {
      toast.error("No profile data found. Please complete the onboarding first.");
      navigate("/onboarding");
      return;
    }

    const generateContent = async () => {
      setIsGenerating(true);
      
      try {
        // Call edge function for image generation
        const imagePrompt = `Create a modern social media post for a ${userProfile.businessType} targeting ${userProfile.targetAudience}, in a ${userProfile.styleVibe} style with ${userProfile.colorPalette} colors.`;
        
        // In a real app, you would call an API like FAL here
        // For demo purposes we'll use a placeholder image
        const mockImageUrl = "https://via.placeholder.com/800x800?text=Generated+Image";
        setImageUrl(mockImageUrl);
        
        // Generate caption with OpenAI (in a real app)
        const captionPrompt = `Write a short marketing caption for a ${userProfile.businessType} targeting ${userProfile.targetAudience}, with the goal of ${userProfile.businessGoal}. Use a ${userProfile.styleVibe} tone and include hashtags and a CTA.`;
        
        // Mock caption for demo
        const mockCaption = `✨ Elevate your ${userProfile.businessType} experience! ✨\n\nDesigned specifically for ${userProfile.targetAudience}, our latest offering helps you achieve your ${userProfile.businessGoal} goals with style and efficiency.\n\nTap the link in bio to learn more! 👇\n\n#${userProfile.businessType.replace(' ', '')} #${userProfile.businessGoal.replace(' ', '')} #ContentThatConverts`;
        setCaption(mockCaption);
      } catch (error) {
        console.error("Error generating content:", error);
        toast.error("Failed to generate content. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    };

    generateContent();
  }, [userProfile, navigate, user]);

  const handleSaveContent = async () => {
    if (!user) {
      toast.error("You need to be logged in");
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase.from("user_content").insert({
        user_id: user.id,
        image_url: imageUrl,
        caption: caption
      });

      if (error) throw error;
      toast.success("Content saved successfully!");
      navigate("/my-content");
    } catch (error: any) {
      toast.error(`Error saving content: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    // In a real app, you would implement proper image downloading
    // For this demo, we'll just open the image in a new tab
    window.open(imageUrl, '_blank');
    toast.success("Download started!");
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Content Preview</h1>
      
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg">Generating your content...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img 
                src={imageUrl} 
                alt="Generated content" 
                className="w-full h-auto object-cover" 
              />
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <label className="block font-medium mb-2">Caption</label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[200px]"
              placeholder="Edit your caption here..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
            >
              Download
            </Button>
            <Button
              onClick={handleSaveContent}
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save to My Content"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
