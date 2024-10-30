import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
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
    <div className=" lg:h-[650px] h-[400px]">
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
              <CarouselItem className=" h-[400px] lg:h-[600px] flex mb-24 justify-center items-center lg:w-[1260px] bg-neutral-600"></CarouselItem>
            ) : (
              <>
                {data?.data
                  ?.sort((a: any, b: any) => a.sorting - b.sorting)
                  .map(({ id, desktopImage, mobileImage }: any) => (
                    <CarouselItem
                      key={id}
                      className=" lg:h-[650px] w-full flex justify-center items-center "
                    >
                      <Image
                        src={desktopImage}
                        className=" hidden lg:block w-full object-cover object-top lg:h-[650px]"
                        alt="banner photo"
                        width={800}
                        height={800}
                      />
                      <Image
                        src={mobileImage}
                        className=" lg:hidden block w-full object-contain !h-[400px]"
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
