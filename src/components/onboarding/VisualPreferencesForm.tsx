import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, Loader2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VisualPreviewSection } from "./VisualPreviewSection";
import { FormSavingIndicator } from "./FormSavingIndicator";
import { useTextGeneration } from "@/hooks/useTextGeneration";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { toast } from "@/hooks/use-toast";

interface VisualPreferencesFormProps {
  onBack: () => void;
  onComplete: (data: {
    colorPalette: UserProfile['colorPalette'];
    styleVibe: UserProfile['styleVibe'];
    preferredPlatforms: string[];
  }) => void;
  initialValues?: {
    businessType?: UserProfile['businessType'];
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
  const navigate = useNavigate();
  const { generateText, isGenerating: isGeneratingText } = useTextGeneration();
  const { generateImage, isGenerating: isGeneratingImage } = useImageGeneration();
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
  const [isDirty, setIsDirty] = useState(false);
  
  // Save to localStorage whenever form values change
  useEffect(() => {
    if (colorPalette || styleVibe || preferredPlatforms.length > 0) {
      setIsDirty(true);
      const timer = setTimeout(() => {
        const currentData = JSON.parse(localStorage.getItem("onboarding_form_data") || "{}");
        const updatedData = {
          ...currentData,
          colorPalette,
          styleVibe,
          preferredPlatforms
        };
        localStorage.setItem("onboarding_form_data", JSON.stringify(updatedData));
        setIsDirty(false);
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [colorPalette, styleVibe, preferredPlatforms]);
  
  const platforms = [
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "tiktok", label: "TikTok" },
    { id: "pinterest", label: "Pinterest" },
    { id: "linkedin", label: "LinkedIn" },
  ];

  const togglePlatform = (platform: string) => {
    setPreferredPlatforms(current => 
      current.includes(platform)
        ? current.filter(p => p !== platform)
        : [...current, platform]
    );
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (preferredPlatforms.length === 0) {
      setError("Please select at least one platform");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Collect form data first
      const formData = {
        colorPalette,
        styleVibe,
        preferredPlatforms
      };
      
      // Call the onComplete prop to save the form data
      await onComplete(formData);
      
      // Get the complete user profile from sessionStorage
      const userProfileJson = sessionStorage.getItem("userProfile");
      if (!userProfileJson) {
        throw new Error("User profile not found");
      }
      
      const userProfile = JSON.parse(userProfileJson) as UserProfile;
      
      // Show toast message
      toast({
        title: "Generating content",
        description: "Creating personalized content for your business...",
      });
      
      // Generate the marketing caption and image in parallel
      await Promise.all([
        generateText(userProfile),
        generateImage(userProfile)
      ]);
      
      // Navigate to the preview page
      navigate("/preview");
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "An error occurred",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const isGenerating = isGeneratingText || isGeneratingImage;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
      
      <VisualPreviewSection 
        colorPalette={colorPalette} 
        styleVibe={styleVibe}
        businessType={initialValues.businessType}
      />

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

      <div className="flex space-x-4 pt-2">
        <Button 
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 rounded-xl font-medium text-base border-gray-300"
          disabled={isSubmitting || isGenerating}
        >
          Back
        </Button>
        <Button 
          type="submit"
          className="flex-1 h-12 rounded-xl font-medium text-base bg-emerald-400 hover:bg-emerald-500"
          disabled={isSubmitting || isGenerating}
        >
          {(isSubmitting || isGenerating) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Let's Start"
          )}
        </Button>
      </div>
    </form>
  );
};
