
import { Button } from "@/components/ui/button";
import { Loader2, DownloadCloud, Save } from "lucide-react";

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
        <p className="text-sm text-gray-500 mb-1 font-medium">
          Credits remaining: <span className="text-[#9b87f5] font-semibold">{userCredits}</span>
        </p>
      )}
      
      <Button 
        onClick={generateContent} 
        disabled={isGenerating} 
        className="w-full text-base bg-[#9b87f5] hover:bg-[#7e69ab] text-white font-medium py-6 rounded-xl transition-all transform hover:translate-y-[-2px]"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : "Generate Content"}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={downloadContent} 
        disabled={!generatedImage || isLoading} 
        className="w-full rounded-xl border-[#c9b4e8] hover:bg-[#f5f0fa] text-[#7e69ab] py-5"
      >
        <DownloadCloud className="mr-2 h-4 w-4" />
        Download
      </Button>
      
      <Button 
        onClick={saveToMyContent} 
        disabled={!generatedImage || isLoading} 
        className="w-full font-medium text-base bg-[#e5d8ff] hover:bg-[#d6bcfa] text-[#6e59a5] py-5 rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save to My Content
          </>
        )}
      </Button>
    </div>
  );
};
