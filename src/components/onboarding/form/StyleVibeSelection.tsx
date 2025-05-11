
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserProfile } from "@/types";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StyleVibeSelectionProps {
  styleVibe: UserProfile['styleVibe'];
  setStyleVibe: (value: UserProfile['styleVibe']) => void;
}

export const StyleVibeSelection: React.FC<StyleVibeSelectionProps> = ({
  styleVibe,
  setStyleVibe,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <Label htmlFor="styleVibe" className="text-base font-medium">Style Vibe</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose a style that reflects your brand's personality</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select 
        value={styleVibe} 
        onValueChange={(value: UserProfile['styleVibe']) => setStyleVibe(value)}
      >
        <SelectTrigger id="styleVibe" className="h-12 rounded-xl shadow-sm border-gray-200">
          <SelectValue placeholder="Select style vibe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="minimalist">Minimalist</SelectItem>
          <SelectItem value="playful">Playful</SelectItem>
          <SelectItem value="elegant">Elegant</SelectItem>
          <SelectItem value="high-tech">High-Tech</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
