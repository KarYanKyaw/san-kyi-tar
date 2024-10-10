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

type CouponList = {
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
  setPromotionId: any;
};

const LevelListTable = ({
  data,
  handleCheckboxChange,
  dropLevel,
  openSheetRef,
  setInputValue,
  editId,
  handleEdit,
  filterTable,
  setDeleteId,
  refetch,
  setPromotionId,
}: CouponList) => {
  const getList = (url: string) => {
    return getFetch(url);
  };

  const { data: levelData } = useSWR(
    editId.status ? `${Backend_URL}/specials/${editId.id}` : null,
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
    if (levelData && editId.status) {
      setInputValue(levelData.name);
      setPromotionId(levelData.promotionRate);
    }
  }, [levelData]);

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
                <span>Level</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead>
              <div
                onClick={() => filterTable("promotionRate")}
                className="flex gap-1 cursor-pointer justify-end select-none items-center"
              >
                <span>Discount</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(({ id, name, promotionRate }, index) => (
            <TableRow className=" bg-white hover:bg-white/50" key={id}>
              <TableCell>
                <span>{index + 1}</span>
              </TableCell>
              <TableCell>{name}</TableCell>
              <TableCell className=" text-end">{promotionRate}%</TableCell>
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

export default LevelListTable;
