"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { Tag } from "lucide-react";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import useSWR from "swr";

const OrderSummary = ({
  cost,
  run,
  buttonName,
  disabled,
}: {
  cost: number;
  run: () => void;
  buttonName: string;
  disabled: boolean;
}) => {
  const {
    cartItems,
    couponCode,
    setCouponCode,
    inputValue,
    setInputValue,
    validCoupon,
    setValidCoupon,
    couponDiscount,
    setCouponDiscount,
    error,
    setError,
    orderRecord,
  } = useAppProvider();

  const getData = (url: string) => getFetchForEcom(url);

  const { data, error: fetchError } = useSWR(
    couponCode !== "" ? `${Backend_URL}/coupon/${couponCode}` : null,
    getData,
    {
      onSuccess: (data) => {
        if (data) {
          setValidCoupon(true);
          setCouponDiscount(data.discount);
          setError("");
        } else {
          setError("Invalid coupon code.");
          setValidCoupon(false);
          setCouponDiscount(0);
        }
      },
    }
  );

  useEffect(() => {
    if (fetchError) {
      setError("Invalid Coupon");
      setValidCoupon(false);
      setCouponDiscount(0);
    }
  }, [fetchError]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue !== "") {
      setCouponCode(inputValue);
    }
  };

  const totalCost = orderRecord.reduce(
    (pv: any, cv: any) => pv + cv.quantity * cv.priceAfterDiscount,
    0
  );

  return (
    <div className="lg:border-2 lg:border-input lg:p-5 lg:bg-secondary">
      <p className="text-lg font-semibold mb-6">Order Summary</p>
      <div className="text-sm space-y-4">
        {orderRecord?.length === 0 ? (
          <div className="flex justify-between">
            <p>Price</p>
            <p>0</p>
          </div>
        ) : (
          orderRecord?.map(
            (
              {
                name,
                priceAfterDiscount,
                selectedProduct,
                productSizing,
                quantity,
              }: any,
              index: number
            ) => (
              <div key={index} className="flex justify-between">
                <p>
                  {name} ({productSizing}) x {quantity}
                </p>
                <p>
                  {new Intl.NumberFormat("ja-JP").format(
                    quantity * priceAfterDiscount
                  )}
                </p>
              </div>
            )
          )
        )}
        <div className="flex justify-between">
          <p>Coupon Applied</p>
          <i>{validCoupon ? couponCode : "-"}</i>
        </div>
        <div className="flex justify-between">
          <p>Coupon Discount</p>
          <p>{validCoupon ? `${couponDiscount}%` : "-"}</p>
        </div>
        <hr className="border-1.5" />
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{new Intl.NumberFormat("ja-JP").format(totalCost)}</p>
        </div>
        <div className="flex justify-between">
          <p>Delivery</p>
          <p>Free</p>
        </div>
        <form onSubmit={handleApplyCoupon}>
          <div className="flex border items-center px-3">
            <Tag />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border-none h-9 bg-transparent rounded-none focus:outline-none focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Coupon Code"
              disabled={validCoupon}
            />
            <Button
              size={"sm"}
              className="h-6 uppercase text-xs bg-neutral-500"
              disabled={validCoupon || inputValue === ""}
            >
              Apply
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <hr className="border-1.5" />
        <div className="flex justify-between">
          <p>Estimated Total</p>
          <p>{new Intl.NumberFormat("ja-JP").format(totalCost)}</p>
        </div>
        <Button
          disabled={disabled}
          onClick={() => run()}
          className="w-full lg:text-[16px] uppercase"
        >
          {buttonName}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
