
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormSavingIndicator } from "./FormSavingIndicator";

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

  // Extended business type options
  const businessTypes = [
    { value: "beauty", label: "Beauty & Wellness" },
    { value: "food", label: "Food & Beverages" },
    { value: "coaching", label: "Coaching & Consulting" },
    { value: "handmade", label: "Handmade & Crafts" },
    { value: "fashion", label: "Fashion & Apparel" },
    { value: "tech", label: "Technology" },
    { value: "education", label: "Education" },
    { value: "fitness", label: "Fitness & Health" },
    { value: "other", label: "Other" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="businessName" className="flex items-center text-base font-medium">
            Business Name
            {errors.businessName && (
              <span className="ml-2 text-xs text-destructive flex items-center">
                <AlertCircle size={12} className="mr-1" /> {errors.businessName}
              </span>
            )}
          </Label>
          <FormSavingIndicator isDirty={isDirty} className="mr-1" />
        </div>
        <Input
          id="businessName"
          placeholder="Enter your business name"
          value={businessName}
          onChange={(e) => {
            setBusinessName(e.target.value);
            if (e.target.value.trim()) {
              setErrors(prev => ({ ...prev, businessName: undefined }));
            }
          }}
          className={`h-12 rounded-xl shadow-sm ${errors.businessName ? "border-destructive" : "border-gray-200"}`}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <Label htmlFor="businessType" className="text-base font-medium">Business Type</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Selecting your business type helps us tailor content to your specific industry.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={businessType} onValueChange={(value: UserProfile['businessType']) => setBusinessType(value)}>
          <SelectTrigger id="businessType" className="h-12 rounded-xl shadow-sm border-gray-200">
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <Label htmlFor="targetAudience" className="flex items-center text-base font-medium">
            Target Audience
            {errors.targetAudience && (
              <span className="ml-2 text-xs text-destructive flex items-center">
                <AlertCircle size={12} className="mr-1" /> {errors.targetAudience}
              </span>
            )}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Describe your ideal customers (e.g., "women 25-40 interested in fitness" or "small business owners")</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="targetAudience"
          placeholder="Describe your target audience"
          value={targetAudience}
          onChange={(e) => {
            setTargetAudience(e.target.value);
            if (e.target.value.trim()) {
              setErrors(prev => ({ ...prev, targetAudience: undefined }));
            }
          }}
          className={`h-12 rounded-xl shadow-sm ${errors.targetAudience ? "border-destructive" : "border-gray-200"}`}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <Label htmlFor="businessGoal" className="text-base font-medium">Business Goal</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>What do you want to achieve with your social media content?</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={businessGoal} onValueChange={(value: UserProfile['businessGoal']) => setBusinessGoal(value)}>
          <SelectTrigger id="businessGoal" className="h-12 rounded-xl shadow-sm border-gray-200">
            <SelectValue placeholder="Select business goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Increase Sales</SelectItem>
            <SelectItem value="visibility">Brand Visibility</SelectItem>
            <SelectItem value="community">Build Community</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
