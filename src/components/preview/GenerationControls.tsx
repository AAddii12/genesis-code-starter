
import { Button } from "@/components/ui/button";

interface GenerationControlsProps {
  userCredits: number | null;
  isGenerating: boolean;
  isLoading: boolean;
  generatedImage: string | null;
  generateContent: () => void;
  downloadContent: () => void;
  saveToMyContent: () => void;
}

export const GenerationControls = ({ 
  userCredits,
  isGenerating,
  isLoading,
  generatedImage,
  generateContent,
  downloadContent,
  saveToMyContent
}: GenerationControlsProps) => {
  return (
    <div className="flex flex-col space-y-3">
      {userCredits !== null && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
          Credits remaining: <span className="text-[#9b87f5] dark:text-[#c9b4e8] font-semibold">{userCredits}</span>
        </p>
      )}
      
      <Button 
        onClick={generateContent} 
        disabled={isGenerating} 
        className="w-full text-base bg-[#9b87f5] hover:bg-[#7e69ab] dark:bg-[#7e69ab] dark:hover:bg-[#6e59a5] text-white font-medium py-6 rounded-xl transition-all transform hover:translate-y-[-2px]"
      >
        {isGenerating ? "Generating..." : "Generate Content"}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={downloadContent} 
        disabled={!generatedImage || isLoading} 
        className="w-full rounded-xl border-[#c9b4e8] dark:border-[#6e59a5] hover:bg-[#f5f0fa] dark:hover:bg-[#32294d] text-[#7e69ab] dark:text-[#c9b4e8] py-5"
      >
        Download
      </Button>
      
      <Button 
        onClick={saveToMyContent} 
        disabled={!generatedImage || isLoading} 
        className="w-full font-medium text-base bg-[#e5d8ff] dark:bg-[#32294d] hover:bg-[#d6bcfa] dark:hover:bg-[#483966] text-[#6e59a5] dark:text-[#c9b4e8] py-5 rounded-xl"
      >
        {isLoading ? "Saving..." : "Save to My Content"}
      </Button>
    </div>
  );
};
