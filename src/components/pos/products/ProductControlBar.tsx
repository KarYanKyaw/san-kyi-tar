"use client";

import ConfirmBox from "@/components/ConfirmBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

const ProductControlBar = ({
  isSelected,
  searchInputValue,
  setSearchInputValue,
  drop,
}: {
  isSelected: boolean;
  searchInputValue: string;
  setSearchInputValue: Dispatch<SetStateAction<string>>;
  drop: () => void;
}) => {
  const router = useRouter();

  return (
    <div className=" flex justify-between">
      <div className=" flex gap-3">
        <Input
          placeholder="Search..."
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
        />
        {isSelected && (
          <>
            <ConfirmBox
              buttonName={
                <>
                  <Trash2 width={16} /> <span className="ms-1">Delete</span>
                </>
              }
              buttonSize="sm"
              buttonVariant={"outline"}
              confirmTitle={"Are you sure?"}
              confirmDescription={"This action can't be undone!"}
              confirmButtonText={"Yes, delete this."}
              run={() => drop()}
            />
          </>
        )}
      </div>
      <Button
        onClick={() => router.push("/pos/app/products/add-new-product-step/1")}
      >
        <PlusCircle className=" me-1" />
        Add Product
      </Button>
    </div>
  );
};

export default ProductControlBar;
