
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useContentSaving = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveToMyContent = async (generatedImage: string | null, caption: string) => {
    if (!generatedImage || !caption) return;
    
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("user_content")
        .insert({
          user_id: user.id,
          image_url: generatedImage,
          caption: caption
        });
        
      if (error) throw error;
      
      toast({
        title: "Content saved",
        description: "Your content has been saved to My Content.",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error saving content",
        description: "Failed to save your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadContent = async (generatedImage: string | null) => {
    if (!generatedImage) return;
    
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // Set the href to the image URL
      link.href = generatedImage;
      
      // Set the download attribute to save with a filename
      link.download = `social-content-${new Date().getTime()}.png`;
      
      // Append to the body
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Remove the element
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your content is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading content:", error);
      toast({
        title: "Download failed",
        description: "Failed to download your content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    saveToMyContent,
    downloadContent
  };
};
