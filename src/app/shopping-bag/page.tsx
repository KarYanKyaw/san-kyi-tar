"use client";
import { Container } from "@/components/ecom";
import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppProvider } from "../Provider/AppProvider";
import Image from "next/image";
import OrderSummary from "@/components/ecom/OrderSummary";
import { useRouter } from "next/navigation";
import SweetAlert2 from "react-sweetalert2";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import useSWR from "swr";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ShoppingBag = () => {
  const {
    cartItems,
    setCartItems,
    handleLogin,
    orderRecord,
    setOrderRecord,
    removeFromCart,
  } = useAppProvider();

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  const handleClick = () => {
    if (isClient) {
      if (localStorage.getItem("userId")) {
        router.push("/checkout");
      } else {
        setSwalProps({
          ...swalProps,
          show: true,
        });
      }
    }
  };

  const totalCost = orderRecord.reduce(
    (pv: any, cv: any) => pv + cv.quantity * cv.priceAfterDiscount,
    0
  );

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/landscape-banners`,
    getData
  );

  console.log(data);

  return (
    <Container className=" pt-4">
      <p className=" text-sm my-[15px]">Shopping Bag</p>
      <div className=" grid grid-cols-12 gap-4">
        <div className=" col-span-full  lg:col-span-9">
          <p className=" text-lg lg:text-3xl uppercase pb-6 font-semibold">
            Shopping Bag
          </p>
          <Table className=" border">
            <TableHeader className="hover:bg-white">
              <TableRow className="hover:bg-white bg-white">
                <TableHead className="flex w-[50px] items-center gap-3">
                  <span>No</span>
                </TableHead>
                <TableHead className=" ">Product Name</TableHead>
                <TableHead className=" text-end">Quantity</TableHead>
                <TableHead className=" hidden lg:table-cell text-end">
                  Price
                </TableHead>
                <TableHead className=" hidden lg:table-cell text-end">
                  Discount
                </TableHead>
                <TableHead className=" hidden  lg:table-cell w-[200px] text-end">
                  SubTotal
                </TableHead>
                <TableHead className="text-end"></TableHead>
              </TableRow>
            </TableHeader>
            {orderRecord.length < 1 ? (
              <TableBody>
                <TableRow className="pointer-events-none bg-white">
                  {Array(7)
                    .fill(null)
                    .map((_, index) => (
                      <TableCell className="pointer-events-none" key={index}>
                        <p className="py-3"></p>
                      </TableCell>
                    ))}
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {orderRecord?.map((data: any, index: number) => (
                  <TableRow
                    key={`${data.id}-${index}`}
                    className=" bg-white hover:bg-white/35"
                  >
                    <TableCell className="w-[50px] ">{index + 1}.</TableCell>
                    <TableCell>
                      <div className=" flex  gap-2">
                        <Image
                          src={data.photo}
                          width={300}
                          className=" h-[60px] lg:h-[120px] w-[40px] lg:w-[100px] object-cover"
                          height={300}
                          alt=""
                        />
                        <div className="flex gap-1 items-start justify-center flex-col">
                          <p className="capitalize font-medium">{data.name}</p>
                          <div className="flex items-center gap-1">
                            <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {data.colorCode}
                            </div>
                            <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {data.productSizing}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className=" text-end">
                      <div className="flex items-center gap-1">
                        <Button
                          variant={"outline"}
                          className=" !p-2"
                          size={"sm"}
                          onClick={() => {
                            if (data?.quantity > 1) {
                              setOrderRecord(
                                orderRecord.map((item: any) => {
                                  if (item.itemId === data.itemId) {
                                    return {
                                      ...item,
                                      quantity: item.quantity - 1,
                                    };
                                  }
                                  return item;
                                })
                              );
                            } else {
                              removeFromCart(data?.itemId);
                            }
                          }}
                        >
                          <Minus size={14} />
                        </Button>
                        <p className=" w-[1rem]">{data.quantity}</p>
                        <Button
                          onClick={() => {
                            if (data?.availableQuantity > data?.quantity) {
                              const newOrderRecord = orderRecord.map(
                                (item: any) => {
                                  if (item.itemId === data.itemId) {
                                    return {
                                      ...item,
                                      quantity: item.quantity + 1,
                                    };
                                  }
                                  return item;
                                }
                              );
                              setOrderRecord(
                                newOrderRecord.filter(
                                  (item: any) => item.quantity !== 0
                                )
                              );
                            }
                          }}
                          variant={"outline"}
                          className=" !p-2"
                          size={"sm"}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className=" hidden lg:table-cell text-end">
                      {new Intl.NumberFormat("ja-JP").format(
                        data.quantity * data.salePrice || 0
                      )}
                    </TableCell>
                    <TableCell className=" hidden lg:table-cell text-end ">
                      {data.amountSaved > 0 ? (
                        <>
                          -
                          {new Intl.NumberFormat("ja-JP").format(
                            data.quantity * data.amountSaved || 0
                          )}
                        </>
                      ) : (
                        <p>0</p>
                      )}
                    </TableCell>
                    <TableCell className=" hidden lg:table-cell text-end">
                      {new Intl.NumberFormat("ja-JP").format(
                        data.quantity * data.priceAfterDiscount
                      )}
                    </TableCell>
                    <TableCell className=" text-end ms-4">
                      <Button
                        onClick={() => removeFromCart(data.itemId)}
                        variant="ghost"
                        size="sm"
                        type="button"
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
        <div className=" col-span-full lg:col-span-3">
          <OrderSummary
            disabled={orderRecord.length == 0}
            buttonName="Proceed to checkout"
            cost={totalCost}
            run={handleClick}
          />
        </div>
      </div>

      <div className=" grid grid-cols-12 my-12 gap-4">
        <div className=" col-span-full">
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
                  {data?.data.map(({ id, desktopImage, mobileImage }: any) => (
                    <CarouselItem
                      key={id}
                      className=" h-full w-full flex justify-center items-center "
                    >
                      <Image
                        src={desktopImage}
                        className=" hidden lg:block w-full object-contain h-[500px]"
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

      {isClient && (
        <SweetAlert2
          customClass={{
            popup: "w-auto",
          }}
          {...swalProps}
        >
          <div className=" pointer-events-none space-y-3 text-center">
            <p className=" pointer-events-none font-medium">
              Proceed To Checkout
            </p>
            <p className=" pointer-events-none text-black/50 text-sm">
              Please Login To Continue.
            </p>
            <div className="  pointer-events-none flex gap-3 justify-center items-center">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSwalProps({
                    ...swalProps,
                    show: false,
                  });
                }}
                size={"sm"}
                className="  pointer-events-auto"
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  handleLogin();
                  e.stopPropagation();
                  setSwalProps({
                    ...swalProps,
                    show: false,
                  });
                }}
                size={"sm"}
                className="  pointer-events-auto"
              >
                Sign In
              </Button>
            </div>
          </div>
        </SweetAlert2>
      )}
    </Container>
  );
};

export default ShoppingBag;
