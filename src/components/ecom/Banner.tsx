import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Backend_URL, getFetch, getFetchForEcom } from "@/lib/fetch";
import useSWR from "swr";
import Image from "next/image";

const Banner = () => {
  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data, error, isLoading } = useSWR(
    `${Backend_URL}/api/v1/sliders`,
    getData
  );

  return (
    <div className=" lg:h-screen">
      <div className="flex justify-center object-contain items-center">
        <Carousel
          plugins={[
            Autoplay({
              delay: 1500,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {error || isLoading ? (
              <CarouselItem className=" h-[400px] lg:h-[600px] flex justify-center items-center lg:w-[1260px]  bg-neutral-600"></CarouselItem>
            ) : (
              <>
                {data?.data
                  ?.sort((a: any, b: any) => a.sorting - b.sorting)
                  .map(({ id, desktopImage, mobileImage }: any) => (
                    <CarouselItem
                      key={id}
                      className=" h-full w-full flex justify-center items-center "
                    >
                      <Image
                        src={desktopImage}
                        className=" hidden lg:block w-full object-contain h-full"
                        alt="banner photo"
                        width={800}
                        height={800}
                      />
                      <Image
                        src={mobileImage}
                        className=" lg:hidden block w-full object-contain h-full"
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
    </div>
  );
};

export default Banner;
