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
import { useAppProvider } from "@/app/Provider/AppProvider";
import ControlSheet from "@/components/ecom/ControlSheet";
import FilterForm from "@/components/ecom/FilterForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

const GeneralizedPage = ({ params }: { params: any }) => {
  const [limit, setLimit] = useState(8);
  const [sorting, setSorting] = useState("");

  const { searchInputValue, setSearchInputValue } = useAppProvider();

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const { data, isLoading, error } = useSWR(
    searchInputValue !== ""
      ? `${Backend_URL}/ecommerce-Products/riddle/${params.slug[0]}?search=${searchInputValue}`
      : `${Backend_URL}/ecommerce-Products/riddle/${
          params.slug[0]
        }?page=${page}${
          sorting ? `&orderBy=salePrice&orderDirection=${sorting}` : ""
        }&limit=${12}`,
    getData
  );

  const [currentPage, setCurrentPage] = useState(Number(page));

  return (
    <div className=" py-8 space-y-12">
      <Container>
        <div className=" flex flex-col gap-[15px]">
          <BreadCrumbComponent
            path="Home"
            currentPage={params.slug[0] == "new-in" ? "New In" : params.slug[0]}
          />

          <Heading
            header={`New products for ${
              params.slug[0] == "new-in" ? "you" : params.slug[0]
            }`}
            desc={`the latest and greatest products ${params.slug[0]} to enhance his lifestyle`}
          />
        </div>
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
              <div className=" mb-12 grid grid-cols-2 gap-x-3 gap-y-12 lg:grid-cols-4">
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
                      router.replace(`/${params.slug[0]}?page=${page}`);
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
