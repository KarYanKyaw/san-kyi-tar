"use client";

import React from "react";
import CartItem from "./CartItem";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Cart = ({ closeRef }: any) => {
  const { cartItems, orderRecord } = useAppProvider();

  const totalCost = orderRecord.reduce(
    (pv: any, cv: any) => pv + cv.quantity * cv.priceAfterDiscount,
    0
  );

  const router = useRouter();

  return (
    <div className=" space-y-3 bg-white pt-4 z-50 overflow-auto h-[90%] relative">
      {orderRecord.length == 0 ? (
        <p>Your Cart is empty!</p>
      ) : (
        <div className=" h-[70%] overflow-auto space-y-3">
          {orderRecord.map((data: any, index: number) => (
            <CartItem data={data} key={index} />
          ))}
        </div>
      )}
      <div className=" bg-white absolute bottom-0 w-full">
        <div className=" flex items-center bg-white pt-3 justify-between">
          <p>Total</p>
          <p>{new Intl.NumberFormat("ja-JP").format(totalCost)}</p>
        </div>
        <hr className=" my-3" />
        <div className=" space-y-1">
          <Button
            onClick={() => closeRef.current && closeRef.current.click()}
            className=" underline w-full text-center"
            variant={"link"}
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => router.push("/shopping-bag")}
            size={"sm"}
            disabled={orderRecord.length == 0}
            className=" w-full text-center"
          >
            Shopping Bag
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
