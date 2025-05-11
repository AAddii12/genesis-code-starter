
export interface UserProfile {
  // Business Info
  businessName: string;
  businessType: "beauty" | "food" | "coaching" | "handmade" | "other";
  targetAudience: string;
  businessGoal: "sales" | "visibility" | "community" | "other";
  
  // Visual Preferences
  colorPalette: "soft pastels" | "neon bold" | "monochrome" | "custom";
  styleVibe: "minimalist" | "playful" | "elegant" | "high-tech";
  preferredPlatforms: string[];
}
