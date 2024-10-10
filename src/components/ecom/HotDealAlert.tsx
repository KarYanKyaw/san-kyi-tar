"use client";
import React, { useRef } from "react";
import Heading from "./Heading";
import { useRouter } from "next/navigation";
import Container from "./Container";
import { Button } from "../ui/button";
import { IconLeft, IconRight } from "react-day-picker";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "./ProductCard";

const HotDealAlert = ({ data, isLoading }: any) => {
  const next = useRef<HTMLButtonElement | null>(null);
  const previous = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  return (
    <div className=" space-y-4 mb-12">
      <div className=" flex justify-between items-center">
        <Heading header="You Might Also Like" desc="Check this out!" />
        <div className=" hidden lg:flex gap-2">
          <Button
            onClick={() => previous.current && previous.current.click()}
            size={"sm"}
            variant={"outline"}
          >
            <IconLeft />
          </Button>
          <Button
            onClick={() => next.current && next.current.click()}
            size={"sm"}
          >
            <IconRight />
          </Button>
        </div>
      </div>
      <div className="">
        <div className="flex justify-center object-contain items-center">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {isLoading ? (
                <CarouselItem className="">
                  <div className=" py-12"></div>
                </CarouselItem>
              ) : (
                data.data.map(
                  (
                    {
                      name,
                      medias,
                      productBrand,
                      id,
                      salePrice,
                      productCode,
                      productVariants,
                    }: any,
                    index: number
                  ) => (
                    <CarouselItem
                      key={index}
                      className=" basis-2/3 lg:basis-1/3"
                    >
                      <ProductCard
                        id={id}
                        productVariants={productVariants}
                        productCode={productCode}
                        name={name}
                        productBrand={productBrand}
                        salePrice={salePrice}
                        medias={medias}
                      />
                    </CarouselItem>
                  )
                )
              )}
            </CarouselContent>
            <div className=" hidden">
              <CarouselNext ref={next} />
              <CarouselPrevious ref={previous} />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default HotDealAlert;
