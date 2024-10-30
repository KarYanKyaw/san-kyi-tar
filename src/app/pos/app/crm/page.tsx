"use client";

import Container from "@/components/Container.components";
import ErrorComponent from "@/components/ErrorComponent";
import CustomerAnalysisBox from "@/components/pos/crm/CustomerAnalysisBox";
import CustomerTable from "@/components/pos/crm/CustomerTable";
import { PaginationComponent } from "@/components/pos/inventory";
import NavHeader from "@/components/pos/NavHeader";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Backend_URL, getFetch } from "@/lib/fetch";
import axios from "axios";
import { Download, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const CRM = () => {
  // for fetching

  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [filterType, setFilterType] = useState("createdAt");
  const [sortBy, setSortBy] = useState("desc");
  const [getNow, setGetNow] = useState(false);

  const filterTable = (value: string) => {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
    setFilterType(value);
  };

  const getData = (url: string) => {
    return getFetch(url);
  };

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/customers`,
    getData
  );

  const {
    data: customerData,
    isLoading: customerLoading,
    error: customerError,
  } = useSWR(
    `${Backend_URL}/customers?page=${currentPage}&orderBy=${filterType}&orderDirection=${sortBy}&search=${inputValue}`,
    getData
  );

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
    setCurrentPage(customerData?.totalPages);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const router = useRouter();

  const startIndex = (currentPage - 1) * 10;

  const {
    data: customerExcel,
    error: excelError,
    isLoading: customerExcelLoading,
    mutate,
  } = useSWR(getNow ? `${Backend_URL}/customers/export` : null, getData);

  const ref = React.useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (customerExcel) {
      ref.current && (ref.current.href = customerExcel?.url);
      ref.current?.click();
    }
  }, [customerExcel]);

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader
          parentPage="Customer List"
          path="Customer"
          currentPage="Customer List"
        />

        {!isLoading && (
          <div className=" space-y-4">
            <CustomerAnalysisBox data={data?.analysis} />
            <div className=" space-y-2">
              <p className=" text-xl font-semibold">Customer Info</p>
              <div className=" flex justify-between items-center">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search...."
                />

                <div className=" flex gap-3 ">
                  <Button
                    disabled={customerExcelLoading}
                    variant={"outline"}
                    onClick={async () => {
                      await setGetNow(false);
                      setGetNow(true);
                    }}
                  >
                    <Download /> <span className="ms-1">Export Excel</span>
                  </Button>
                  <a href="" ref={ref} className=" hidden"></a>

                  <Button
                    disabled={customerExcelLoading}
                    onClick={() => router.push("/pos/app/add-customer")}
                  >
                    <PlusCircle /> <span className="ms-1">Add Customer</span>
                  </Button>
                </div>
              </div>

              {error ? (
                <ErrorComponent refetch={() => {}} />
              ) : (
                <>
                  {isLoading ? (
                    <TableSkeletonLoader />
                  ) : (
                    <div className=" mt-3 space-y-3">
                      <CustomerTable
                        data={customerData?.data}
                        startIndex={startIndex}
                        filterTable={filterTable}
                      />
                      <PaginationComponent
                        goToFirstPage={goToFirstPage}
                        currentPage={currentPage}
                        decrementPage={decrementPage}
                        incrementPage={incrementPage}
                        goToLastPage={goToLastPage}
                        lastPage={customerData?.totalPages}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CRM;
