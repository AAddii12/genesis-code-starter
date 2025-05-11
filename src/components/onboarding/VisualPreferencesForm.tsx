
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface VisualPreferencesFormProps {
  onBack: () => void;
  onComplete: (data: {
    colorPalette: string;
    styleVibe: string;
    preferredPlatforms: string[];
  }) => void;
}

export const VisualPreferencesForm = ({ onBack, onComplete }: VisualPreferencesFormProps) => {
  const [colorPalette, setColorPalette] = useState("");
  const [styleVibe, setStyleVibe] = useState("");
  const [preferredPlatforms, setPreferredPlatforms] = useState<string[]>([]);
  
  const platforms = [
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "tiktok", label: "TikTok" },
  ];

  const togglePlatform = (platform: string) => {
    setPreferredPlatforms(current => 
      current.includes(platform)
        ? current.filter(p => p !== platform)
        : [...current, platform]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      colorPalette,
      styleVibe,
      preferredPlatforms
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="colorPalette">Preferred Color Palette</Label>
        <Select value={colorPalette} onValueChange={setColorPalette} required>
          <SelectTrigger id="colorPalette" className="w-full">
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

      <div className="space-y-2">
        <Label htmlFor="styleVibe">Style Vibe</Label>
        <Select value={styleVibe} onValueChange={setStyleVibe} required>
          <SelectTrigger id="styleVibe" className="w-full">
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

      <div className="space-y-2">
        <Label>Preferred Platforms</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {platforms.map(platform => (
            <div className="flex items-center space-x-2" key={platform.id}>
              <Checkbox 
                id={platform.id} 
                checked={preferredPlatforms.includes(platform.id)} 
                onCheckedChange={() => togglePlatform(platform.id)}
              />
              <label 
                htmlFor={platform.id}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {platform.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button 
          type="button"
          onClick={onBack}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button 
          type="submit"
          className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Complete
        </button>
      </div>
    </form>
  );
};
