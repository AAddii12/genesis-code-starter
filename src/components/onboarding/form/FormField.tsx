
import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { HelpCircle, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormSavingIndicator } from "../FormSavingIndicator";

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  tooltip?: string;
  error?: string;
  isDirty?: boolean;
  showSavingIndicator?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  children,
  tooltip,
  error,
  isDirty = false,
  showSavingIndicator = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="flex items-center text-base font-medium">
          {label}
          {error && (
            <span className="ml-2 text-xs text-destructive flex items-center">
              <AlertCircle size={12} className="mr-1" /> {error}
            </span>
          )}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
        {showSavingIndicator && <FormSavingIndicator isDirty={isDirty} className="mr-1" />}
      </div>
      {children}
    </div>
  );
};
