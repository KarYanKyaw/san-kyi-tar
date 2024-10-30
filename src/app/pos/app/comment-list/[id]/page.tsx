"use client";

import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { Backend_URL, getFetch, postFetch, putFetch } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import useSWRMutation from "swr/mutation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BreadCrumbComponent } from "@/components/ecom";
import { Textarea } from "@/components/ui/textarea";
import { stat } from "fs";

const Page = ({ params }: { params: { id: string } }) => {
  const getData = (url: string) => getFetch(url);
  const [editId, setEditId] = useState<any>({
    status: false,
    id: "",
  });

  const [text, setText] = useState("");
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const putFetcher = (url: string, { arg }: { arg: any }) => {
    return putFetch(url, arg);
  };

  const [availableSizes, setAvailableSizes] = useState<any[]>([]);

  const { data, mutate } = useSWR(`${Backend_URL}/comments`, getData);

  const [imageToShow, setImagesToShow] = useState<any[]>([]);

  const {
    data: productData,
    isLoading,
    error,
  } = useSWR(`${Backend_URL}/ecommerce-products/${params.id}`, getData);

  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postFetch(url, arg);
  };

  const { error: replyError, trigger: reply } = useSWRMutation(
    `${Backend_URL}/comments`,
    postFetcher
  );

  useEffect(() => {
    if (productData) {
      const initialVariant = productData?.productVariants[0];
      // setSelectedColor(initialVariant?.colorCode);

      const initialSize = productData?.productVariants?.find(
        (variant: any) => variant.colorCode === initialVariant.colorCode
      )?.productSizing as string;

      setImagesToShow(productData.mediaUrls.map((el: any) => el?.url));

      const sizes = new Set(
        productData?.productVariants
          ?.filter(
            (variant: any) => variant.colorCode === initialVariant.colorCode
          )
          ?.map((variant: any) => variant?.productSizing as string)
      );

      const sizesArray = Array.from(sizes);

      setAvailableSizes(sizesArray);
    }
  }, [productData]);

  const processComment = async (type: any) => {
    const data = {
      status: `${type}`,
    };

    const res = await process(data);
    console.log(res);
  };

  const { data: processData, trigger: process } = useSWRMutation(
    editId.status ? `${Backend_URL}/comments/${editId.id}` : null,
    putFetcher
  );

  console.log(data);

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader
          parentPage="Comments"
          path="E-commerce"
          currentPage="Comments"
        />

        <div className="grid lg:grid-cols-12 gap-5 lg:gap-0 h-auto">
          <div className="overflow-auto w-full lg:col-span-6">
            <div className=" flex gap-3 lg:flex-col w-full lg:h-6500px] overflow-auto h-[600px]">
              {imageToShow.length > 0 && (
                <>
                  {imageToShow.map((el: any, index: any) => (
                    <Image
                      key={index}
                      src={el}
                      alt=""
                      className="!w-full !h-full object-contain object-top"
                      width={300}
                      height={300}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="lg:p-10 lg:col-span-6 ">
            <div className=" w-[90%] flex flex-col gap-[24px] mx-start">
              <div
                style={{ alignContent: "baseline" }}
                className="flex justify-between "
              >
                <BreadCrumbComponent path="Home" currentPage="Best Sellers" />
                <p className=" font-bold text-[20px] lg:text-[24px]">
                  {productData?.productBrand}
                </p>
              </div>
              <div className=" space-y-1.5">
                <p className="lg:text-2xl text-lg font-bold">
                  {productData?.name}
                </p>
                <p className=" font-normal text-primary/90 lg:text-sm text-xs">
                  {productData?.description}
                </p>
                {productData?.productVariants.length < 1 && (
                  <Badge variant={"destructive"}>Out Of Stock</Badge>
                )}
              </div>
              <div className=" flex flex-col gap-[9px]">
                {(productData?.discountPrice as number) > 0 ? (
                  <div className=" space-y-1.5 text-lg lg:font-semibold ">
                    <Badge className=" text-black bg-neutral-300">
                      {productData?.discountPrice}%
                    </Badge>

                    <div className="lg:flex gap-2 space-y-1 items-center">
                      <p className=" line-through opacity-80">
                        {new Intl.NumberFormat("ja-JP").format(
                          productData?.salePrice
                        )}{" "}
                        MMK
                      </p>
                      <p className="text-lg !mt-0 ">
                        {new Intl.NumberFormat("ja-JP").format(
                          productData?.salePrice *
                            (1 - (productData?.discountPrice as number) / 100)
                        )}{" "}
                        MMK
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-lg ">
                    {new Intl.NumberFormat("ja-JP").format(
                      productData?.salePrice
                    )}{" "}
                    MMK
                  </p>
                )}
                <div className=" block">
                  <Badge>{productData?.productFitting}</Badge>
                </div>
              </div>

              {productData?.productVariants.length > 0 && (
                <>
                  <div>
                    <p className="text-neutral-500 mb-2 text-xs lg:text-sm uppercase">
                      available colors
                    </p>
                    <div className="flex gap-3">
                      {productData?.productVariants
                        .filter(
                          (variant: any, index: any, self: any) =>
                            index ===
                            self.findIndex(
                              (v: any) => v.colorCode === variant.colorCode
                            )
                        )
                        .map(
                          (
                            {
                              mediaUrl,
                            }: {
                              mediaUrl: string;
                              colorCode: string;
                              id: number;
                            },
                            index: number
                          ) => (
                            <div key={index}>
                              <div
                                style={{
                                  backgroundImage: `url(${mediaUrl})`,
                                }}
                                className="lg:w-7 lg:h-7 h-6 bg-red-900 w-6 rounded-full bg-cover bg-center"
                              ></div>
                            </div>
                          )
                        )}
                    </div>
                    <div className=" lg:w-1/2">
                      <div className="space-y-3">
                        <p className="text-neutral-500 mb-2 text-xs lg:text-sm uppercase">
                          available Size
                        </p>
                        <ToggleGroup size="sm" type="single">
                          {availableSizes?.map((el: any, index: any) => (
                            <ToggleGroupItem key={index} value={el}>
                              {el}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="my-12 space-y-4">
          <p className="text-2xl font-semibold">Customer Reviews</p>

          <div className="w-full lg:w-1/2 my-6">
            <p className="font-medium">All Reviews</p>
            {data?.data
              ?.filter((el: any) => el.productId == params.id)
              .map(({ id, content, customerName, status, replies }: any) => (
                <div
                  key={id}
                  className="border mt-3 space-y-2 border-neutral-400 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{customerName}</p>
                    {status == "PENDING" && (
                      <div className=" flex gap-3 justify-between">
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await setEditId({
                              status: true,
                              id: id,
                            });
                            await processComment("APPROVED");
                            mutate();
                          }}
                          size={"sm"}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await setEditId({
                              status: true,
                              id: id,
                            });
                            await processComment("DECLINED");
                            mutate();
                          }}
                          size={"sm"}
                          variant="outline"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-light">{content}</p>

                  {replies.length > 0 && (
                    <>
                      {replies.map(
                        ({ content, customerName }: any, index: any) => (
                          <div key={index} className=" space-y-2">
                            <p className="font-medium">{customerName}</p>
                            <p className="text-sm font-light">{content}</p>
                          </div>
                        )
                      )}
                    </>
                  )}

                  {status == "APPROVED" && (
                    <>
                      <Textarea
                        rows={1}
                        value={editId.id == id ? text : ""}
                        ref={inputRef}
                        onChange={(e) => {
                          setEditId({
                            status: true,
                            id: id,
                          });
                          setText(e.target.value);
                        }}
                        placeholder="Write a reply"
                        className="w-full lg:w-2/3"
                      />
                      {text?.length > 0 && editId.id == id && (
                        <div className="flex justify-end lg:w-2/3 w-full">
                          <Button
                            onClick={async () => {
                              const res = await reply({
                                content: text,
                                productId: params.id,
                                parentId: id,
                              });

                              if (res?.status) {
                                setText("");
                                setEditId({
                                  status: false,
                                  id: "",
                                });
                                mutate();
                              }
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {status == "DECLINED" && (
                    <p className=" text-red-500">
                      This comment has been deleted!
                    </p>
                  )}
                </div>
              ))}
          </div>

          {replyError && (
            <p className=" text-red-500 text-sm">{replyError.message}</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Page;
