"use client";
import { BreadCrumbComponent, Container, Heading } from "@/components/ecom";
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
import ProductCard from "@/components/ecom/ProductCard";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const GeneralizedPage = ({ params }: { params: any }) => {
  const [limit, setLimit] = useState(8);
  const [sorting, setSorting] = useState("");

  const { searchInputValue, setSearchInputValue } = useAppProvider();

  const getData = (url: string): any => {
    return getFetchForEcom(url);
  };

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const { data, isLoading, error } = useSWR(
    searchInputValue !== ""
      ? `${Backend_URL}/ecommerce-Products/riddle?sortBrand=${params.slug[1]}?search=${searchInputValue}`
      : `${Backend_URL}/ecommerce-Products/riddle?sortBrand=${params.slug[1]}
        }?page=${page}${
          sorting ? `&orderBy=salePrice&orderDirection=${sorting}` : ""
        }&limit=${12}`,
    getData
  );

  const [currentPage, setCurrentPage] = useState(Number(page));

  const {
    data: bannerData,
    isLoading: bannerLoading,
    error: bannerErrors,
  } = useSWR(`${Backend_URL}/banners`, getData);

  return (
    <div className=" py-8 space-y-12">
      <Container>
        <div className=" flex flex-col gap-[15px]">
          <BreadCrumbComponent
            path="Home"
            currentPage={decodeURIComponent(params.slug[0])}
          />

          <Heading
            header={`Products of ${decodeURIComponent(params.slug[0])}`}
            desc={`${decodeURIComponent(
              params.slug[0]
            )} products to enhance his lifestyle`}
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
              <div className="grid grid-cols-12 gap-x-[20px] gap-y-12 lg:gap-y-0 lg:grid-rows-2">
                {data?.data.length == 0 ? (
                  <div className="h-[500px] text-sm text-red-500 col-span-full text-center">
                    Thank you for your interest. Unfortunately, this product is
                    currently unavailable.
                  </div>
                ) : (
                  <>
                    {/* First 4 products in one row */}
                    {data?.data
                      .slice(0, 4)
                      .map(
                        ({
                          name,
                          gender,
                          productBrand,
                          salePrice,
                          id,
                          medias,
                          productCode,
                          discountPrice,
                          productVariants,
                        }: any) => (
                          <div
                            className="col-span-6 lg:col-span-3 row-span-1"
                            key={id}
                          >
                            <ProductCard
                              id={id}
                              name={name}
                              productBrand={productBrand}
                              salePrice={salePrice}
                              medias={medias}
                              discountPrice={discountPrice}
                              productCode={productCode}
                              productVariants={productVariants}
                            />
                          </div>
                        )
                      )}

                    {/* Next 2 products in the second row */}
                    {data?.data
                      .slice(5, 8)
                      .map(
                        ({
                          name,
                          gender,
                          productBrand,
                          salePrice,
                          id,
                          medias,
                          productCode,
                          discountPrice,
                          productVariants,
                        }: any) => (
                          <div
                            className="col-span-6  lg:col-span-3 row-span-1"
                            key={id}
                          >
                            <ProductCard
                              id={id}
                              name={name}
                              productBrand={productBrand}
                              salePrice={salePrice}
                              medias={medias}
                              discountPrice={discountPrice}
                              productCode={productCode}
                              productVariants={productVariants}
                            />
                          </div>
                        )
                      )}
                  </>
                )}

                {/* ad banner */}
                <div className="col-span-12 lg:col-span-3 bg-blue-500 row-span-1">
                  <Carousel
                    plugins={[
                      Autoplay({
                        delay: 1500,
                      }),
                    ]}
                    className="w-full"
                  >
                    <CarouselContent>
                      {bannerLoading || bannerErrors ? (
                        <CarouselItem className="  flex justify-center items-center bg-blue-600"></CarouselItem>
                      ) : (
                        <>
                          {bannerData?.data.map(({ id, url }: any) => (
                            <CarouselItem
                              key={id}
                              className=" h-full w-full flex justify-center items-center "
                            >
                              <Image
                                src={url}
                                className=" w-full object-cover bg-blue-700 h-full"
                                alt="banner photo"
                                width={800}
                                height={800}
                              />
                            </CarouselItem>
                          ))}
                        </>
                      )}
                    </CarouselContent>
                  </Carousel>
                </div>

                {data?.data
                  .slice(8, 12)
                  .map(
                    ({
                      name,
                      gender,
                      productBrand,
                      salePrice,
                      id,
                      medias,
                      productCode,
                      discountPrice,
                      productVariants,
                    }: any) => (
                      <div
                        className="col-span-6 lg:col-span-3 row-span-1"
                        key={id}
                      >
                        <ProductCard
                          id={id}
                          name={name}
                          productBrand={productBrand}
                          salePrice={salePrice}
                          medias={medias}
                          discountPrice={discountPrice}
                          productCode={productCode}
                          productVariants={productVariants}
                        />
                      </div>
                    )
                  )}
              </div>
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
                        `/${decodeURIComponent(params.slug[0])}?page=${page}`
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
