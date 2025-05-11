
export type UserProfile = {
  businessName: string;
  businessType: string;
  targetAudience: string;
  businessGoal: string;
  colorPalette: string;
  styleVibe: string;
  preferredPlatforms: string[];
};

export const businessTypes = ["beauty", "food", "coaching", "handmade", "other"];
export const businessGoals = ["sales", "visibility", "community", "other"];
export const colorPalettes = ["soft pastels", "neon bold", "monochrome", "custom"];
export const styleVibes = ["minimalist", "playful", "elegant", "high-tech"];
export const platforms = ["Instagram", "Facebook", "WhatsApp", "TikTok"];
