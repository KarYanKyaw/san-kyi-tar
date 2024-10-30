"use client";

import React, { useEffect, useState } from "react";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Backend_URL } from "@/lib/fetch";
import Image from "next/image";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import useSWRMutation from "swr/mutation";

const WishList = ({ closeRef }: any) => {
  const router = useRouter();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const getData = async (url: string) => {
    try {
      const token =
        typeof window !== "undefined" && localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const getFetch = (url: string) => {
    return getData(url);
  };

  const deleteData = async (url: string) => {
    try {
      const token =
        typeof window !== "undefined" && localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const { data, isLoading, error, mutate } = useSWR(
    `${Backend_URL}/wishlist`,
    getFetch,
    {
      refreshInterval: 4000,
      errorRetryCount: 0,
      errorRetryInterval: 6000,
    }
  );

  const { trigger: deleteItem } = useSWRMutation(
    deleteId !== null ? `${Backend_URL}/wishlist/${deleteId}` : null,
    deleteData
  );

  return (
    <div className=" space-y-3 bg-white pt-4 z-50 overflow-auto h-[90%] relative">
      {data?.data.flatMap((el: any) => el.wishlistRecords).length == 0 ? (
        <p>Your Wishlist is empty!</p>
      ) : (
        <div className=" h-[90%] overflow-auto space-y-3">
          {data?.data
            .flatMap((el: any) => el.wishlistRecords)
            .map((data: any, index: number) => (
              <div
                onClick={() => {
                  router.push(`/products/wishlist/${data?.productId}`);
                }}
                className=" cursor-pointer"
                key={index}
              >
                <div className=" grid grid-cols-3 gap-4">
                  <div className=" col-span-1">
                    <div className=" relative">
                      <Image
                        src={data?.image?.url}
                        width={300}
                        className=" h-[100px] lg:h-[150px] w-[150px] object-cover"
                        height={300}
                        alt=""
                      />
                      <Button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await setDeleteId(data?.id);
                          const res = await deleteItem();
                          if (res) {
                            mutate();
                          }
                        }}
                        variant={"outline"}
                        size={"sm"}
                        className=" absolute w-5 h-5 right-1 !p-0 top-0"
                      >
                        <X width={14} height={14} />
                      </Button>
                    </div>
                  </div>
                  <div className=" col-span-2">
                    <div className=" space-y-2">
                      <div className=" flex items-center gap-2">
                        <p className=" w-[100px] text-sm lg:text-sm font-normal">
                          {data?.productName}
                        </p>
                      </div>
                      {(data?.discountPrice as number) > 0 ? (
                        <div className=" space-y-1 text-xs lg:text-sm">
                          <Badge className=" text-black font-normal h-4 text-xs bg-neutral-300">
                            {data.discountPrice}%
                          </Badge>

                          <div className="lg:flex gap-2 items-center">
                            <p className=" line-through">
                              {new Intl.NumberFormat("ja-JP").format(
                                data.pricing
                              )}{" "}
                              MMK
                            </p>
                            <p className="text-xs lg:text-sm">
                              {new Intl.NumberFormat("ja-JP").format(
                                data.pricing *
                                  (1 - (data.discountPrice as number) / 100)
                              )}{" "}
                              MMK
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className=" text-xs lg:text-sm">
                          {new Intl.NumberFormat("ja-JP").format(data.pricing)}{" "}
                          MMK
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <hr className=" my-2" />
              </div>
            ))}
        </div>
      )}
      <div className=" bg-white absolute bottom-0 w-full">
        <div className=" space-y-1">
          <Button
            onClick={() => closeRef.current && closeRef.current.click()}
            size={"sm"}
            className=" w-full text-center"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishList;
