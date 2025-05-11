
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
import { FormSavingIndicator } from "../FormSavingIndicator";

interface ColorPaletteSelectionProps {
  colorPalette: UserProfile['colorPalette'];
  setColorPalette: (value: UserProfile['colorPalette']) => void;
  isDirty: boolean;
}

export const ColorPaletteSelection: React.FC<ColorPaletteSelectionProps> = ({
  colorPalette,
  setColorPalette,
  isDirty,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Label htmlFor="colorPalette" className="text-base font-medium">Color Palette</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select a color scheme that matches your brand personality</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <FormSavingIndicator isDirty={isDirty} />
      </div>
      <Select 
        value={colorPalette} 
        onValueChange={(value: UserProfile['colorPalette']) => setColorPalette(value)}
      >
        <SelectTrigger id="colorPalette" className="h-12 rounded-xl shadow-sm border-gray-200">
          <SelectValue placeholder="Select color palette" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="soft pastels">Soft Pastels</SelectItem>
          <SelectItem value="neon bold">Neon Bold</SelectItem>
          <SelectItem value="monochrome">Monochrome</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
