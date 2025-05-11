
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessInfoForm } from "@/components/onboarding/BusinessInfoForm";
import { VisualPreferencesForm } from "@/components/onboarding/VisualPreferencesForm";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UserProfile } from "@/types";

const ONBOARDING_STORAGE_KEY = "onboarding_form_data";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>(() => {
    // Try to load saved form data from localStorage
    const savedData = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  });
  const [loading, setLoading] = useState(false);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(userProfile));
  }, [userProfile]);

  const handleBusinessInfoSubmit = (data: {
    businessName: string;
    businessType: UserProfile['businessType'];
    targetAudience: string;
    businessGoal: UserProfile['businessGoal'];
  }) => {
    setUserProfile((prev) => ({ 
      ...prev, 
      businessName: data.businessName,
      businessType: data.businessType,
      targetAudience: data.targetAudience,
      businessGoal: data.businessGoal 
    }));
    setStep(2);
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  const handleVisualPreferencesSubmit = async (data: {
    colorPalette: UserProfile['colorPalette'];
    styleVibe: UserProfile['styleVibe'];
    preferredPlatforms: string[];
  }) => {
    try {
      setLoading(true);
      
      // Update the userProfile state with the final data
      const fullProfile: UserProfile = { 
        ...userProfile, 
        colorPalette: data.colorPalette,
        styleVibe: data.styleVibe,
        preferredPlatforms: data.preferredPlatforms 
      } as UserProfile;
      
      setUserProfile(fullProfile);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to Supabase
        const { error } = await supabase.from("user_profiles").insert({
          user_id: user.id,
          business_name: fullProfile.businessName,
          business_type: fullProfile.businessType,
          target_audience: fullProfile.targetAudience,
          business_goal: fullProfile.businessGoal,
          color_palette: fullProfile.colorPalette,
          style_vibe: fullProfile.styleVibe,
          preferred_platforms: fullProfile.preferredPlatforms,
        });
        
        if (error) throw error;
      } 
      
      // Store profile in session storage for use across the app
      sessionStorage.setItem("userProfile", JSON.stringify(fullProfile));
      
      // We've completed the onboarding, clear the temporary storage
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      
      toast({
        title: "Profile complete!",
        description: "Let's start generating content for your business.",
      });
      
      navigate("/preview");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "An error occurred",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-rubik">
      <Card className="w-full max-w-md rounded-2xl shadow-lg border-0">
        <CardHeader className="pb-2 pt-8">
          <CardTitle className="text-center text-2xl font-bold">
            {step === 1 ? "Business Information" : "Visual Preferences"}
          </CardTitle>
          <div className="mt-6">
            <ProgressIndicator currentStep={step} totalSteps={2} />
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-8 px-8">
          {step === 1 ? (
            <BusinessInfoForm 
              onNext={handleBusinessInfoSubmit} 
              initialValues={userProfile}
            />
          ) : (
            <VisualPreferencesForm 
              onBack={handleBack} 
              onComplete={handleVisualPreferencesSubmit}
              initialValues={userProfile}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
