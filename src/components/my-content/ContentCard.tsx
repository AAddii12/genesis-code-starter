
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share, Trash } from "lucide-react";

interface ContentCardProps {
  id: string;
  imageUrl: string;
  caption: string;
  onDownload: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export const ContentCard = ({
  id,
  imageUrl,
  caption,
  onDownload,
  onShare,
  onDelete,
}: ContentCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
      <div className="aspect-square overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Content" 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <p className="text-sm line-clamp-2 mb-4 text-gray-700">{caption}</p>
      </CardContent>
      <CardFooter className="p-4 bg-[#f9f6fd] flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload}
          className="w-full sm:w-auto border-[#c9b4e8] hover:bg-[#f5f0fa] text-[#7e69ab]"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShare}
          className="w-full sm:w-auto border-[#c9b4e8] hover:bg-[#f5f0fa] text-[#7e69ab]"
        >
          <Share className="h-4 w-4 mr-1" />
          Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDelete}
          className="w-full sm:w-auto border-[#c9b4e8] hover:bg-[#f5f0fa] text-[#7e69ab]"
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
