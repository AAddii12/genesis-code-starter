
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Download, Share, Trash } from "lucide-react";

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
    // Implement download functionality
    toast({
      title: "Download started",
      description: "Your content is being prepared for download.",
    });
  };

  const handleShare = async (item: ContentItem) => {
    // Simple share implementation
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out my content!",
          text: item.caption,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Content</h1>
        
        {contentItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">You haven't saved any content yet.</p>
            <Button onClick={() => window.location.href = "/preview"} className="mt-4">
              Create Content
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt="Content" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm line-clamp-2 mb-4">{item.caption}</p>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownload(item)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleShare(item)}
                    >
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContent;
