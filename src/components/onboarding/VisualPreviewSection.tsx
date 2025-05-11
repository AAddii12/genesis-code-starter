
import { UserProfile } from "@/types";
import { Card } from "../ui/card";
import { PaletteSwatch } from "./PaletteSwatch";
import { StyleExample } from "./StyleExample";

interface VisualPreviewSectionProps {
  colorPalette?: UserProfile['colorPalette'];
  styleVibe?: UserProfile['styleVibe'];
  businessType?: UserProfile['businessType'];
}

export const VisualPreviewSection = ({ 
  colorPalette, 
  styleVibe,
  businessType 
}: VisualPreviewSectionProps) => {
  
  // Only render if at least one option is selected
  if (!colorPalette && !styleVibe) {
    return null;
  }
  
  return (
    <Card className="p-4 mt-6 border-dashed border-2 bg-white/80 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Preview your selections</h3>
      
      <div className="space-y-4">
        {colorPalette && (
          <div>
            <p className="text-xs text-gray-500">Color palette: <span className="font-medium text-gray-700">{colorPalette}</span></p>
            <PaletteSwatch type={colorPalette} />
          </div>
        )}
        
        {styleVibe && (
          <div>
            <p className="text-xs text-gray-500">Style vibe: <span className="font-medium text-gray-700">{styleVibe}</span></p>
            <StyleExample type={styleVibe} businessType={businessType} />
          </div>
        )}
        
        <p className="text-xs text-gray-400 italic">
          This is just a preview. Your final content will be professionally generated based on all your preferences.
        </p>
      </div>
    </Card>
  );
};
