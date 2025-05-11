
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserProfile } from "@/types";
import { FormField } from "./FormField";

interface BusinessTypeSelectProps {
  value: UserProfile['businessType'];
  onChange: (value: UserProfile['businessType']) => void;
  isDirty: boolean;
}

export const BusinessTypeSelect: React.FC<BusinessTypeSelectProps> = ({ value, onChange, isDirty }) => {
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
    <FormField 
      id="businessType" 
      label="Business Type" 
      tooltip="Selecting your business type helps us tailor content to your specific industry."
      isDirty={isDirty}
      showSavingIndicator={true}
    >
      <Select value={value} onValueChange={(value: UserProfile['businessType']) => onChange(value)}>
        <SelectTrigger id="businessType" className="h-12 rounded-xl shadow-sm border-gray-200">
          <SelectValue placeholder="Select business type" />
        </SelectTrigger>
        <SelectContent>
          {businessTypes.map(type => (
            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};
