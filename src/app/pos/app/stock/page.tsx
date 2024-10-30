"use client";

import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";

import React, { useEffect, useState } from "react";
import { Backend_URL, getFetch } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import StockReportChart from "@/components/pos/stock/StockReportChart";
import StockTable from "@/components/pos/stock/StockTable";
import { PaginationComponent } from "@/components/pos/inventory";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const StockPage = () => {
  const router = useRouter();
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [singleId, setSingleId] = useState<number | undefined>();

  // for fetching
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("createdAt");
  const [sortBy, setSortBy] = useState("desc");

  const filterTable = (value: string) => {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
    setFilterType(value);
  };

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

  const getStockReport = (url: string) => {
    return getFetch(url);
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${Backend_URL}/stock-reports?page=${currentPage}`,
    getStockReport,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryInterval: 5000,
      revalidateOnMount: true,
      refreshWhenHidden: true,
    }
  );

  const refetch = () => {
    mutate(
      `${Backend_URL}/products?page=${currentPage}&search=${searchInputValue}&orderDirection=${sortBy}&orderBy=${filterType}`
    );
  };

  // delete
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const product = parseInt(event.target.id);

    setIdsToDelete((prevIds) => {
      if (prevIds.includes(product)) {
        return prevIds.filter((item) => item !== product);
      } else {
        return [...prevIds, product];
      }
    });
  };

  const [editId, setEditId] = useState({
    status: false,
    id: "",
  });

  const { data: singleData, isLoading: singleLoading } = useSWR(
    editId.status ? `${Backend_URL}/products/${singleId}` : null,
    getFetch,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
    }
  );

  const handleEdit = async (id: any) => {
    setEditId({
      status: true,
      id,
    });
    setSingleId(id);
  };

  const [getNow, setGetNow] = useState(false);

  const {
    data: customerExcel,
    error: excelError,
    isLoading: customerExcelLoading,
  } = useSWR(getNow ? `${Backend_URL}/stock-reports/export` : null, getStockReport);

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
        <NavHeader parentPage="Stock" path="Stock" />
        {!isLoading && (
          <>
            <StockReportChart isLoading={isLoading} data={data} />
            <div className=" flex justify-between items-center">
              <p className=" text-lg font-semibold">Stock</p>
              <Button
                disabled={customerExcelLoading}
                variant={"outline"}
                onClick={async () => {
                  await setGetNow(false);
                  setGetNow(true);
                }}
              >
                <Download /> <span className="ms-1">Export Stocks</span>
              </Button>
              <a href="" ref={ref} className=" hidden"></a>
            </div>
            <StockTable data={data?.products} />
            <PaginationComponent
              goToFirstPage={goToFirstPage}
              currentPage={currentPage}
              decrementPage={decrementPage}
              incrementPage={incrementPage}
              goToLastPage={goToLastPage}
              lastPage={data?.totalPages}
            />
          </>
        )}
      </div>
    </Container>
  );
};

export default StockPage;
