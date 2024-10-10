"use client";

import {
  BreadCrumbComponent,
  Container,
  Heading,
  Products,
} from "@/components/ecom";
import PaginationEcom from "@/components/ecom/PaginationEcom";
import ProductSkeleton from "@/components/ecom/ProductSkeleton";
import ErrorComponent from "@/components/ErrorComponent";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import ControlSheet from "@/components/ecom/ControlSheet";
import FilterForm from "@/components/ecom/FilterForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GeneralizedPage = ({ params }: { params: any }) => {
  const [sorting, setSorting] = useState("");
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [limit, setLimit] = useState(8);
  const router = useRouter();

  // Decode the entire slug
  const decodedString = decodeURIComponent(params.slug[0]);
  const slugSegments = params.slug.slice(1); // Extract all segments after the first

  // Format the result by joining with commas and replacing encoded characters
  const formattedResult = slugSegments
    .join(",")
    .replace(/%2C/g, ",") // Replace %2C with commas
    .replace(/%20/g, " "); // Replace %20 with spaces

  // Fetch data using SWR
  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/ecommerce-Products/riddle?${decodedString}${
      sorting ? `&orderBy=salePrice&orderDirection=${sorting}` : ""
    }&limit=${12}`, // include currentPage in the fetch key
    getFetchForEcom
  );

  // Remove the page parameter from the query string
  const newString = decodedString.replace(/&page=\d+/, "");

  const [currentPage, setCurrentPage] = useState(
    Number(new URLSearchParams(decodedString).get("page"))
  );

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // set the current page in state

    const newUrl = `/products-filter/${newString}&page=${page}${
      sorting ? `&orderBy=salePrice&orderDirection=${sorting}` : ""
    }/${formattedResult}`;
    router.push(newUrl); // use router.push to trigger a re-render
  };

  return (
    <div className="py-8 space-y-4">
      <Container>
        <BreadCrumbComponent
          path="Home"
          currentPage={
            slugSegments.length > 0 ? formattedResult : "Filtered Products"
          }
        />
        <Heading
          header={
            slugSegments.length > 0 ? formattedResult : "Filtered Products"
          }
          desc="The latest and greatest products to enhance his lifestyle"
        />
      </Container>

      <div className="py-3 border ">
        <Container>
          <div className="flex justify-end items-center">
            <div className="col-span-full space-y-1.5">
              <Select
                onValueChange={(e) => {
                  setSorting(e);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Low to high</SelectItem>
                  <SelectItem value="desc">High to low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ControlSheet
              closeRef={closeRef}
              buttonName={
                <>
                  <SlidersHorizontal size={18} />{" "}
                  <span className="ms-1">Filter & Sort</span>
                </>
              }
              title="Filter"
              desc="Refine Your Style with Our Curated Fashion Filters"
            >
              <FilterForm closeRef={closeRef} />
            </ControlSheet>
          </div>
        </Container>
      </div>

      {error ? (
        <ErrorComponent refetch={() => {}} />
      ) : (
        <>
          <Container>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
                <ProductSkeleton />
              </div>
            ) : (
              <Products data={data?.data} isLoading={isLoading} />
            )}
          </Container>
          <div className=" py-3 border">
            <Container>
              <div className="flex gap-2 justify-end items-center">
                <div>
                  <PaginationEcom
                    currentPage={currentPage}
                    totalPages={data?.totalPages || 1}
                    onPageChange={(page) => {
                      handlePageChange(page);
                      console.log(page);
                    }}
                  />
                </div>
              </div>
            </Container>
          </div>
        </>
      )}
    </div>
  );
};

export default GeneralizedPage;
