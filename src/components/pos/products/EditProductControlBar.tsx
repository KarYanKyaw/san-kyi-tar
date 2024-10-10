import { Button } from "@/components/ui/button";
import React from "react";

const EditProductControlBar = ({ run }: { run: () => void }) => {
  return (
    <div className="pb-4 flex justify-between items-center">
      <div className=" space-y-2">
        <p className=" font-bold text-xl">Edit Product</p>
        <p className="  font-normal text-primary/60 text-sm">
          Products Information placed across your store.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => run()} type="button" size="sm">
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditProductControlBar;
