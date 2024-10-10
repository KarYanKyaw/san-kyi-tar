import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const AddProductControlBar = ({
  goForward,
  goBackward,
}: {
  goForward: () => void;
  goBackward: () => void;
}) => {
  return (
    <div>
      <div className="pb-4 flex justify-between items-center">
        <div className=" space-y-2">
          <p className=" font-bold text-xl">Add Product</p>
          <p className="  font-normal text-primary/60 text-sm">
            Products Information placed across your store.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => goBackward()} type="button" size="sm">
            <ArrowLeft size={24} />
          </Button>
          <Button onClick={() => goForward()} type="submit" size="sm">
            <ArrowRight size={24} />
          </Button>
        </div>
      </div>
      <hr className=" py-1" />
    </div>
  );
};

export default AddProductControlBar;
