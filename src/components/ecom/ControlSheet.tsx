"use client";

import React, { useEffect, useState } from "react";
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
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAppProvider } from "@/app/Provider/AppProvider";

type controls = {
  buttonName: any;
  title: string;
  desc?: string;
  children: React.ReactNode;
  closeRef?: any;
};

const ControlSheet = ({
  buttonName,
  title,
  desc,
  children,
  closeRef,
}: controls) => {
  const [open, setOpen] = useState(false);
  const { orderRecord } = useAppProvider();

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <SheetTrigger className=" relative" asChild>
        {title == "Filter & Sort" ? (
          <Button size={"default"} className=" !p-0" variant={"outline"}>
            {buttonName}
          </Button>
        ) : (
          <Button size={"sm"} variant={"ghost"} className=" relative">
            {title == "Add to Cart" &&
              orderRecord?.reduce((pv: any, cv: any) => pv + cv?.quantity, 0) >
                0 && (
                <span className=" absolute -top-[0.8px] rounded-full right-1.5 h-3.5 w-3.5 bg-red-600 text-red-50 !p-0 flex justify-center items-center">
                  {orderRecord?.reduce(
                    (pv: any, cv: any) => pv + cv?.quantity,
                    0
                  )}
                </span>
              )}

            {buttonName}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className=" w-[90%] lg:w-2/3 space-y-2">
        <SheetHeader>
          <SheetTitle className=" text-start !pb-0">{title}</SheetTitle>
          <SheetDescription className="!mt-0 text-start">
            {desc}
          </SheetDescription>
        </SheetHeader>
        <div className=" my-5"></div>
        {children}
        <SheetFooter className={" !justify-between hidden items-center"}>
          <SheetClose ref={closeRef} asChild>
            <Button className="hidden" variant="link">
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

export default ControlSheet;
