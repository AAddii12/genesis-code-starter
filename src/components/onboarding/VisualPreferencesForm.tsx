
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types";
import { VisualPreviewSection } from "./VisualPreviewSection";
import { useTextGeneration } from "@/hooks/useTextGeneration";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { toast } from "@/hooks/use-toast";
import { ColorPaletteSelection } from "./form/ColorPaletteSelection";
import { StyleVibeSelection } from "./form/StyleVibeSelection";
import { PlatformSelection } from "./form/PlatformSelection";
import { FormNavigation } from "./form/FormNavigation";

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
  webhookUrl?: string;
}

export const VisualPreferencesForm = ({ 
  onBack, 
  onComplete, 
  initialValues = {}, 
  webhookUrl
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
      <ColorPaletteSelection 
        colorPalette={colorPalette} 
        setColorPalette={setColorPalette} 
        isDirty={isDirty} 
      />

      <StyleVibeSelection 
        styleVibe={styleVibe} 
        setStyleVibe={setStyleVibe} 
      />
      
      <VisualPreviewSection 
        colorPalette={colorPalette} 
        styleVibe={styleVibe}
        businessType={initialValues.businessType}
      />

      <PlatformSelection 
        preferredPlatforms={preferredPlatforms}
        togglePlatform={togglePlatform}
        error={error}
      />

      <FormNavigation 
        onBack={onBack}
        isSubmitting={isSubmitting}
        isGenerating={isGenerating}
        submitLabel="Let's Start"
        webhookUrl={webhookUrl}
      />
    </form>
  );
};
