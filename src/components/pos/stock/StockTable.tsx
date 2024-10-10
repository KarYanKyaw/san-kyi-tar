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
import { ArrowRightCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const StockTable = ({ data }: any) => {
  const router = useRouter();
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
                // onClick={() => filterTable("name")}
                className="flex gap-1 cursor-pointer select-none items-center"
              >
                <span>Product</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead className=" text-end">Sale Price</TableHead>
            <TableHead className=" text-end">Total Stock</TableHead>
            <TableHead className=" text-end">Stock Level</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(
            (
              {
                id,
                name,
                totalStock,
                salePrice,
                stockLevel,
                gender,
                productCategory,
                productFitting,
                productType,
              }: {
                id: any;
                name: string;
                salePrice: number;
                stockLevel: string;
                benefit: number;
                gender: string;
                productBrand: string;
                productCategory: string;
                productFitting: string;
                productType: string;
                totalStock: number;
              },
              index: any
            ) => (
              <TableRow
                className=" bg-white cursor-pointer hover:bg-white/50"
                key={id}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className=" flex items-center gap-3">
                    {/* <div className="w-9 h-9 rounded-md">
                      <Image
                        alt=""
                        className="object-cover w-9 h-9 rounded-md"
                        src={medias[0].url}
                        width={300}
                        height={300}
                      />
                    </div> */}
                    <div className=" flex gap-1.5 flex-col">
                      <p className=" capitalize">{name}</p>
                      <div className=" flex gap-1">
                        <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                          {gender.toLocaleLowerCase()}
                        </div>
                        <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                          {productType}
                        </div>
                        <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                          {productCategory}
                        </div>
                        <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                          {productFitting}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className=" text-end">
                  {new Intl.NumberFormat("ja-JP").format(salePrice)}
                </TableCell>
                <TableCell className=" text-end">{totalStock}</TableCell>
                <TableCell className=" text-end">
                  <Badge
                    className={`${stockLevel == "LowStock" && "!bg-red-400"}
                    ${stockLevel == "InStock" && "!bg-green-400"}
                    ${stockLevel == "SoldOut" && "!bg-black"}
                    `}
                  >
                    {stockLevel}
                  </Badge>
                </TableCell>

                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end">
                    <Button
                      variant={"ghost"}
                      className="!p-0"
                      onClick={() => router.push("/pos/app/control-stock")}
                    >
                      <ArrowRightCircle />
                    </Button>
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

export default StockTable;
