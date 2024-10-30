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
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import ControlSheet from "@/components/ecom/ControlSheet";
import FilterForm from "@/components/ecom/FilterForm";
import { useAppProvider } from "@/app/Provider/AppProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GeneralizedPage = ({ params }: { params: any }) => {
  const { searchInputValue, setSearchInputValue } = useAppProvider();

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const [sorting, setSorting] = useState("");

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();

  const decodedString = decodeURIComponent(params.slug[0]);

  const [currentPage, setCurrentPage] = useState(Number(params.slug[1]));

  const newString = decodedString.replace(/&page=\d+/, "");

  const { data, isLoading, error } = useSWR(
    searchInputValue !== ""
      ? `${Backend_URL}/ecommerce-Products/riddle?${decodedString}&search=${searchInputValue}&page=${params.slug[1]}`
      : `${Backend_URL}/ecommerce-Products/riddle?${decodedString}&page=${
          params.slug[1]
        }${
          sorting ? `&orderBy=salePrice&orderDirection=${sorting}` : ""
        }&limit=${12}`,
    getData
  );

  return (
    <div className=" py-8 space-y-4">
      <Container>
        {decodeURIComponent(params.slug[2]) !== "undefined" && (
          <BreadCrumbComponent
            path="Home"
            currentPage={decodeURIComponent(params.slug[2])}
          />
        )}
        <Heading
          header={`FOUND ${data?.total || 0} ${data?.total > 1 ? "Products" : "Product"}`}
          desc={`the latest and greatest products to enhance your lifestyle!`}
        />
      </Container>
      <div className=" py-3 border">
        <Container>
          <div className="flex justify-end items-center">
            <div className=" flex items-center justify-end gap-3">
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
                    <span className=" ms-1">Filter & Sort</span>
                  </>
                }
                title="Filter"
                desc="Refine Your Style with Our Curated Fashion Filters"
              >
                <FilterForm closeRef={closeRef} />
              </ControlSheet>
            </div>
          </div>
        </Container>
      </div>
      {error ? (
        <ErrorComponent refetch={() => {}} />
      ) : (
        <>
          <Container>
            {isLoading ? (
              <div className=" grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
                <ProductSkeleton />
              </div>
            ) : (
              <Products data={data.data} isLoading={isLoading} />
            )}
          </Container>
          <div className=" py-3 border">
            <Container>
              <div className="flex gap-2 justify-end items-center">
                <div>
                  <PaginationEcom
                    currentPage={currentPage}
                    totalPages={data?.totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      router.replace(
                        `/products-filter/${decodedString}/${page}/${decodeURIComponent(
                          params.slug[2]
                        )}`
                      );
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
