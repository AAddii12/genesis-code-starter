
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Download, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

type UserContent = {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
};

const MyContent = () => {
  const [content, setContent] = useState<UserContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("You need to be logged in");
      navigate("/auth");
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_content")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setContent(data || []);
      } catch (error: any) {
        toast.error(`Error fetching content: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [user, navigate]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("user_content").delete().eq("id", id);
      if (error) throw error;
      
      setContent((prevContent) => prevContent.filter((item) => item.id !== id));
      toast.success("Content deleted successfully");
    } catch (error: any) {
      toast.error(`Error deleting content: ${error.message}`);
    }
  };

  const handleShare = (caption: string) => {
    // In a real app, you would implement sharing via email or WhatsApp
    // For demo purposes we'll copy to clipboard
    navigator.clipboard.writeText(caption);
    toast.success("Caption copied to clipboard!");
  };

  const handleDownload = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
    toast.success("Download started!");
  };

  if (loading) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[400px] py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading your content...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Content</h1>
      
      {content.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">You don't have any saved content yet.</p>
          <Button onClick={() => navigate("/onboarding")}>Create New Content</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={item.image_url} 
                  alt="Generated content" 
                  className="w-full h-60 object-cover" 
                />
                <div className="p-4">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {item.caption}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-3 gap-2 p-4 pt-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDownload(item.image_url)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare(item.caption)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContent;
