import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import ProductVariableTable from "./ProductVariantTable";
import { CaretUpIcon } from "@radix-ui/react-icons";
import Image from "next/image";

type ProductDetailBoxTypes = {
  data: { [key: string]: any };
  handleClose: () => void;
  isLoading: Boolean;
};
const ProductDetailBox = ({
  data,
  handleClose,
  isLoading,
}: ProductDetailBoxTypes) => {
  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {data && (
            <div className=" grid grid-cols-12 h-full gap-5 product">
              <div className=" col-span-3">
                <div className=" md:h-[600px] xl:h-[900px] space-y-2 overflow-scroll">
                  {data.medias.map(
                    ({ id, url }: { id: number; url: string }) => (
                      <Image
                        alt=""
                        src={url}
                        key={id}
                        width={300}
                        height={300}
                      />
                    )
                  )}
                </div>
              </div>

              <div className=" col-span-9">
                <div className=" space-y-3">
                  {/* header */}
                  <div className=" flex justify-between">
                    <div className="">
                      <p className=" text-start text-black capitalize text-3xl font-bold">
                        {data.name}
                      </p>
                      <p className=" text-sm text-black/70 text-start">
                        {data.description}
                      </p>
                    </div>

                    <Button
                      variant={"ghost"}
                      className=" cursor-pointer"
                      onClick={handleClose}
                    >
                      <X />
                    </Button>
                  </div>

                  <div className=" !h-[740px] overflow-scroll space-y-3">
                    <p className=" text-black/80 text-start underline text-base">
                      Product Variant
                    </p>
                    {/* properties */}
                    <div className=" flex justify-start gap-1">
                      <Badge
                        className={" text-primary/60 !bg-input"}
                        variant={"secondary"}
                      >
                        <span>Brand :</span>
                        <span className=" text-primary/80 ms-1 text-xs capitalize">
                          {data.productBrand.name}
                        </span>
                      </Badge>

                      <Badge
                        className={" text-primary/60 !bg-input"}
                        variant={"secondary"}
                      >
                        <div className="flex">
                          <span>Gender:</span>
                          <span className=" text-primary/80 ms-1 text-xs capitalize">
                            {data.gender}
                          </span>
                        </div>
                      </Badge>

                      <Badge
                        className={" text-primary/60 !bg-input"}
                        variant={"secondary"}
                      >
                        <span> Type :</span>
                        <span className=" text-primary/80 ms-1 text-xs capitalize">
                          {data.productType.name}
                        </span>
                      </Badge>

                      <Badge
                        className={" text-primary/60 !bg-input"}
                        variant={"secondary"}
                      >
                        <span> Category :</span>
                        <span className=" text-primary/80 ms-1 text-xs capitalize">
                          {data.productCategory.name}
                        </span>
                      </Badge>

                      <Badge
                        className={" text-primary/60 !bg-input"}
                        variant={"secondary"}
                      >
                        <span>Fitting :</span>
                        <span className=" text-primary/80 ms-1 text-xs capitalize">
                          {data.productFitting.name}
                        </span>
                      </Badge>
                    </div>

                    {/* sale values */}
                    <div className=" grid grid-cols-12">
                      <div className="text-end col-span-2 bg-white rounded-r-none  p-3 rounded-s rounded border border-input">
                        <p className=" text-sm me-2 text-primary/60">
                          Sale Price
                        </p>
                        <p className="text-xl text-black me-2">
                          {new Intl.NumberFormat("ja-JP").format(
                            data.salePrice
                          )}
                        </p>
                      </div>
                      <div className="text-end col-span-2 rounded-s-none border-s-0 rounded-r-none bg-white  p-3 rounded border border-input">
                        <p className=" text-sm text-primary/60">Base Price</p>
                        <p className="text-xl text-black">
                          {new Intl.NumberFormat("ja-JP").format(
                            data.stockPrice
                          )}
                        </p>
                      </div>
                      <div className="text-end col-span-2 rounded-s-none border-s-0 rounded-r-none bg-white  p-3 rounded border border-input">
                        <p className=" text-sm text-primary/60">Percentage</p>
                        <p className="text-xl text-black">
                          {new Intl.NumberFormat("ja-JP").format(
                            data.percentage
                          )}
                        </p>
                      </div>
                      <div className="text-end col-span-2 rounded-s-none border-s-0  bg-white  p-3 rounded border border-input">
                        <p className=" text-sm text-primary/60">Profit Value</p>
                        <p className="text-xl text-black">
                          {new Intl.NumberFormat("ja-JP").format(
                            data.profitValue
                          )}
                        </p>
                      </div>
                    </div>

                    {/* variant table */}
                    <ProductVariableTable variant={data.productVariants} />
                    <div>
                      {/* variant overview */}
                      <div className=" grid  grid-cols-12">
                        <div className="text-end col-span-3 bg-white rounded-r-none  p-3 rounded-s rounded border border-input">
                          <p className=" text-sm me-2 text-primary/60">
                            Total Color
                          </p>
                          <p className="text-xl text-black me-2">
                            {data.totalColor}
                          </p>
                        </div>
                        <div className="text-end col-span-3 rounded-s-none border-s-0 rounded-r-none bg-white  p-3 rounded border border-input">
                          <p className=" text-sm text-primary/60">Size</p>
                          <p className="text-xl text-black">
                            {data.totalSize.map((el: any, index: any) => (
                              <React.Fragment key={index}>
                                {el}
                                {index !== data.totalSize.length - 1 && ", "}
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                        <div className="text-end col-span-3 rounded-s-none border-s-0  bg-white  p-3 rounded border border-input">
                          <p className=" text-sm text-primary/60">Available</p>
                          <p className="text-xl text-black">
                            {data.productVariants.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* control */}
                  <div className=" flex select-none gap-3 justify-end">
                    <Button onClick={handleClose}>Done</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductDetailBox;
