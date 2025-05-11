
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PreviewImageProps {
  generatedImage: string | null;
}

export const PreviewImage = ({ generatedImage }: PreviewImageProps) => {
  if (!generatedImage) {
    return (
      <div className="w-full aspect-square bg-[#f5f0fa] rounded-xl flex items-center justify-center border border-[#e5d8ff] shadow-inner">
        <p className="text-gray-400 font-medium">Image will appear here</p>
      </div>
    );
  }

  return (
    <AspectRatio ratio={1} className="w-full">
      <img 
        src={generatedImage} 
        alt="Generated content" 
        className="w-full h-full rounded-xl object-cover shadow-md" 
      />
    </AspectRatio>
  );
};
