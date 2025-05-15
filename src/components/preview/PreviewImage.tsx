
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface PreviewImageProps {
  generatedImage: string | null;
  isLoading?: boolean;
}

export const PreviewImage = ({ generatedImage, isLoading = false }: PreviewImageProps) => {
  if (isLoading) {
    return (
      <AspectRatio ratio={1} className="w-full">
        <div className="h-full w-full rounded-xl bg-[#f5f0fa] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-32 w-32 rounded-full" />
            <p className="text-gray-400 animate-pulse">Generating image...</p>
          </div>
        </div>
      </AspectRatio>
    );
  }
  
  if (!generatedImage) {
    return (
      <div className="w-full aspect-square bg-[#f5f0fa] rounded-xl flex flex-col items-center justify-center border border-[#e5d8ff] shadow-inner gap-3">
        <AlertTriangle className="h-10 w-10 text-gray-300" />
        <p className="text-gray-400 font-medium">No image generated yet</p>
        <p className="text-xs text-gray-400">Click "Generate Content" to create an image</p>
      </div>
    );
  }

  // Check if it's a placeholder from placehold.co
  const isPlaceholder = generatedImage.includes('placehold.co');

  return (
    <AspectRatio ratio={1} className="w-full">
      <div className="w-full h-full rounded-xl overflow-hidden relative">
        <img 
          src={generatedImage} 
          alt="Generated social media content" 
          className="w-full h-full object-cover shadow-md transition-all duration-300 hover:shadow-lg" 
        />
        {isPlaceholder && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 text-center">
            Using placeholder image - Set up API keys for real image generation
          </div>
        )}
      </div>
    </AspectRatio>
  );
};
