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
import { Button } from "../../ui/button";
import { CalendarDays, Clock1, Edit2, MinusCircle } from "lucide-react";
import ConfirmBox from "@/components/ConfirmBox";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

type ProductTableType = {
  data: [];
  handleCheckboxChange: (e: any) => void;
  setIdsToDelete: Dispatch<SetStateAction<number[]>>;
  editId: any;
  handleEdit: (id: number) => void;
  filterTable: (value: string) => void;
  refetch: () => void;
  handleSingleDelete: () => void;
  setDeleteId: any;
  openDetail: (id: number) => void;
  startIndex: number;
};

const ProductTable = ({
  data,
  handleCheckboxChange,
  editId,
  handleEdit,
  filterTable,
  handleSingleDelete,
  setDeleteId,
  openDetail,
  startIndex,
}: ProductTableType) => {
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
                <span>Product</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead className=" text-end">Stock</TableHead>
            <TableHead className=" text-end">Sale Price</TableHead>
            <TableHead className=" text-end">Benefit</TableHead>
            <TableHead className=" text-end">
              <div
                onClick={() => filterTable("createdAt")}
                className="flex gap-1 justify-end cursor-pointer select-none items-center"
              >
                <span>Date</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length < 1 ? (
            <TableRow className="pointer-events-none bg-white">
              {Array(7)
                .fill(null)
                .map((_, index) => (
                  <TableCell className="pointer-events-none" key={index}>
                    <p className="py-3"></p>
                  </TableCell>
                ))}
            </TableRow>
          ) : (
            <>
              {data?.map(
                (
                  {
                    id,
                    name,
                    date,
                    salePrice,
                    benefit,
                    stock,
                    gender,
                    medias,
                    productCategory,
                    productFitting,
                    productType,
                    time,
                    productCode,
                  }: {
                    id: any;
                    name: string;
                    date: string;
                    salePrice: number;
                    stock: number;
                    benefit: number;
                    gender: string;
                    productBrand: { name: string };
                    productCategory: { name: string };
                    productFitting: { name: string };
                    productType: { name: string };
                    medias: any;
                    time: string;
                    productCode: string;
                  },
                  index
                ) => (
                  <TableRow
                    className=" bg-white cursor-pointer hover:bg-white/50"
                    key={id}
                    onClick={() => openDetail(id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={id}
                          value={id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckboxChange(e);
                          }}
                        />
                        <span>{index + startIndex + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className=" flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md">
                          <Image
                            alt=""
                            className="object-cover w-9 h-9 rounded-md"
                            src={medias[0].url}
                            width={300}
                            height={300}
                          />
                        </div>
                        <div className=" flex gap-1.5 flex-col">
                          <p className=" capitalize">
                            {name} {productCode}
                          </p>
                          <div className=" flex gap-1">
                            <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {gender.toLocaleLowerCase()}
                            </div>
                            <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {productType.name}
                            </div>
                            <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {productCategory.name}
                            </div>
                            <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {productFitting.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className=" text-end">{stock}</TableCell>
                    <TableCell className=" text-end">
                      {new Intl.NumberFormat("ja-JP").format(salePrice)}
                    </TableCell>
                    <TableCell className=" text-end">
                      {new Intl.NumberFormat("ja-JP").format(benefit)}
                    </TableCell>

                    <TableCell className=" flex justify-end  h-full items-center">
                      <div className=" space-y-1">
                        <div className=" flex items-center gap-1">
                          <CalendarDays width={12} height={12} />
                          <p className=" text-xs">{date}</p>
                        </div>
                        <div className="flex  ">
                          <div className=" bg-muted flex rounded items-center p-0.5 ps-0.5 px-1 text-xs gap-1">
                            <Clock1 width={12} height={12} />
                            <p className=" text-xs">{time}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
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
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
