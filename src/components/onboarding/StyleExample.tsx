
import React from "react";
import { UserProfile } from "@/types";

interface StyleExampleProps {
  type: UserProfile['styleVibe'];
  businessType?: UserProfile['businessType'];
}

export const StyleExample: React.FC<StyleExampleProps> = ({ type, businessType }) => {
  // Sample text based on business type
  const getSampleText = () => {
    switch(businessType) {
      case "beauty":
        return "Enhance your natural beauty";
      case "food":
        return "Taste the difference";
      case "coaching":
        return "Transform your potential";
      case "handmade":
        return "Crafted with love";
      default:
        return "Your brand message";
    }
  };
  
  // Style variants
  const styleVariants = {
    "minimalist": "font-light tracking-wide uppercase bg-gray-50 p-3 text-center",
    "playful": "font-bold text-lg tracking-normal bg-yellow-100 p-3 text-center rounded-xl",
    "elegant": "font-serif italic tracking-wide bg-rose-50 p-3 text-center",
    "high-tech": "font-mono tracking-tight bg-blue-50 p-3 text-center uppercase"
  };
  
  const selectedStyle = styleVariants[type] || styleVariants["minimalist"];
  
  return (
    <div className={`${selectedStyle} my-2 border border-gray-100`}>
      {getSampleText()}
    </div>
  );
};
