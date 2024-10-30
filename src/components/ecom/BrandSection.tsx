import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import useSWR from "swr";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { useRouter } from "next/navigation";

const BrandSection = () => {
  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/product-brands/all`,
    getData
  );

  const router = useRouter();

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 1500,
          stopOnInteraction: true,
          jump: false,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {error || isLoading ? (
          <CarouselItem className=" h-[400px] lg:h-[600px] flex justify-center items-center lg:w-[1260px]  bg-neutral-600"></CarouselItem>
        ) : (
          <>
            {data?.data.map(
              (
                {
                  name,
                  media,
                  id,
                }: {
                  name: string;
                  id: number;
                  media: {
                    url: string;
                  };
                },
                index: number
              ) => (
                <CarouselItem key={index} className=" basis-2/3 lg:basis-1/6">
                  <Image
                    onClick={() => {
                      router.push(`/brands/${name}/${id}?page=1`);
                    }}
                    src={media?.url}
                    width={300}
                    className=" h-[80px] lg:h-[100px] w-[80px] rounded-full lg:w-[100px] object-cover"
                    height={300}
                    alt=""
                  />
                  {/* {name} */}
                </CarouselItem>
              )
            )}
          </>
        )}
      </CarouselContent>
    </Carousel>
  );
};

export default BrandSection;
