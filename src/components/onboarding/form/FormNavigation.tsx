
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormNavigationProps {
  onBack: () => void;
  isSubmitting: boolean;
  isGenerating: boolean;
  submitLabel?: string;
  webhookUrl?: string;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  onBack,
  isSubmitting,
  isGenerating,
  submitLabel = "Let's Start",
  webhookUrl,
}) => {
  const isDisabled = isSubmitting || isGenerating;

  return (
    <div className="flex space-x-4 pt-2">
      <Button 
        type="button"
        onClick={onBack}
        variant="outline"
        className="flex-1 h-12 rounded-xl font-medium text-base border-gray-300"
        disabled={isDisabled}
      >
        Back
      </Button>
      <Button 
        type="submit"
        className="flex-1 h-12 rounded-xl font-medium text-base bg-emerald-400 hover:bg-emerald-500"
        disabled={isDisabled}
      >
        {(isSubmitting || isGenerating) ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};
