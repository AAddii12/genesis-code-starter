
import { CaptionEditor } from "./CaptionEditor";
import { GenerationControls } from "./GenerationControls";
import { PreviewImage } from "./PreviewImage";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentPreviewCardProps {
  generatedImage: string | null;
  caption: string;
  setCaption: (caption: string) => void;
  userCredits: number | null;
  isGenerating: boolean;
  isLoading: boolean;
  generateContent: () => void;
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
  downloadContent,
  saveToMyContent,
}: ContentPreviewCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <PreviewImage generatedImage={generatedImage} isLoading={isGenerating} />
        </div>
        
        <div className="flex-1 flex flex-col">
          <CaptionEditor caption={caption} setCaption={setCaption} />
          
          <div className="mt-auto">
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
