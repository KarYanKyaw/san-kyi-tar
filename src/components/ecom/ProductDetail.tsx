"use client";

import { useAppProvider } from "@/app/Provider/AppProvider";
import { BreadCrumbComponent, Container } from "@/components/ecom";
import HotDealAlert from "@/components/ecom/HotDealAlert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Backend_URL, getFetch, getFetchForEcom } from "@/lib/fetch";
import { DashIcon } from "@radix-ui/react-icons";
import { Heart, PlusIcon, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import SweetAlert2 from "react-sweetalert2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type orderItem = {
  itemId: number;
  name: string;
  variantId: number;
  colorCode: string;
  photo: string;
  priceAfterDiscount?: number;
  quantity: number;
  discount?: number;
  salePrice: number;
  productSizing: string;
  amountSaved?: number;
  ids: any;
  availableQuantity: number;
  availableIds: number[];
  productId: number;
};

const ProductDetail = ({ id }: { id: string }) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [totalAvailable, setTotalAvailable] = useState<number>(0);
  const [onlyLeft, setOnlyLeft] = useState<string>("");
  const [variantId, setVariantId] = useState<number | undefined>();
  const [imageToShow, setImagesToShow] = useState<any[]>([]);

  const { orderRecord, setOrderRecord, handleLogin } = useAppProvider();

  const getData = (url: string) => getFetchForEcom(url);

  const {
    data: productData,
    isLoading,
    error,
  } = useSWR(`${Backend_URL}/ecommerce-products/${id}`, getData);

  const getWishlistData = async (url: string) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  };

  const { data: wishlistData, mutate } = useSWR(
    `${Backend_URL}/wishlist`,
    getWishlistData
  );

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  const addToCart = () => {
    const dataToDisplay = productData?.productVariants.find(
      (el: any) => el.id === variantId
    );
    const availableIds = productData?.productVariants
      .filter(
        (el: any) =>
          el.productSizing == selectedSize && el.colorCode == selectedColor
      )
      .map((el: any) => el.id);

    if (dataToDisplay) {
      const existsInOrder = orderRecord
        ?.map((el: any) => el.variantId)
        .includes(variantId);

      if (!existsInOrder) {
        const records: orderItem[] = dataToDisplay
          ? [
              {
                itemId: Date.now(),
                productId: productData?.id as number,
                name: productData?.name as string,
                quantity: quantity,
                salePrice: productData?.salePrice as number,
                colorCode: dataToDisplay.colorCode,
                productSizing: dataToDisplay.productSizing,
                variantId: dataToDisplay.id,
                photo: dataToDisplay.mediaUrl,
                discount: productData?.discountPrice,
                priceAfterDiscount:
                  productData?.salePrice *
                  (1 - (productData?.discountPrice as number) / 100),
                amountSaved:
                  productData?.salePrice -
                  productData?.salePrice *
                    (1 - (productData?.discountPrice as number) / 100),
                ids: [dataToDisplay.id],
                availableQuantity: totalAvailable,
                availableIds: availableIds,
              },
            ]
          : [];

        setOrderRecord([...orderRecord, ...records]);
      }
    }
  };

  useEffect(() => {
    if (productData) {
      const initialVariant = productData?.productVariants[0];
      setSelectedColor(initialVariant?.colorCode);

      const initialSize = productData?.productVariants?.find(
        (variant: any) => variant.colorCode === initialVariant.colorCode
      )?.productSizing as string;

      setSelectedSize(initialSize);

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

      setVariantId(initialVariant?.id);
    }
  }, [productData]);

  useEffect(() => {
    if (productData)
      setTotalAvailable(
        productData?.productVariants?.filter(
          (variant: any) =>
            variant.colorCode === selectedColor &&
            variant.productSizing === selectedSize
        ).length
      );
  }, [selectedColor, selectedSize]);

  const handleColorChange = (colorCode: string) => {
    setSelectedColor(colorCode);

    const filteredSizes = new Set<string>(
      productData?.productVariants
        .filter((variant: any) => variant.colorCode === colorCode)
        .map((variant: any) => variant?.productSizing as string)
    );

    const sizesArray = Array.from(filteredSizes);

    setAvailableSizes(sizesArray);

    setSelectedSize(sizesArray[0] || "");
    setQuantity(1);
    setOnlyLeft("");
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const alertRef = useRef<HTMLButtonElement | null>(null);

  const postData = async (url: string, { arg }: { arg: any }) => {
    const token = isClient && localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(arg),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  };

  const {
    data: addWishListData,
    trigger: addWishList,
    error: addError,
  } = useSWRMutation(`${Backend_URL}/wishlist`, postData);

  const addToWishList = async () => {
    if (isClient) {
      if (localStorage.getItem("userId")) {
        const data = {
          productId: productData?.id,
          salePrice: productData?.salePrice,
        };
        const res = await addWishList(data);
        res;
      } else {
        alertRef.current && alertRef.current.click();
      }
    }
  };

  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  const { trigger: deleteItem } = useSWRMutation(
    deleteId !== null ? `${Backend_URL}/wishlist/${deleteId}` : null,
    deleteData
  );

  const { data: dealData, isLoading: isDealLoading } = useSWR(
    `${Backend_URL}/ecommerce-Products/riddle/${
      productData?.category
    }?limit=${4}`,
    getData
  );

  return (
    <>
      {isLoading ? (
        // skeleton loader
        <Container>
          <div className="grid lg:grid-cols-5 gap-5 h-auto">
            <div className="overflow-auto w-full lg:col-span-2">
              <div className=" flex gap-3 lg:flex-col w-full bg-neutral-500 animate-pulse lg:h-[700px] overflow-auto  h-[400px]"></div>
            </div>
            <div className="lg:p-10 lg:col-span-3 space-y-2 lg:space-y-4 ">
              <div className=" hidden lg:block">
                <BreadCrumbComponent path="Home" currentPage="Best Sellers" />
              </div>
              <div className=" space-y-1">
                <div className="flex gap-3 items-center">
                  <span className=" h-3 w-24 bg-neutral-500 animate-pulse"></span>
                </div>
                <div className=" h-3 w-24 bg-neutral-500 animate-pulse"></div>
              </div>
              <div className=" h-3 w-24 bg-neutral-500 animate-pulse"></div>

              <div>
                <p className="text-neutral-500 mb-2 text-xs lg:text-base uppercase">
                  available colors
                </p>
                <div className=" flex gap-3">
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-neutral-500 mb-2 text-xs lg:text-base uppercase">
                  Select Size
                </p>
                <div className=" flex gap-3">
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <p className="text-neutral-500 mb-2 text-xs lg:text-base uppercase">
                  Quantity
                </p>
                <div className=" flex gap-3">
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                  <div className=" h-7 w-7 bg-neutral-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className=" flex gap-3">
                <div className=" h-3 w-12 bg-neutral-500 animate-pulse"></div>
                <div className=" h-3 w-12 bg-neutral-500 animate-pulse"></div>
                <div className=" h-3 w-12 bg-neutral-500 animate-pulse"></div>
                <div className=" h-3 w-12 bg-neutral-500 animate-pulse"></div>
              </div>
              <div className=" h-3 w-12 bg-neutral-500 animate-pulse"></div>

              <div className=" pt-2 flex gap-2">
                <Button
                  onClick={addToCart}
                  disabled={isLoading}
                  className=" w-full lg:w-3/5"
                ></Button>
                <Button
                  onClick={() => addToWishList()}
                  size={"sm"}
                  variant={"outline"}
                >
                  <Heart />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      ) : (
        <Container>
          <div>
            {addError && (
              <p className=" text-red-500 text-sm">{addError.message}</p>
            )}
            <div className="grid lg:grid-cols-12 gap-5 lg:gap-0 h-auto">
              <div className="overflow-auto w-full lg:col-span-6">
                <div className=" flex gap-3 lg:flex-col w-full lg:h-[860px] overflow-auto h-[600px]">
                  {imageToShow.length > 0 && (
                    <>
                      {imageToShow.map((el: any, index: any) => (
                        <Image
                          key={index}
                          onClick={() =>
                            setSwalProps({
                              ...swalProps,
                              show: true,
                            })
                          }
                          src={el}
                          alt=""
                          className="!w-full !h-full object-contain"
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
                    <BreadCrumbComponent
                      path="Home"
                      currentPage="Best Sellers"
                    />
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
                          {productData.discountPrice}%
                        </Badge>

                        <div className="lg:flex gap-2 space-y-1 items-center">
                          <p className=" line-through opacity-80">
                            {new Intl.NumberFormat("ja-JP").format(
                              productData.salePrice
                            )}{" "}
                            MMK
                          </p>
                          <p className="text-lg !mt-0 ">
                            {new Intl.NumberFormat("ja-JP").format(
                              productData.salePrice *
                                (1 -
                                  (productData.discountPrice as number) / 100)
                            )}{" "}
                            MMK
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-lg ">
                        {new Intl.NumberFormat("ja-JP").format(
                          productData.salePrice
                        )}{" "}
                        MMK
                      </p>
                    )}
                    <div className=" block">
                      <Badge>{productData.productFitting}</Badge>
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
                                  colorCode,
                                  id,
                                }: {
                                  mediaUrl: string;
                                  colorCode: string;
                                  id: number;
                                },
                                index: number
                              ) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    handleColorChange(colorCode);
                                    setVariantId(id);
                                    setImagesToShow([mediaUrl]);
                                    setTotalAvailable(1);
                                  }}
                                  className={`cursor-pointer rounded-full p-1 ${
                                    colorCode === selectedColor
                                      ? "border border-input"
                                      : ""
                                  }`}
                                >
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
                      </div>
                      <div className=" lg:w-1/2">
                        <div className="space-y-3">
                          <p className="text-neutral-500 mb-2 text-xs lg:text-sm uppercase">
                            Select Size
                          </p>
                          <ToggleGroup
                            value={selectedSize}
                            defaultValue={selectedSize}
                            onValueChange={(e) => {
                              setSelectedSize(e);
                              setOnlyLeft("");
                              setVariantId(
                                productData?.productVariants.find(
                                  (el: any) => el.productSizing == e
                                ).id
                              );
                            }}
                            size="sm"
                            type="single"
                          >
                            {availableSizes?.map((el: any, index: any) => (
                              <ToggleGroupItem
                                disabled={availableSizes.length === 1}
                                key={index}
                                value={el}
                              >
                                {el}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                        </div>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-2 mt-5 text-xs lg:text-sm uppercase">
                          Quantity
                        </p>
                        <div className=" rounded-md border w-[130px] flex items-center">
                          <Button
                            onClick={() => {
                              if (quantity !== 1) {
                                setOnlyLeft("");
                                setQuantity(quantity - 1);
                              }
                            }}
                            size={"sm"}
                            variant={"ghost"}
                          >
                            <DashIcon />
                          </Button>
                          <p className=" text-center w-[2rem]">{quantity}</p>
                          <Button
                            size={"sm"}
                            onClick={() => {
                              if (selectedSize == "") {
                                setOnlyLeft(`Select Size First!`);
                                return;
                              }
                              if (quantity == totalAvailable) {
                                setOnlyLeft(
                                  ` Sorry! Only ${totalAvailable} is in stock now.`
                                );
                              } else {
                                setQuantity(quantity + 1);
                              }
                            }}
                            variant={"ghost"}
                          >
                            <PlusIcon />
                          </Button>
                        </div>
                        {onlyLeft && (
                          <p className=" my-2 text-sm text-red-500">
                            {onlyLeft}.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  <div className=" flex items-center justify-start pt-2 gap-2">
                    <Button
                      size={"lg"}
                      onClick={addToCart}
                      disabled={productData?.productVariants.length < 1}
                      className=" w-full lg:w-3/5"
                    >
                      Add to cart
                    </Button>
                    <Button
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (
                          wishlistData?.data
                            .flatMap((el: any) => el.wishlistRecords)
                            .map((el: any) => el?.productId)
                            .includes(productData?.id)
                        ) {
                          await setDeleteId(
                            wishlistData?.data
                              .flatMap((el: any) => el.wishlistRecords)
                              .find(
                                (el: any) => el?.productId == productData?.id
                              )?.id
                          );
                          const res = await deleteItem();
                          if (res) {
                            mutate();
                          }
                          return;
                        } else {
                          await addToWishList();
                        }
                      }}
                      variant={"outline"}
                      className=" h-10 !bg-transparent "
                      size={"sm"}
                    >
                      {wishlistData?.data
                        .flatMap((el: any) => el.wishlistRecords)
                        .map((el: any) => el?.productId)
                        .includes(productData?.id) ? (
                        <Heart className=" fill-red-500 stroke-red-500" />
                      ) : (
                        <Heart />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {isClient && (
              <SweetAlert2
                customClass={{
                  popup:
                    " h-[90vh]  flex justify-center items-center !w-screen  !bg-transparent ",
                }}
                didClose={() => {
                  setSwalProps({
                    ...swalProps,
                    show: false,
                  });
                }}
                {...swalProps}
              >
                <div>
                  <Carousel>
                    <CarouselContent>
                      {imageToShow?.map((el: any, index: any) => (
                        <CarouselItem
                          key={index}
                          className=" flex w-full justify-center items-center"
                        >
                          <div className=" relative">
                            <Image
                              src={el}
                              width={300}
                              height={300}
                              alt=""
                              className="  w-full flex justify-center items-center object-contain lg:object-contain mx-auto my-auto lg:!h-[850px] !h-[500px]"
                            />
                            <Button
                              variant={"ghost"}
                              className=" absolute top-0 right-0"
                              onClick={() => {
                                setSwalProps({
                                  ...swalProps,
                                  show: false,
                                });
                              }}
                            >
                              <X />
                            </Button>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </SweetAlert2>
            )}

            <hr className=" my-8" />

            <HotDealAlert data={dealData} isLoading={isDealLoading} />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className=" hidden" ref={alertRef} variant="outline">
                Add to wishlist
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  Your wishlist is currently empty. Sign in or create an account
                  to save your wishlist across all your devices.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    handleLogin();
                    e.stopPropagation();
                  }}
                >
                  Sign in
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Container>
      )}
    </>
  );
};

export default ProductDetail;
