"use client";
import React, { useRef } from "react";
import Container from "./Container";
import Heading from "./Heading";
import { Button } from "../ui/button";
import { IconLeft, IconRight } from "react-day-picker";
import { Backend_URL, getFetch, getFetchForEcom } from "@/lib/fetch";
import useSWR from "swr";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCategories = () => {
  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    `${Backend_URL}/ecommerce-categories`,
    getData
  );

  const next = useRef<HTMLButtonElement | null>(null);
  const previous = useRef<HTMLButtonElement | null>(null);

  return (
    <Container>
      <div className=" flex flex-col gap-[40px] my-24 ">
        <div className=" flex justify-between items-center">
          <Heading
            header="shop by categories"
            desc="the latest and greatest products that every man needs to enhance his lifestyle"
          />
          <div className=" hidden  lg:flex gap-2">
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
        <div className=" ">
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
                {error || isLoading || data?.length == 0 ? (
                  <CarouselItem className=" h-[500px]  bg-neutral-700">
                    <div className=" py-12"></div>
                  </CarouselItem>
                ) : (
                  data.map(
                    (
                      { name, media, productCategory, id }: any,
                      index: number
                    ) => (
                      <CarouselItem
                        key={index}
                        onClick={() =>
                          router.push(
                            `/categories/${name.toLowerCase()}/${
                              productCategory.id
                            }/${id}?page=1`
                          )
                        }
                        className="cursor-pointer basis-[50%] lg:basis-[25%]"
                      >
                        <Image
                          src={media.url}
                          className=" h-[500px] lg:h-[500px] object-cover object-top"
                          alt=""
                          width={300}
                          height={600}
                        />
                        <div className=" font-medium p-3 text-base lg:text-base ">
                          {name}
                        </div>
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
    </Container>
  );
};

export default ProductCategories;
