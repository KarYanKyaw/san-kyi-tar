import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const TodayReportTable = ({ data }: any) => {
  const router = useRouter();
  
  return (
    <Table>
      <TableHeader className="hover:bg-white z-50">
        <TableRow className="hover:bg-white bg-white">
          <TableHead>
            <span>No</span>
          </TableHead>

          <TableHead>Voucher</TableHead>
          <TableHead className="">Time</TableHead>
          <TableHead className=" text-end">Payment</TableHead>
          <TableHead className=" text-end">Qty</TableHead>
          <TableHead className=" text-end">Total</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((data: any, index: number) => (
          <TableRow
            onClick={() => router.push(`/pos/app/sale/voucher/${data.id}`)}
            key={index}
            className=" bg-white cursor-pointer hover:bg-white/50"
          >
            <TableCell>
              <span>{index + 1}</span>
            </TableCell>

            <TableCell className="">{data.voucherCode}</TableCell>
            <TableCell className="">{data.time}</TableCell>
            <TableCell className=" text-end">{data.payment}</TableCell>
            <TableCell className=" text-end">{data.qty}</TableCell>
            <TableCell className=" text-end">
              {new Intl.NumberFormat("ja-JP").format(data.total)}
            </TableCell>
            <TableCell className=" flex justify-end">
              <Button variant={"ghost"}>
                <ArrowRightCircle />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TodayReportTable;
