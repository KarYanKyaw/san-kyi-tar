"use client";

import Container from "@/components/Container.components";
import { PaginationComponent } from "@/components/pos/inventory";
import NavHeader from "@/components/pos/NavHeader";
import TodayReportTable from "@/components/pos/report/TodayReportTable";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { Input } from "@/components/ui/input";
import { Backend_URL, getFetch } from "@/lib/fetch";
import React, { useState } from "react";
import useSWR from "swr";

const TodayReport = () => {
  const [filterType, setFilterType] = useState("createdAt");
  const [sortBy, setSortBy] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // for pagination
  const incrementPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const decrementPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToLastPage = () => {
    setCurrentPage(data?.totalPages);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const getTodayReport = (url: string) => {
    return getFetch(url);
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${Backend_URL}/voucher-report`,
    getTodayReport,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryInterval: 5000,
      revalidateOnMount: true,
      refreshWhenHidden: true,
    }
  );

  const today = new Date();
  const todayDate = today.toISOString().substr(0, 10);

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader parentPage="Today" path="Sale Report" currentPage="Today" />
        <div className=" w-[200px]">
          <Input
            type="date"
            value={todayDate}
            onChange={(e) => e.target.value}
            className=" pointer-events-none"
          />
        </div>
        {isLoading ? (
          <TableSkeletonLoader />
        ) : (
          <>
            {data?.data?.length < 1 ? (
              <p className=" text-center">Nothing sold out today!</p>
            ) : (
              <div className=" space-y-4">
                <div className=" min-h-[720px]">
                  <TodayReportTable data={data?.data} />
                </div>
                <PaginationComponent
                  goToFirstPage={goToFirstPage}
                  currentPage={currentPage}
                  decrementPage={decrementPage}
                  incrementPage={incrementPage}
                  goToLastPage={goToLastPage}
                  lastPage={data?.totalPages}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default TodayReport;
