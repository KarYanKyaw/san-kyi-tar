import React from "react";
import { Input } from "../../ui/input";
import { Trash2 } from "lucide-react";
import ConfirmBox from "@/components/ConfirmBox";
import { InventoryControlSheet } from "../inventory";
import ProductCategoryForm from "./ProductCategoryForm";

type controlBar = {
  closeRef: any;
  isSelected: boolean;
  dropCategory: () => void;
  openSheetRef: any;
  editId: any;
  setEditId: any;
  inputValue: string;
  setInputValue: any;
  resetValue: () => void;
  searchInputValue: string;
  setSearchInputValue: any;
  refetch: () => void;
  fittingData: [];
  productFittingIds: number[];
  setProductFittingIds: any;
  typesData: [];
  productTypeId: number | undefined;
  setProductTypeId: any;
};

const ProductCategoryControlBar = ({
  closeRef,
  isSelected,
  dropCategory,
  openSheetRef,
  editId,
  inputValue,
  resetValue,
  searchInputValue,
  setSearchInputValue,
  refetch,
  fittingData,
  productFittingIds,
  setProductFittingIds,
  typesData,
  productTypeId,
  setProductTypeId,
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
              run={dropCategory}
            />
          </>
        )}
      </div>
      <InventoryControlSheet
        buttonName="Category"
        openSheetRef={openSheetRef}
        title={"Add Product Category"}
        description="Make new product category here. Click save when you're done."
        resetValue={resetValue}
        closeRef={closeRef}
      >
        <ProductCategoryForm
          closeRef={closeRef}
          editId={editId}
          inputValue={inputValue}
          resetValue={resetValue}
          refetch={refetch}
          fittingData={fittingData}
          productFittingIds={productFittingIds}
          setProductFittingIds={setProductFittingIds}
          typesData={typesData}
          productTypeId={productTypeId}
          setProductTypeId={setProductTypeId}
        />
      </InventoryControlSheet>
    </div>
  );
};

export default ProductCategoryControlBar;
