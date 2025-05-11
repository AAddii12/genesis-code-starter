
import { useState } from "react";
import { PostIdeaForm } from "@/components/post-idea/PostIdeaForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PostIdea = () => {
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    // Try to get webhook URL from session storage or use a default
    return sessionStorage.getItem("webhook_url") || "";
  });

  // Handle profile submission
  const handleSubmitIdea = (idea: string) => {
    console.log("Post idea submitted:", idea);
    // After successful submission, navigate to the preview page
    navigate("/preview");
  };

  // If user profile is missing, redirect to onboarding
  if (!userProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#efe1f8] p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Profile not found</AlertTitle>
          <AlertDescription>
            You need to complete the onboarding process before creating posts.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/onboarding")}>
          Go to Onboarding
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#efe1f8]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Create New Content</h1>
        
        {/* Webhook URL Input (for development/testing) */}
        <div className="mb-8">
          <div className="p-4 bg-white rounded-xl shadow-sm mb-4">
            <label htmlFor="webhookUrl" className="block text-sm font-medium mb-2">
              Make Integration Webhook URL
            </label>
            <div className="flex gap-3">
              <input
                id="webhookUrl"
                type="text"
                value={webhookUrl}
                onChange={(e) => {
                  setWebhookUrl(e.target.value);
                  sessionStorage.setItem("webhook_url", e.target.value);
                }}
                placeholder="Enter your Make webhook URL here"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button 
                onClick={() => setWebhookUrl("")}
                variant="outline"
                size="sm"
              >
                Clear
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your Make webhook URL to connect the form data to your integration flow.
            </p>
          </div>
        </div>

        {/* Post Idea Form */}
        <PostIdeaForm 
          onSubmit={handleSubmitIdea}
          webhookUrl={webhookUrl}
        />
      </div>
    </div>
  );
};

export default PostIdea;
