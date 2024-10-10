"use client";
import Container from "@/components/Container.components";
import { PaginationComponent } from "@/components/pos/inventory";
import NavHeader from "@/components/pos/NavHeader";
import SaleReportChartComponent from "@/components/pos/report/SaleReportChart";
import TodayReportTable from "@/components/pos/report/TodayReportTable";
import { Backend_URL, getFetch } from "@/lib/fetch";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

const SaleReport = ({ params }: { params: { date: string } }) => {
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

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const dateConverter = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const extractDates = (
    encodedString: string
  ): { startDate: Date; endDate: Date } => {
    // Decode the URL-encoded string
    const decodedString = decodeURIComponent(encodedString);

    // Extract the date parameters
    const params = new URLSearchParams(decodedString);
    const startDateStr = params.get("start");
    const endDateStr = params.get("end");

    if (!startDateStr || !endDateStr) {
      throw new Error("Start date or end date not found in the string.");
    }

    // Convert the date strings from dd-mm-yyyy to Date objects
    const [startDay, startMonth, startYear] = startDateStr
      .split("-")
      .map(Number);
    const [endDay, endMonth, endYear] = endDateStr.split("-").map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    return { startDate, endDate };
  };

  const getData = (url: string) => {
    return getFetch(url);
  };

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/voucher-report/custom?start=${dateConverter(
      extractDates(params.date).startDate
    )}&end=${dateConverter(extractDates(params.date).endDate)}`,
    getData
  );

  const goToLastPage = () => {
    setCurrentPage(data?.totalPages);
  };

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader
          parentPage="Sale Report"
          path="Sale Report"
          currentPage="Custom Report"
        />
        {isLoading ? (
          <p>Loading....</p>
        ) : (
          <div className=" space-y-4">
            {data?.chartData?.length < 1 ? (
              <p>No Data Yet</p>
            ) : (
              <SaleReportChartComponent chartData={data?.chartData} />
            )}
            <div className=" space-y-2">
              <p className=" text-xl font-semibold">Overview Sale</p>
              {data?.data?.length > 0 && (
                <>
                  <TodayReportTable data={data?.data} />
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
          </div>
        )}
      </div>
    </Container>
  );
};

export default SaleReport;
