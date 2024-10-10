import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Edit2, MinusCircle } from "lucide-react";
import ConfirmBox from "@/components/ConfirmBox";
import { Checkbox } from "@/components/ui/checkbox";
import { Backend_URL, getFetch } from "@/lib/fetch";
import useSWR from "swr";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type SizeTable = {
  data: [];
  handleCheckboxChange: (e: any) => void;
  dropType: () => void;
  setIdsToDelete: Dispatch<SetStateAction<number[]>>;
  openSheetRef: any;
  setInputValue: any;
  editId: any;
  handleEdit: (id: number) => void;
  filterTable: (value: string) => void;
  refetch: () => void;
  setBrandImageToShow: any;
  handleSingleDelete: () => void;
  setDeleteId: any;
  startIndex: number;
};

const BrandTable = ({
  data,
  handleCheckboxChange,
  dropType,
  openSheetRef,
  setInputValue,
  editId,
  handleEdit,
  filterTable,
  refetch,
  setBrandImageToShow,
  setDeleteId,
  handleSingleDelete,
  startIndex,
}: SizeTable) => {
  const getBrand = (url: string) => {
    return getFetch(url);
  };

  const { data: brandData } = useSWR(
    editId.status ? `${Backend_URL}/product-brands/${editId.id}` : null,
    getBrand,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
    }
  );

  useEffect(() => {
    if (brandData && editId.status) {
      openSheetRef.current.click();
      setInputValue(brandData.name);
      setBrandImageToShow(brandData.media.url);
    }
  }, [brandData]);

  return (
    <div className=" min-h-[780px]">
      <Table>
        <TableHeader className="hover:bg-white z-50">
          <TableRow className="hover:bg-white bg-white">
            <TableHead>
              <span>No</span>
            </TableHead>

            <TableHead>
              <div
                onClick={() => filterTable("name")}
                className="flex gap-1 cursor-pointer select-none items-center"
              >
                <span>Brand</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead>
              <div
                onClick={() => filterTable("createdAt")}
                className="flex gap-1 cursor-pointer select-none items-center"
              >
                <span>Date</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(({ id, name, date, media: { url } }, index) => (
            <TableRow className=" bg-white hover:bg-white/50" key={id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={id}
                    value={id}
                    onClick={(e) => handleCheckboxChange(e)}
                  />
                  <span>{index + startIndex + 1}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className=" capitalize flex gap-3 items-center">
                  <Image
                    src={url}
                    alt={""}
                    className=" w-12 h-12 object-cover bg-black/20 rounded-full"
                    width={300}
                    height={300}
                  />
                  {name}
                </div>
              </TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Button
                    variant={"ghost"}
                    className="!p-0"
                    onClick={() => handleEdit(id)}
                  >
                    <Edit2 />
                  </Button>

                  <ConfirmBox
                    buttonName={<MinusCircle />}
                    buttonSize="sm"
                    buttonVariant={"ghost"}
                    confirmTitle={"Are you sure?"}
                    confirmDescription={"This action can't be undone!"}
                    confirmButtonText={"Yes, delete this."}
                    run={async () => {
                      await setDeleteId(id);
                      handleSingleDelete();
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BrandTable;
