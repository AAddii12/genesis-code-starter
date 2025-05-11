
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface PostIdeaFormProps {
  onSubmit?: (idea: string) => void;
  webhookUrl?: string;
}

export const PostIdeaForm = ({ onSubmit, webhookUrl }: PostIdeaFormProps) => {
  const [postIdea, setPostIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useUserProfile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostIdea(e.target.value);
    if (error && e.target.value.length >= 5) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate minimum 5 characters
    if (postIdea.trim().length < 5) {
      setError("Please enter at least 5 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      // Store the idea in session storage
      sessionStorage.setItem("user_post_idea", postIdea);
      
      // If onSubmit callback is provided, call it
      if (onSubmit) {
        onSubmit(postIdea);
      }

      // If webhook URL is provided, trigger it with all data
      if (webhookUrl) {
        // Combine the post idea with the user profile data
        const payload = {
          user_post_idea: postIdea,
          // Include all user profile data from onboarding
          business_name: userProfile?.businessName || "",
          business_type: userProfile?.businessType || "",
          target_audience: userProfile?.targetAudience || "",
          business_goal: userProfile?.businessGoal || "",
          color_palette: userProfile?.colorPalette || "",
          style_vibe: userProfile?.styleVibe || "",
          preferred_platforms: userProfile?.preferredPlatforms || [],
        };

        // Trigger the webhook
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors", // Important for cross-origin webhook calls
          body: JSON.stringify(payload),
        });

        // Even with no-cors, we assume it was successful since we can't check status
        toast({
          title: "Generating your post...",
          description: "We're creating your custom content now!",
        });
      }

      // Clear form after successful submission
      setPostIdea("");
      setError(null);
    } catch (error) {
      console.error("Error submitting post idea:", error);
      toast({
        title: "Something went wrong",
        description: "Failed to submit your post idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8 border-0 shadow-lg rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold">What's your post about?</CardTitle>
        <CardDescription className="text-base">
          Write 1–2 short sentences about what you want to post today.
          This helps us create a personalized image and caption for your business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="postIdea" className="block text-sm font-medium">
              Your idea
            </label>
            <Input
              id="postIdea"
              value={postIdea}
              onChange={handleInputChange}
              placeholder="e.g. &quot;New discount on eyelash extensions&quot; or &quot;Why coaching mindset is key in 2024&quot;"
              className={`h-12 ${error ? "border-destructive" : "border-gray-200"}`}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-12 text-base font-medium bg-emerald-400 hover:bg-emerald-500 rounded-xl transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span> Generating...
              </span>
            ) : (
              <span className="flex items-center">
                Generate my post! <Send className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
