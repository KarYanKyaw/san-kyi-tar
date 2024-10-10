"use client";
import { Container } from "@/components/ecom";
import AppLayout from "@/components/ecom/AppLayout";
import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SweetAlert2 from "react-sweetalert2";
import { useAppProvider } from "../Provider/AppProvider";

const Layout = ({ children }: any) => {
  const pathName = usePathname();
  const { handleLogin } = useAppProvider();
  const router = useRouter();

  return (
    <AppLayout>
      <Container>
        <p className=" pt-12 text-sm lg:text-sm pb-12 font-normal">
          Profile | My account
        </p>
        <div className=" grid grid-cols-12 gap-8">
          <div className=" col-span-full lg:col-span-2">
            <div className=" flex lg:flex-col items-center lg:justify-normal lg:items-start gap-1.5">
              <span
                onClick={() => router.push("/profile/information")}
                className={` ${
                  pathName.includes("information") && "font-semibold"
                } cursor-pointer lg:text-base text-xs lg:w-40 uppercase`}
              >
                Personal info
              </span>
              <span
                onClick={() => router.push("/profile/orders")}
                className={` ${
                  pathName.includes("orders") && "font-semibold"
                } cursor-pointer lg:text-base text-xs lg:w-40 uppercase`}
              >
                orders
              </span>
              <span
                onClick={() => router.push("/profile/address")}
                className={` ${
                  pathName.includes("address") && "font-semibold"
                } cursor-pointer lg:text-base text-xs lg:w-40 uppercase`}
              >
                address
              </span>
            </div>
          </div>
          <div className=" col-span-full lg:col-span-10">{children}</div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default Layout;
