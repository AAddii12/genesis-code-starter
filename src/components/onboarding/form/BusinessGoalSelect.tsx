
import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserProfile } from "@/types";
import { FormField } from "./FormField";

interface BusinessGoalSelectProps {
  value: UserProfile['businessGoal'];
  onChange: (value: UserProfile['businessGoal']) => void;
  isDirty: boolean;
}

export const BusinessGoalSelect: React.FC<BusinessGoalSelectProps> = ({ value, onChange, isDirty }) => {
  return (
    <FormField 
      id="businessGoal" 
      label="Business Goal" 
      tooltip="What do you want to achieve with your social media content?"
      isDirty={isDirty}
      showSavingIndicator={true}
    >
      <Select value={value} onValueChange={(value: UserProfile['businessGoal']) => onChange(value)}>
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
    </FormField>
  );
};
