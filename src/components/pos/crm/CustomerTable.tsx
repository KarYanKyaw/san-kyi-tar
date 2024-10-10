"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRightCircle, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CaretSortIcon } from "@radix-ui/react-icons";

const CustomerTable = ({ data, startIndex, filterTable }: any) => {
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
                onClick={() => filterTable("name")}
                className="flex gap-1  cursor-pointer select-none items-center"
              >
                <span>Name</span> <CaretSortIcon />
              </div>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Age Range</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className=" text-end">
              <div
                onClick={() => filterTable("totalPrice")}
                className="flex gap-1 justify-end cursor-pointer select-none items-center"
              >
                <span>Total</span> <CaretSortIcon />
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
                phoneNumber,
                ageRange,
                special,
                totalPrice,
              }: {
                id: any;
                name: string;
                phoneNumber: string;
                ageRange: string;
                totalPrice: number;
                special: {
                  name: string;
                };
              },
              index: any
            ) => (
              <TableRow
                className=" bg-white cursor-pointer hover:bg-white/50"
                key={id}
                onClick={() => {
                  router.push(`/pos/app/crm/customer-detail/${id}`);
                }}
              >
                <TableCell>
                  <span>{index + startIndex + 1}.</span>
                </TableCell>

                <TableCell>{name}</TableCell>
                <TableCell>{phoneNumber}</TableCell>
                <TableCell>
                  <Badge variant={"secondary"}>{ageRange}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={"secondary"}>{special.name}</Badge>
                </TableCell>
                <TableCell className=" text-end">
                  {" "}
                  {new Intl.NumberFormat("ja-JP").format(totalPrice)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3 justify-end">
                    <Button
                      onClick={() =>
                        router.push(`/pos/app/crm/edit-customer/${id}`)
                      }
                      variant={"ghost"}
                      className="!p-0"
                    >
                      <Edit2 />
                    </Button>
                    <Button
                      onClick={() => {
                        router.push(`/pos/app/crm/customer-detail/${id}`);
                      }}
                      variant={"ghost"}
                      className="!p-0"
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

export default CustomerTable;
