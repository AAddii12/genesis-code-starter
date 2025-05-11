
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface FormSavingIndicatorProps {
  isDirty: boolean;
  className?: string;
}

export const FormSavingIndicator: React.FC<FormSavingIndicatorProps> = ({ 
  isDirty,
  className = "" 
}) => {
  const [showSaved, setShowSaved] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isDirty) {
      setShowSaved(true);
      timer = setTimeout(() => {
        setShowSaved(false);
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isDirty]);
  
  if (!showSaved) return null;
  
  return (
    <div className={`flex items-center text-xs text-emerald-600 animate-fade-in ${className}`}>
      <Check size={12} className="mr-1" />
      <span>Progress saved</span>
    </div>
  );
};
