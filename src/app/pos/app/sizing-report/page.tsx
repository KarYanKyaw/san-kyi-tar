"use client";

import Container from "@/components/Container.components";
import { PaginationComponent } from "@/components/pos/inventory";
import NavHeader from "@/components/pos/NavHeader";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Backend_URL, getFetch } from "@/lib/fetch";
import React, { useState } from "react";
import useSWR from "swr";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";

const SizingReport = () => {
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

  const getReport = (url: string) => {
    return getFetch(url);
  };

  const [value, setValue] = useState("today");
  const [date, setDate] = React.useState<DateRange | undefined>();

  const dateConverter = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const [fetchURL, setFetchURL] = useState(
    `${Backend_URL}/sizing-report?search=${value}&page=${currentPage}`
  );

  const changeQuery = (value: string) => {
    setFetchURL(`${Backend_URL}/sizing-report?search=${value}`);
  };

  const handleSubmit = () => {
    if (date?.from && date?.to) {
      changeQuery(`${dateConverter(date.from)}&end=${dateConverter(date.to)}`);
    }
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    fetchURL,
    getReport,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryInterval: 5000,
      revalidateOnMount: true,
      refreshWhenHidden: true,
    }
  );

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader
          parentPage="Product size"
          path="Sale Report"
          currentPage="Product size"
        />
        <div className=" flex gap-3 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleSubmit}>
            <Search />
          </Button>
        </div>
        <Tabs
          onValueChange={(e) => {
            setValue(e);
            if (e !== "custom") {
              changeQuery(e);
              setDate(undefined);
            }
          }}
          defaultValue="today"
        >
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value={value}>
            {isLoading ? (
              <TableSkeletonLoader />
            ) : (
              <div className=" space-y-4">
                <div className=" min-h-[720px]">
                  <Table className=" overflow-y-auto bg-white h-full relative">
                    {data?.data.length == 0 && (
                      <TableCaption>
                        There is no {value} record yet!
                      </TableCaption>
                    )}
                    <TableHeader className="hover:bg-white">
                      <TableRow className="hover:bg-white  bg-white">
                        <TableHead className="flex items-center gap-3">
                          <span>No</span>
                        </TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className=" text-end">Qty</TableHead>
                        <TableHead className=" text-end">
                          Original Price
                        </TableHead>
                        <TableHead className=" text-end">Sale Price</TableHead>
                        <TableHead className=" text-end">Profit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data.length > 0 &&
                        data?.data.map(
                          (
                            {
                              id,
                              name,
                              qty,
                              salePrice,
                              originalPrice,
                              profit,
                            }: any,
                            index: number
                          ) => (
                            <TableRow key={id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{name}</TableCell>
                              <TableCell className=" text-end">{qty}</TableCell>
                              <TableCell className=" text-end">
                                {new Intl.NumberFormat("ja-JP").format(
                                  salePrice
                                )}
                              </TableCell>
                              <TableCell className=" text-end">
                                {new Intl.NumberFormat("ja-JP").format(
                                  originalPrice
                                )}
                              </TableCell>
                              <TableCell className=" text-end">
                                {new Intl.NumberFormat("ja-JP").format(profit)}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </div>
                {data?.data.length > 0 && (
                  <PaginationComponent
                    goToFirstPage={goToFirstPage}
                    currentPage={currentPage}
                    decrementPage={decrementPage}
                    incrementPage={incrementPage}
                    goToLastPage={goToLastPage}
                    lastPage={data?.totalPages}
                  />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default SizingReport;
