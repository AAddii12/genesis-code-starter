
import React from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";

interface TextInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  tooltip?: string;
  error?: string;
  isDirty: boolean;
  onClearError?: () => void;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  tooltip,
  error,
  isDirty,
  onClearError
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (e.target.value.trim() && onClearError) {
      onClearError();
    }
  };

  return (
    <FormField
      id={id}
      label={label}
      tooltip={tooltip}
      error={error}
      isDirty={isDirty}
      showSavingIndicator={true}
    >
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`h-12 rounded-xl shadow-sm ${error ? "border-destructive" : "border-gray-200"}`}
      />
    </FormField>
  );
};
