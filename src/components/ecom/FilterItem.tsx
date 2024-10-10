import React from "react";
import { Checkbox } from "../ui/checkbox";

const FilterItem = ({
  value,
  name,
  run,
  isChecked,
}: {
  value: string | number;
  name: string;
  run: (value: any) => void;
  isChecked: boolean;
}) => {
  const handleChange = () => {
    run(value);
  };

  return (
    <div className="flex items-center select-none space-x-2 bg-secondary p-3">
      <Checkbox checked={isChecked} id={name} onCheckedChange={handleChange} />
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {name}
      </label>
    </div>
  );
};

export default FilterItem;
