"use client";

import React, { useEffect, useRef, useState } from "react";
import { Backend_URL, getFetch } from "@/lib/fetch";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import Voucher from "@/components/pos/sale/Voucher";

const VoucherPage = ({ params }: { params: { id: string } }) => {
  const getData = (url: string) => {
    return getFetch(url);
  };

  const [isClient, setIsClient] = useState(false);

  const { data, isLoading } = useSWR(
    `${Backend_URL}/vouchers/${params.id}`,
    getData
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const print = () => {
    if (isClient) {
      if (printRef.current) {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = `<div class="printable">${printContents}</div>`;
        window.print();
        document.body.innerHTML = originalContents;
      }
    }
  };
  console.log(data);
  return (
    <Container>
      <NavHeader path="Voucher" parentPage="Voucher" />
      <div className=" flex gap-4 flex-col items-center">
        {!isLoading && (
          <div ref={printRef}>
            <Voucher
              fromLocal={true}
              data={data.voucherRecords}
              subTotal={data.subTotal}
              total={data.total}
              tax={data.tax > 0}
              voucherCode={data.voucherCode}
              discountByValue={data.discountByValue}
              discount={data.discount}
              loyaltyDiscount={data.royaltyDiscount || data?.promotionRate}
              customerInfoData={{
                name: data.customerName,
                phone: data.phone || data.phoneNumber,
              }}
              paymentType={data?.paymentMethod}
              time={data.time}
              date={data.date}
              salePerson={data?.salePerson}
            />
          </div>
        )}

        <div className=" flex w-full justify-center me-12 pe-1 gap-4 ">
          <Button
            className=" w-[300px]"
            variant={"outline"}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button className=" w-[300px]" onClick={() => print()}>
            Print
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default VoucherPage;
