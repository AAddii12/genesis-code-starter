
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlatformSelectionProps {
  preferredPlatforms: string[];
  togglePlatform: (platform: string) => void;
  error: string | null;
}

export const PlatformSelection: React.FC<PlatformSelectionProps> = ({
  preferredPlatforms,
  togglePlatform,
  error,
}) => {
  const platforms = [
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "tiktok", label: "TikTok" },
    { id: "pinterest", label: "Pinterest" },
    { id: "linkedin", label: "LinkedIn" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Label className="text-base font-medium">Preferred Platforms</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select where you want to publish your content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {error && (
          <span className="text-xs text-destructive flex items-center">
            <AlertCircle size={12} className="mr-1" /> {error}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
        {platforms.map(platform => (
          <div 
            className={`flex items-center space-x-3 p-3 bg-white rounded-lg border shadow-sm transition-colors ${
              preferredPlatforms.includes(platform.id) 
                ? 'border-emerald-300 bg-emerald-50' 
                : 'border-gray-200'
            }`} 
            key={platform.id}
          >
            <Checkbox 
              id={platform.id} 
              checked={preferredPlatforms.includes(platform.id)} 
              onCheckedChange={() => togglePlatform(platform.id)}
              className={error ? "border-destructive" : ""}
            />
            <label 
              htmlFor={platform.id}
              className="text-base font-medium leading-none cursor-pointer"
            >
              {platform.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
