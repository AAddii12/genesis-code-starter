
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import OnboardingCard from "@/components/onboarding/OnboardingCard";
import BusinessInfoForm from "@/components/onboarding/BusinessInfoForm";
import VisualPreferencesForm from "@/components/onboarding/VisualPreferencesForm";
import { UserProfile } from "@/components/onboarding/types";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    businessName: "",
    businessType: "",
    targetAudience: "",
    businessGoal: "",
    colorPalette: "",
    styleVibe: "",
    preferredPlatforms: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNextStep = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (data: Partial<UserProfile>) => {
    if (!user) {
      toast.error("You must be logged in to complete the onboarding");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    const finalProfile = { ...userProfile, ...data };
    
    try {
      const { error } = await supabase.from("user_profiles").insert({
        user_id: user.id,
        business_name: finalProfile.businessName,
        business_type: finalProfile.businessType,
        target_audience: finalProfile.targetAudience,
        business_goal: finalProfile.businessGoal,
        color_palette: finalProfile.colorPalette,
        style_vibe: finalProfile.styleVibe,
        preferred_platforms: finalProfile.preferredPlatforms,
      });

      if (error) throw error;

      toast.success("Profile created successfully!");
      navigate("/preview", { state: { userProfile: finalProfile } });
    } catch (error: any) {
      toast.error(`Failed to save profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      {step === 1 ? (
        <OnboardingCard title="Business Information">
          <BusinessInfoForm 
            defaultValues={{
              businessName: userProfile.businessName,
              businessType: userProfile.businessType,
              targetAudience: userProfile.targetAudience,
              businessGoal: userProfile.businessGoal
            }}
            onSubmit={handleNextStep}
          />
        </OnboardingCard>
      ) : (
        <OnboardingCard title="Visual Preferences">
          <VisualPreferencesForm
            defaultValues={{
              colorPalette: userProfile.colorPalette,
              styleVibe: userProfile.styleVibe,
              preferredPlatforms: userProfile.preferredPlatforms,
            }}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
            isSubmitting={isSubmitting}
          />
        </OnboardingCard>
      )}
    </div>
  );
};

export default Onboarding;
