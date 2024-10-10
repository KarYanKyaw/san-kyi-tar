import React, { Dispatch, SetStateAction, useEffect } from "react";
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

type FittingTableType = {
  data: [];
  handleCheckboxChange: (e: any) => void;
  dropFitting: () => void;
  setIdsToDelete: Dispatch<SetStateAction<number[]>>;
  openSheetRef: any;
  setInputValue: any;
  editId: any;
  handleEdit: (id: number) => void;
  filterTable: (value: string) => void;
  refetch: () => void;
  setProductSizingIds: any;
  handleSingleDelete: () => void;
  setDeleteId: any;
  startIndex: number;
};

const FittingTable = ({
  data,
  handleCheckboxChange,
  dropFitting,
  openSheetRef,
  setInputValue,
  editId,
  handleEdit,
  filterTable,
  refetch,
  setProductSizingIds,
  handleSingleDelete,
  setDeleteId,
  startIndex,
}: FittingTableType) => {
  const getFitting = (url: string) => {
    return getFetch(url);
  };

  const { data: fittingData } = useSWR(
    editId.status ? `${Backend_URL}/product-fittings/${editId.id}` : null,
    getFitting,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
    }
  );

  useEffect(() => {
    if (fittingData && editId.status) {
      setInputValue(fittingData.name);
      setProductSizingIds(fittingData.productSizings.map((el: any) => el.id));
      openSheetRef.current.click();
    }
  }, [fittingData]);

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
                <span>Fitting</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead>Sizes</TableHead>
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
          {data?.map(
            (
              {
                id,
                name,
                date,
                productSizings,
              }: {
                id: any;
                name: string;
                date: string;
                productSizings: any;
              },
              index
            ) => (
              <TableRow className=" bg-white hover:bg-white/50" key={id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={id}
                      value={id}
                      onClick={(e) => handleCheckboxChange(e)}
                      // data-state={selectedSizes.includes(id)}
                    />
                    <span>{index + startIndex + 1}</span>
                  </div>
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>
                  {productSizings.map((el: any) => el.name).join(", ")}
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
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FittingTable;
