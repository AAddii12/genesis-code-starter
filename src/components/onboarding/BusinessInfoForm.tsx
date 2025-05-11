
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { TextInputField } from "./form/TextInputField";
import { BusinessTypeSelect } from "./form/BusinessTypeSelect";
import { BusinessGoalSelect } from "./form/BusinessGoalSelect";

interface BusinessInfoFormProps {
  onNext: (data: {
    businessName: string;
    businessType: UserProfile['businessType'];
    targetAudience: string;
    businessGoal: UserProfile['businessGoal'];
  }) => void;
  initialValues?: {
    businessName?: string;
    businessType?: UserProfile['businessType'];
    targetAudience?: string;
    businessGoal?: UserProfile['businessGoal'];
  };
}

export const BusinessInfoForm = ({ onNext, initialValues = {} }: BusinessInfoFormProps) => {
  const [businessName, setBusinessName] = useState(initialValues.businessName || "");
  const [businessType, setBusinessType] = useState<UserProfile['businessType']>(initialValues.businessType || "beauty");
  const [targetAudience, setTargetAudience] = useState(initialValues.targetAudience || "");
  const [businessGoal, setBusinessGoal] = useState<UserProfile['businessGoal']>(initialValues.businessGoal || "sales");
  
  // Validation states
  const [errors, setErrors] = useState<{
    businessName?: string;
    targetAudience?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track if the form has been modified since last save
  const [isDirty, setIsDirty] = useState(false);
  
  // Save to localStorage whenever form values change
  useEffect(() => {
    if (businessName || targetAudience || businessType || businessGoal) {
      setIsDirty(true);
      const timer = setTimeout(() => {
        const formData = {
          businessName,
          businessType,
          targetAudience,
          businessGoal
        };
        localStorage.setItem("onboarding_form_data", JSON.stringify(formData));
        setIsDirty(false);
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [businessName, businessType, targetAudience, businessGoal]);

  const validateForm = () => {
    const newErrors: {
      businessName?: string;
      targetAudience?: string;
    } = {};
    
    if (!businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    
    if (!targetAudience.trim()) {
      newErrors.targetAudience = "Target audience is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      onNext({
        businessName,
        businessType,
        targetAudience,
        businessGoal
      });
    }
    setIsSubmitting(false);
  };

  const clearBusinessNameError = () => {
    setErrors(prev => ({ ...prev, businessName: undefined }));
  };

  const clearTargetAudienceError = () => {
    setErrors(prev => ({ ...prev, targetAudience: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <TextInputField
        id="businessName"
        label="Business Name"
        value={businessName}
        onChange={setBusinessName}
        placeholder="Enter your business name"
        error={errors.businessName}
        isDirty={isDirty}
        onClearError={clearBusinessNameError}
      />

      <BusinessTypeSelect
        value={businessType}
        onChange={setBusinessType}
        isDirty={isDirty}
      />

      <TextInputField
        id="targetAudience"
        label="Target Audience"
        value={targetAudience}
        onChange={setTargetAudience}
        placeholder="Describe your target audience"
        tooltip="Describe your ideal customers (e.g., 'women 25-40 interested in fitness' or 'small business owners')"
        error={errors.targetAudience}
        isDirty={isDirty}
        onClearError={clearTargetAudienceError}
      />

      <BusinessGoalSelect
        value={businessGoal}
        onChange={setBusinessGoal}
        isDirty={isDirty}
      />

      <Button 
        type="submit"
        className="w-full h-12 text-base font-medium bg-emerald-400 hover:bg-emerald-500 rounded-xl mt-4 transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Next"}
      </Button>
    </form>
  );
};
