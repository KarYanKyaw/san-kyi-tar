import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableSkeletonLoader = () => {
  return (
    <>
      <Table className=" bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
            </TableHead>
            <TableHead>
              <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
            </TableHead>
            <TableHead>
              <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
            </TableHead>
            <TableHead>
              <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(7)].map((_, index) => (
            <TableRow key={index}>
              <TableHead>
                <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
              </TableHead>
              <TableHead>
                <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
              </TableHead>
              <TableHead>
                <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
              </TableHead>
              <TableHead>
                <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
              </TableHead>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TableSkeletonLoader;
