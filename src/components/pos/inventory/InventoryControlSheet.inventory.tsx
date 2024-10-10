import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type inventory = {
  buttonName: string;
  title: string;
  description: string;
  children: React.ReactNode;
  closeRef: any;
  openSheetRef: any;
  resetValue: () => void;
};

const InventoryControlSheet = ({
  buttonName,
  title,
  description,
  children,
  closeRef,
  openSheetRef,
  resetValue,
}: inventory) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        if (open) {
          resetValue();
        }
      }}
    >
      <SheetTrigger asChild>
        <Button ref={openSheetRef}>
          <PlusCircle className=" me-1" />
          Add {buttonName}
        </Button>
      </SheetTrigger>
      <SheetContent className=" space-y-4">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className=" my-8"></div>
        {children}
        <SheetFooter className={"flex !justify-between items-center"}>
          <SheetClose asChild>
            <Button className="hidden" ref={closeRef} variant="link">
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button className="hidden" size="sm">
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default InventoryControlSheet;
