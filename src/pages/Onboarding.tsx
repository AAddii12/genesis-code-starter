
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessInfoForm } from "@/components/onboarding/BusinessInfoForm";
import { VisualPreferencesForm } from "@/components/onboarding/VisualPreferencesForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UserProfile } from "@/types";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(false);

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
  };

  const handleVisualPreferencesSubmit = async (data: {
    colorPalette: UserProfile['colorPalette'];
    styleVibe: UserProfile['styleVibe'];
    preferredPlatforms: string[];
  }) => {
    try {
      setLoading(true);
      const fullProfile = { 
        ...userProfile, 
        colorPalette: data.colorPalette,
        styleVibe: data.styleVibe,
        preferredPlatforms: data.preferredPlatforms 
      } as UserProfile;
      
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {step === 1 ? "Business Information" : "Visual Preferences"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <BusinessInfoForm onNext={handleBusinessInfoSubmit} />
          ) : (
            <VisualPreferencesForm 
              onBack={() => setStep(1)} 
              onComplete={handleVisualPreferencesSubmit} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
