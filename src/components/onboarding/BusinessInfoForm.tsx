
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserProfile } from "@/types";

interface BusinessInfoFormProps {
  onNext: (data: {
    businessName: string;
    businessType: UserProfile['businessType'];
    targetAudience: string;
    businessGoal: UserProfile['businessGoal'];
  }) => void;
}

export const BusinessInfoForm = ({ onNext }: BusinessInfoFormProps) => {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<UserProfile['businessType']>("beauty");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessGoal, setBusinessGoal] = useState<UserProfile['businessGoal']>("sales");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      businessName,
      businessType,
      targetAudience,
      businessGoal
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          placeholder="Enter your business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">Business Type</Label>
        <Select value={businessType} onValueChange={(value: UserProfile['businessType']) => setBusinessType(value)} required>
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
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Input
          id="targetAudience"
          placeholder="Describe your target audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessGoal">Business Goal for Social Media</Label>
        <Select value={businessGoal} onValueChange={(value: UserProfile['businessGoal']) => setBusinessGoal(value)} required>
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

      <button 
        type="submit"
        className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Next
      </button>
    </form>
  );
};
