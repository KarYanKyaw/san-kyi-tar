import React, { useEffect, useState } from "react";

import Voucher from "./Voucher";
import { Backend_URL, postFetch } from "@/lib/fetch";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import SweetAlert2 from "react-sweetalert2";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Product {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  discountByValue: number;
  cost: number;
  productCategory: string;
  productFitting: string;
  productType: string;
  gender: string;
  productSizing: string;
}

interface Voucher {
  voucher_code: string;
  customerId?: any;
  type: any;
  discount?: number;
  discountByValue?: number;
  subTotal: number;
  total: number;
  paymentMethod: any;
  voucherRecord: {
    product_variant_id: number;
    quantity: number;
    sale_price: number;
    discount: number;
    discountByValue?: number;
  }[];
  tax?: number;
  paymentType: string;
}

const SaleInfoBox = ({
  data,
  setData,
  discountByValue,
  loyaltyDiscount,
  paymentInfo,
  setPaymentInfo,
  customerInfoData,
  setCustomerPromotion,
  discount,
  paymentType,
  salePerson,
}: {
  data: Product[];
  setData: React.Dispatch<React.SetStateAction<Product[]>>;
  discountByValue: number;
  loyaltyDiscount: number | undefined;
  paymentInfo: any;
  setPaymentInfo: any;
  customerInfoData: any;
  setCustomerPromotion: any;
  discount: any;
  paymentType: string;
  salePerson: string;
}) => {
  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
    allowOutsideClick: true,
  });

  const [change, setChange] = useState(0);
  const [chargeValue, setChargeValue] = useState<number>(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calculate total cost without any discounts
    const totalCostWithoutDiscounts = data.reduce((pv, cv) => pv + cv.cost, 0);

    // Apply percentage-based discount (if any)
    let totalCostAfterDiscountByValue = totalCostWithoutDiscounts;
    if (discount > 0) {
      const discountAmount = (discount / 100) * totalCostWithoutDiscounts;
      totalCostAfterDiscountByValue -= discountAmount;
    }

    // Apply discountByValue (if any)
    if (discountByValue > 0) {
      totalCostAfterDiscountByValue -= discountByValue;
    }

    // Apply loyalty discount (if any)
    const loyaltyDiscountValue = loyaltyDiscount ?? 0;
    const loyaltyDiscountAmount =
      (loyaltyDiscountValue / 100) * totalCostAfterDiscountByValue;

    // Final total after all discounts
    const totalCostAfterDiscounts =
      totalCostAfterDiscountByValue - loyaltyDiscountAmount;

    // Set the total and ensure it's properly rounded
    setTotal(Number(totalCostAfterDiscounts.toFixed(0)));

    // Calculate change if charge is higher than total
    const newChange =
      chargeValue > totalCostAfterDiscounts
        ? parseFloat((chargeValue - totalCostAfterDiscounts).toFixed(0))
        : 0;

    setChange(newChange);
  }, [
    data,
    chargeValue,
    discountByValue,
    loyaltyDiscount,
    paymentInfo.tax,
    discount,
  ]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const router = useRouter();

  const generateLongNumber = (length: number) => {
    let number = "";
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return parseInt(number);
  };

  const [voucherCode, setVoucherCode] = useState<number | undefined>();

  useEffect(() => {
    setVoucherCode(generateLongNumber(7));
  }, []);

  // Fetcher function to make API requests
  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postFetch(url, arg);
  };

  const {
    isMutating,
    trigger: sell,
    error,
  } = useSWRMutation(`${Backend_URL}/vouchers`, postFetcher);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      paymentInfo.type === "" ||
      paymentInfo.paymentMethod === "" ||
      data.length === 0
    ) {
      return;
    } else {
      const voucher = {
        voucherCode: `${voucherCode}`,
        type: paymentInfo.type.toUpperCase(),
        subTotal: data.reduce((pv, cv) => pv + cv.cost, 0),
        total,
        paymentMethod: paymentInfo.payment_method.toUpperCase(),
        voucherRecords: data.map(
          ({ id, quantity, discountByValue, price, cost, discount }) => ({
            productVariantId: id,
            quantity,
            salePrice: price,
            discount: discount,
            cost: Number(cost.toFixed(0)),
            discountByValue: discountByValue,
          })
        ),
      } as any;

      if (paymentInfo.tax) {
        (voucher as any).tax = 5;
      }

      if (paymentInfo.customer.amount > 0) {
        (voucher as any).customerId = paymentInfo.customer.customerId;
      }

      if (paymentInfo.discountByValue > 0) {
        (voucher as any).discountByValue = paymentInfo.discountByValue;
      }

      if (paymentInfo.discount > 0) {
        (voucher as any).discount = paymentInfo.discount;
      }

      const res = await sell(voucher);

      if (res.status) {
        setData([]);
        setPaymentInfo({
          customer: {
            customerId: "",
            amount: 0,
          },
          type: "offline",
          payment_method: "cash",
          discountByValue: 0,
          tax: false,
        });
        setCustomerPromotion(undefined);
        router.push(`/pos/app/sale/voucher/${res.data.id}`);
        setVoucherCode(generateLongNumber(7));
      }
    }
  };

  return (
    <>
      {error && <p className=" text-red-500">{error.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div className="flex justify-between basis-4/12 items-end rounded-e-none bg-white p-3 rounded border border-primary">
            <Button
              disabled={data.length === 0}
              onClick={() =>
                setSwalProps({
                  ...swalProps,
                  show: true,
                })
              }
              type="button"
              className="self-end"
              variant="outline"
            >
              View Voucher
            </Button>
            <div className="text-end">
              <div className="flex items-center justify-end gap-2">
                <p className="text-sm text-primary/60">Total</p>
              </div>
              <p className="text-2xl">
                {new Intl.NumberFormat("ja-JP").format(total)}
              </p>
            </div>
          </div>
          <div className="text-end basis-8/12 rounded-s-none border-s-0 rounded-r bg-white p-3 rounded border border-primary">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5 basis-1/3">
                <Label htmlFor="charge" className="text-sm">
                  Total Charges
                </Label>
                <Input
                  id="charge"
                  type="number"
                  value={chargeValue}
                  onChange={(e) => setChargeValue(parseInt(e.target.value))}
                  className="text-end h-8"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm text-primary/70">Change</p>
                <p className="text-xl">{change}</p>
              </div>
              <div className="basis-1/3 self-end">
                <Button disabled={isMutating} className="select-none w-full">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {isClient && (
        <SweetAlert2
          customClass={{
            popup: " !w-auto !h-auto ",
          }}
          didClose={() =>
            setSwalProps({
              ...swalProps,
              show: false,
            })
          }
          {...swalProps}
        >
          <Voucher
            data={data}
            discount={paymentInfo.discount}
            subTotal={data.reduce((pv, cv) => pv + cv.cost, 0)}
            total={total}
            tax={paymentInfo.tax}
            voucherCode={voucherCode}
            discountByValue={paymentInfo.discountByValue}
            loyaltyDiscount={loyaltyDiscount}
            customerInfoData={customerInfoData}
            paymentType={paymentType}
            salePerson={salePerson}
          />
        </SweetAlert2>
      )}
    </>
  );
};

export default SaleInfoBox;
