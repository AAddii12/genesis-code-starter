
export interface UserProfile {
  // Business Info
  businessName: string;
  businessType: "beauty" | "food" | "coaching" | "handmade" | "other";
  targetAudience: string;
  businessGoal: "sales" | "visibility" | "community" | "other";
  email: string; // Added email field
  
  // Visual Preferences
  colorPalette: "soft pastels" | "neon bold" | "monochrome" | "custom";
  styleVibe: "minimalist" | "playful" | "elegant" | "high-tech";
  preferredPlatforms: string[];
}
