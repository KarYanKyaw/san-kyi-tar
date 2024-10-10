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
import { Button } from "@/components/ui/button";

type CatList = {
  data: [];
  handleCheckboxChange: (e: any) => void;
  dropLevel: () => void;
  setIdsToDelete: Dispatch<SetStateAction<number[]>>;
  openSheetRef: any;
  setInputValue: any;
  editId: any;
  handleEdit: (id: number) => void;
  filterTable: (value: string) => void;
  refetch: () => void;
  setDeleteId: any;
  setImageToShow: any;
  setCatId: any;
};

const CatListTable = ({
  data,
  handleCheckboxChange,
  dropLevel,
  openSheetRef,
  setInputValue,
  editId,
  handleEdit,
  filterTable,
  refetch,
  setDeleteId,
  setImageToShow,
  setCatId,
}: CatList) => {
  const getList = (url: string) => {
    return getFetch(url);
  };

  const { data: catData } = useSWR(
    editId.status ? `${Backend_URL}/ecommerce-categories/${editId.id}` : null,
    getList,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
      onSuccess: () => editId.status && openSheetRef.current.click(),
    }
  );

  useEffect(() => {
    if (catData && editId.status) {
      setInputValue(catData.name);
      setCatId(`${catData.productCategory.id}`);
      setImageToShow(catData.media.url);
    }
  }, [catData]);

  return (
    <div className=" min-h-[720px]">
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
                <span>Category Name</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead>Product Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(({ id, name, productCategory, date }: any, index) => (
            <TableRow className=" bg-white hover:bg-white/50" key={id}>
              <TableCell>
                <span>{index + 1}</span>
              </TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{productCategory.name}</TableCell>
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
                      dropLevel();
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

export default CatListTable;
