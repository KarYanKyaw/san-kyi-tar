import React from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";

const ProductSkeleton = () => {
  return (
    <>
      {[...Array(8)].map((_, index) => (
        <div key={index}>
          <div className=" bg-gray-300 h-[200px] animate-pulse relative">
            <div className=" absolute  top-3 right-3">
              <Button
                onClick={(e) => e.stopPropagation()}
                variant={"outline"}
                className=" h-6 w-6 p-0.5 rounded-full"
                size={"sm"}
              >
                <Heart size={16} />
              </Button>
            </div>
            <div className=" absolute left-3 bottom-3">
              <div className="w-1/2 animate-pulse h-3 bg-gray-300"></div>
            </div>
          </div>
          <div className=" space-y-4 p-3">
            <div className=" space-y-1.5">
              <div className="w-1/2 animate-pulse h-3 bg-gray-300"></div>
              <div className="w-1/2 animate-pulse h-3 bg-gray-300"></div>
            </div>
            <div className="w-1/2 animate-pulse h-3 bg-gray-300"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
