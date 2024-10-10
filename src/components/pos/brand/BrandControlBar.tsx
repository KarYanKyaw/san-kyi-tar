import React from "react";
import { Input } from "../../ui/input";
import { Trash2 } from "lucide-react";
import ConfirmBox from "@/components/ConfirmBox";
import { InventoryControlSheet } from "../inventory";
import { BrandForm } from ".";
import { File } from "buffer";

type controlBar = {
  closeRef: any;
  isSelected: boolean;
  dropType: () => void;
  openSheetRef: any;
  editId: any;
  setEditId: any;
  inputValue: string;
  setInputValue: any;
  resetValue: () => void;
  searchInputValue: string;
  setSearchInputValue: any;
  refetch: () => void;
  brandImageToShow: any;
  setBrandImageToShow: any;
};

const BrandControlBar = ({
  closeRef,
  isSelected,
  dropType,
  openSheetRef,
  editId,
  inputValue,
  resetValue,
  searchInputValue,
  setSearchInputValue,
  refetch,
  brandImageToShow,
  setBrandImageToShow,
}: controlBar) => {
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
              run={dropType}
            />
          </>
        )}
      </div>
      <InventoryControlSheet
        buttonName="Brand"
        openSheetRef={openSheetRef}
        title={"Add Brand"}
        description="Make new brand here. Click save when you're done."
        resetValue={resetValue}
        closeRef={closeRef}
      >
        <BrandForm
          closeRef={closeRef}
          editId={editId}
          inputValue={inputValue}
          resetValue={resetValue}
          refetch={refetch}
          brandImageToShow={brandImageToShow}
          setBrandImageToShow={setBrandImageToShow}
        />
      </InventoryControlSheet>
    </div>
  );
};

export default BrandControlBar;
