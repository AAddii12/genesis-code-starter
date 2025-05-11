
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BackgroundDecorations } from "@/components/preview/BackgroundDecorations";
import { ContentCard } from "@/components/my-content/ContentCard";
import { EmptyState } from "@/components/my-content/EmptyState";

interface ContentItem {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
}

const MyContent = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserContent();
  }, []);

  const fetchUserContent = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from("user_content")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        setContentItems(data || []);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "Failed to load content",
        description: "There was a problem loading your saved content.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (item: ContentItem) => {
    toast({
      title: "Download started",
      description: "Your content is being prepared for download.",
    });
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = item.image_url;
    link.download = `content-${item.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (item: ContentItem) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out my content!",
          text: item.caption,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(item.caption);
        toast({
          title: "Caption copied to clipboard",
          description: "You can now paste it in your preferred app.",
        });
      }
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_content")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setContentItems(contentItems.filter(item => item.id !== id));
      
      toast({
        title: "Content deleted",
        description: "The content has been removed from your library.",
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#efe1f8] dark:bg-gray-900 font-rubik">
        <div className="animate-pulse text-[#7e69ab] dark:text-[#c9b4e8] font-medium text-lg">
          Loading your content...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efe1f8] dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-rubik relative">
      <BackgroundDecorations />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">My Content</h1>
        
        {contentItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentItems.map(item => (
              <ContentCard
                key={item.id}
                id={item.id}
                imageUrl={item.image_url}
                caption={item.caption}
                onDownload={() => handleDownload(item)}
                onShare={() => handleShare(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContent;
