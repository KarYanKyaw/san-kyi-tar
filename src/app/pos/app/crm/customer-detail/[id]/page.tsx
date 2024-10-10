"use client";

import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import TodayReportTable from "@/components/pos/report/TodayReportTable";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { Badge } from "@/components/ui/badge";
import { Backend_URL, getFetch } from "@/lib/fetch";
import { HomeIcon } from "@radix-ui/react-icons";
import { Calendar, CoinsIcon, Home, Notebook, Phone } from "lucide-react";
import React from "react";
import useSWR from "swr";

const CustomerDetailPage = ({ params }: { params: { id: string } }) => {
  const getData = (url: string) => {
    return getFetch(url);
  };
  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/customers/${params.id}`,
    getData
  );

  return (
    <Container>
      <NavHeader
        parentPage="Customer Info"
        path="Customer"
        currentPage="Customer Info"
      />
      <div className=" pt-5">
        {isLoading ? (
          <div className=" p-5 space-y-1 border-2 rounded bg-white w-[500px]">
            <div className=" flex gap-2">
              {" "}
              <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
              <Badge className={" rounded-sm"}>
                {" "}
                <div className="w-full animate-pulse h-3 bg-secondary"></div>
              </Badge>
            </div>{" "}
            <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
            <div className=" grid pb-2 grid-cols-2">
              <div className=" flex gap-3  items-center">
                <Phone />
                <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
              </div>
              <div>
                <Badge
                  className={
                    "rounded-sm pointer-events-none text-primary/400 bg-green-300 h-4 capitalize"
                  }
                >
                  <div className="w-full animate-pulse h-3 bg-secondary"></div>
                </Badge>
              </div>
            </div>
            <div className=" grid pb-2 grid-cols-2">
              <div className=" flex gap-3 items-center">
                <CoinsIcon />
                <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
              </div>
              <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
            </div>
            <div className=" grid pb-2 grid-cols-2">
              <div className=" flex gap-3 items-center">
                <HomeIcon />
                <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
              </div>
              <div className="w-1/2 animate-pulse h-3 bg-secondary"></div>
            </div>
          </div>
        ) : (
          <div className=" p-5 space-y-1 border-2 rounded bg-white w-[500px]">
            <div className=" flex gap-2">
              <p className=" font-medium">{data?.name}</p>
              <Badge className={" rounded-sm"}>{data?.special?.name}</Badge>
            </div>
            <p className=" text-sm  pb-3 font-light">{data?.email}</p>
            <div className=" grid pb-2 grid-cols-2">
              <div className=" flex gap-3  items-center">
                <Phone />
                <p className=" text-gray-500 text-sm">{data?.phoneNumber}</p>
              </div>
              <div>
                <Badge
                  className={
                    "rounded-sm pointer-events-none text-primary/400 bg-green-300 h-4 capitalize"
                  }
                >
                  {data?.gender}
                </Badge>
              </div>
            </div>
            <div className=" grid pb-2 grid-cols-2">
              <div className=" flex gap-3 items-center">
                <Calendar />
                <p className=" text-gray-500 text-sm">Date of Birth</p>
              </div>
              <p className=" text-sm font-light">{data?.fixDateOfBirth}</p>
            </div>
            <div className=" grid pb-2 grid-cols-2">
              <div className=" flex gap-3 items-center">
                <CoinsIcon />
                <p className=" text-gray-500 text-sm"> {data?.totalPrice}</p>
              </div>
              <p className="text-sm  font-light">
                {data?.totalVoucher || 0} (vouchers)
              </p>
            </div>
            <div className=" grid pb-2 grid-cols-2">
              <div className=" flex gap-3 items-center">
                <Home />
                <p className=" text-gray-500 text-sm">Address</p>
              </div>
              <p className=" text-sm font-light">{data?.address}</p>
            </div>

            <div className=" grid pb-2 grid-cols-2">
              <div className=" flex gap-3 items-center">
                <Notebook />
                <p className=" text-gray-500 text-sm">Remark</p>
              </div>
              <p className=" text-sm font-light">{data?.remark}</p>
            </div>
          </div>
        )}

        <p className=" font-medium text-2xl my-4">Voucher of Customer</p>

        {isLoading ? (
          <TableSkeletonLoader />
        ) : (
          <TodayReportTable data={data.vouchersSummary} />
        )}
      </div>
    </Container>
  );
};

export default CustomerDetailPage;
