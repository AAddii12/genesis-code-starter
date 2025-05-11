
import React from "react";
import { UserProfile } from "@/types";

interface PaletteSwatchProps {
  type: UserProfile['colorPalette'];
}

export const PaletteSwatch: React.FC<PaletteSwatchProps> = ({ type }) => {
  // Different color combinations based on palette type
  const colors = {
    "soft pastels": ["#F2D7EE", "#D3EEFF", "#E5FCC2", "#FFF4BD", "#FFD3B5"],
    "neon bold": ["#00FFFF", "#FF00FF", "#FFFF00", "#FF3131", "#39FF14"],
    "monochrome": ["#FFFFFF", "#D9D9D9", "#808080", "#404040", "#000000"],
    "custom": ["#E0C3FC", "#8EC5FC", "#FEE140", "#FA709A", "#4158D0"]
  };

  const selectedColors = colors[type] || colors["soft pastels"];

  return (
    <div className="flex space-x-2 my-2">
      {selectedColors.map((color, index) => (
        <div 
          key={index}
          className="w-8 h-8 rounded-full shadow-sm"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
};
