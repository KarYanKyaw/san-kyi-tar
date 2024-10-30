import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

const CartItem = ({ data }: any) => {
  const { removeFromCart } = useAppProvider();

  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/products/wishlist/${data?.productId}`);
      }}
      className=" cursor-pointer"
    >
      <div className=" grid grid-cols-3 gap-4">
        <div className=" col-span-1">
          <div className=" relative">
            <Image
              src={data?.photo}
              width={300}
              className=" h-[100px] lg:h-[150px] w-[150px] object-cover"
              height={300}
              alt=""
            />
            <Button
              onClick={(e) => {
                removeFromCart(data.itemId);
                e.stopPropagation();
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
                {data?.name} x {data?.quantity}
              </p>
              <span>-</span>
              <div className=" flex gap-3 items-center">
                <div
                  style={{
                    backgroundImage: `url(${data.photo})`,
                  }}
                  className="lg:w-7 lg:h-7 h-4 bg-red-900 w-4 rounded-full bg-cover bg-center"
                ></div>
                <p className=" text-xs text-primary/60 lg:text-sm font-normal">
                  {data.productSizing}
                </p>
              </div>
            </div>
            {(data.discount as number) > 0 ? (
              <div className=" space-y-1 text-xs lg:text-sm">
                <Badge className=" text-black font-normal h-4 text-xs bg-neutral-300">
                  {data.discount}%
                </Badge>

                <div className="lg:flex gap-2 items-center">
                  <p className=" line-through">
                    {new Intl.NumberFormat("ja-JP").format(
                      data.quantity * data.salePrice
                    )}{" "}
                    MMK
                  </p>
                  <p className="text-xs lg:text-sm">
                    {new Intl.NumberFormat("ja-JP").format(
                      data?.quantity * data.priceAfterDiscount
                    )}
                    MMK
                  </p>
                </div>
              </div>
            ) : (
              <p className=" text-xs lg:text-sm">
                {new Intl.NumberFormat("ja-JP").format(
                  data?.quantity * data.salePrice
                )}{" "}
                MMK
              </p>
            )}
          </div>
        </div>
      </div>
      <hr className=" my-2" />
    </div>
  );
};

export default CartItem;
