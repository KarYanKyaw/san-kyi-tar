"use client";
import Container from "@/components/Container.components";
import React, { useEffect, useState } from "react";
import { useProductProvider } from "../Provider/ProductProvider";
import Link from "next/link";
import SweetAlert2 from "react-sweetalert2";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import NavHeader from "@/components/pos/NavHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { editProductStages, swalProps, setSwalProps } = useProductProvider();
  const router = useRouter();

  const [countdown, setCountdown] = useState(4);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (swalProps.show) {
      timer = setInterval(() => {
        setCountdown((prevCount) =>
          prevCount > 0 ? prevCount - 1 : prevCount
        );
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
      setCountdown(4);
    };
  }, [swalProps.show]);

  useEffect(() => {
    if (countdown == 0) {
      (async () => {
        await setSwalProps({
          ...swalProps,
          show: false,
        });
        await router.push("/pos/app/products");
        await setCountdown(8);
      })();
    }
  }, [countdown]);

  return (
    <Container>
      <NavHeader
        parentPage="Products"
        path="Product List"
        currentPage="Edit Product"
      />
      <div className=" space-y-4">
        <Container>
          <div className=" grid grid-cols-12 ">
            <div className=" col-span-3">
              {editProductStages.map(
                ({ id, title, icon, path, active }, index) => (
                  <div
                    key={id}
                    className=" flex justify-center items-start flex-col gap-2.5"
                  >
                    <Link href={path} className={` flex gap-2 items-center`}>
                      <span
                        className={`border-dashed  ${
                          active && " bg-primary"
                        } duration-200 circle p-1.5 border-2  rounded-full border-primary inline-block`}
                      >
                        {icon}
                      </span>
                      <span className=" font-normal text-sm capitalize">
                        {title}
                      </span>
                    </Link>
                    <>
                      {index !== editProductStages.length - 1 && (
                        <div className=" border h-12 ms-[1.12rem] w-0 mb-2.5 border-dashed border-primary"></div>
                      )}
                    </>
                  </div>
                )
              )}
            </div>
            <div className=" col-span-9">{children}</div>
          </div>
        </Container>
      </div>

      {isClient && (
        <SweetAlert2
          timer={countdown * 1000}
          iconColor="black"
          icon="success"
          {...swalProps}
        >
          <p className="text-xl font-bold pb-1 text-black">
            Product Edit Success!
          </p>
          <p className="text-xs pb-1 font-medium text-black/80">
            Are you done editing product?
          </p>
          <p className="text-xs pb-3 font-light">
            Redirect to Product Page in {countdown}
          </p>
          <div className=" flex gap-3 justify-center ">
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                setCountdown(0);
                setSwalProps({
                  ...swalProps,
                  show: false,
                });
                router.push("/pos/app/products");
              }}
            >
              Go To Home Now
            </Button>
            <Button
              size={"sm"}
              onClick={() => {
                setSwalProps({
                  ...swalProps,
                  show: false,
                });
              }}
            >
              Continue Edit
            </Button>
          </div>
        </SweetAlert2>
      )}
    </Container>
  );
};

export default Layout;
