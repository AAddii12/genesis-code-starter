
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface VisualPreferencesFormProps {
  onBack: () => void;
  onComplete: (data: {
    colorPalette: UserProfile['colorPalette'];
    styleVibe: UserProfile['styleVibe'];
    preferredPlatforms: string[];
  }) => void;
  initialValues?: {
    colorPalette?: UserProfile['colorPalette'];
    styleVibe?: UserProfile['styleVibe'];
    preferredPlatforms?: string[];
  };
}

export const VisualPreferencesForm = ({ 
  onBack, 
  onComplete, 
  initialValues = {} 
}: VisualPreferencesFormProps) => {
  const [colorPalette, setColorPalette] = useState<UserProfile['colorPalette']>(
    initialValues.colorPalette || "soft pastels"
  );
  const [styleVibe, setStyleVibe] = useState<UserProfile['styleVibe']>(
    initialValues.styleVibe || "minimalist"
  );
  const [preferredPlatforms, setPreferredPlatforms] = useState<string[]>(
    initialValues.preferredPlatforms || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (preferredPlatforms.length === 0) {
      setError("Please select at least one platform");
      setIsSubmitting(false);
      return;
    }
    
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
        <Select 
          value={colorPalette} 
          onValueChange={(value: UserProfile['colorPalette']) => setColorPalette(value)}
        >
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
        <Select 
          value={styleVibe} 
          onValueChange={(value: UserProfile['styleVibe']) => setStyleVibe(value)}
        >
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
        <div className="flex items-center justify-between">
          <Label>Preferred Platforms</Label>
          {error && (
            <span className="text-xs text-destructive flex items-center">
              <AlertCircle size={12} className="mr-1" /> {error}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {platforms.map(platform => (
            <div className="flex items-center space-x-2" key={platform.id}>
              <Checkbox 
                id={platform.id} 
                checked={preferredPlatforms.includes(platform.id)} 
                onCheckedChange={() => togglePlatform(platform.id)}
                className={error ? "border-destructive" : ""}
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
        <Button 
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Complete"}
        </Button>
      </div>
    </form>
  );
};
