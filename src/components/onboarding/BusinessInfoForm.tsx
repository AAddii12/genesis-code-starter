
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessName" className="flex items-center">
          Business Name
          {errors.businessName && (
            <span className="ml-2 text-xs text-destructive flex items-center">
              <AlertCircle size={12} className="mr-1" /> {errors.businessName}
            </span>
          )}
        </Label>
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
          className={errors.businessName ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">Business Type</Label>
        <Select value={businessType} onValueChange={(value: UserProfile['businessType']) => setBusinessType(value)}>
          <SelectTrigger id="businessType" className="w-full">
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beauty">Beauty</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="coaching">Coaching</SelectItem>
            <SelectItem value="handmade">Handmade</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience" className="flex items-center">
          Target Audience
          {errors.targetAudience && (
            <span className="ml-2 text-xs text-destructive flex items-center">
              <AlertCircle size={12} className="mr-1" /> {errors.targetAudience}
            </span>
          )}
        </Label>
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
          className={errors.targetAudience ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessGoal">Business Goal for Social Media</Label>
        <Select value={businessGoal} onValueChange={(value: UserProfile['businessGoal']) => setBusinessGoal(value)}>
          <SelectTrigger id="businessGoal" className="w-full">
            <SelectValue placeholder="Select business goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="visibility">Visibility</SelectItem>
            <SelectItem value="community">Community</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Next"}
      </Button>
    </form>
  );
};
