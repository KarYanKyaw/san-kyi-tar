import React, { forwardRef } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type InputProps = {
  label?: string;
  id: string; // Changed to `string` for better type safety
  type: string;
  className?: string;
  min?: number | string; // Adjusted type to be more specific
  max?: number | string; // Adjusted type to be more specific
  value?: string | number; // Adjusted type to be more specific
  name?: string;
  [key: string]: any; // Allows for any additional props
};

const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, type, min, max, value, ...rest }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Input
          ref={ref}
          id={id}
          type={type}
          min={min}
          max={max}
          value={value}
          className="h-9"
          {...rest}
        />
        
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
