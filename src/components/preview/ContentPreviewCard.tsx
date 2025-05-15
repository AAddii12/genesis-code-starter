
import { CaptionEditor } from "./CaptionEditor";
import { GenerationControls } from "./GenerationControls";
import { PreviewImage } from "./PreviewImage";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ContentPreviewCardProps {
  generatedImage: string | null;
  caption: string;
  setCaption: (caption: string) => void;
  userCredits: number | null;
  isGenerating: boolean;
  isLoading: boolean;
  generateContent: () => void;
  generateWithGemini: () => void;
  isGeminiGenerating: boolean;
  downloadContent: () => void;
  saveToMyContent: () => void;
}

export const ContentPreviewCard = ({
  generatedImage,
  caption,
  setCaption,
  userCredits,
  isGenerating,
  isLoading,
  generateContent,
  generateWithGemini,
  isGeminiGenerating,
  downloadContent,
  saveToMyContent,
}: ContentPreviewCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <PreviewImage generatedImage={generatedImage} />
        </div>
        
        <div className="flex-1 flex flex-col">
          <CaptionEditor caption={caption} setCaption={setCaption} />
          
          <div className="mt-auto">
            <Button 
              onClick={generateWithGemini} 
              disabled={isGeminiGenerating} 
              className="w-full text-base bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium py-6 mb-3 rounded-xl transition-all transform hover:translate-y-[-2px]"
            >
              {isGeminiGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with Gemini AI
                </>
              )}
            </Button>
            
            <GenerationControls
              userCredits={userCredits}
              isGenerating={isGenerating}
              isLoading={isLoading}
              generatedImage={generatedImage}
              generateContent={generateContent}
              downloadContent={downloadContent}
              saveToMyContent={saveToMyContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
