"use client";

import ReactSelect from "react-select";
import { Label } from "./label";

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  return (
    <div className="z-[100]">
      <Label className="block leading-6 text-gray-900 dark:text-gray-300">
        {label}
      </Label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            control: (styles) => ({
              ...styles,
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }),
            input: (styles) => ({
              ...styles,
              color: "hsl(var(--light))",
            }),
            option: (styles) => ({
              ...styles,
              color: "hsl(var(--light))",
              backgroundColor: "hsl(var(--background))",
            }),
          }}
          classNames={{
            control: () => "text-sm",
          }}
        />
      </div>
    </div>
  );
};
