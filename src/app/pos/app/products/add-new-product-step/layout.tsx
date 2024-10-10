"use client";
import Container from "@/components/Container.components";
import React from "react";
import { useProductProvider } from "../Provider/ProductProvider";
import Link from "next/link";
import NavHeader from "@/components/pos/NavHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { addProductStages } = useProductProvider();

  return (
    <Container>
      <div className=" space-y-8">
        <NavHeader
          parentPage="Products"
          path="Product List"
          currentPage="Add Product"
        />
        <Container>
          <div className=" grid grid-cols-12">
            <div className=" col-span-3">
              {addProductStages.map(({ id, title, icon, path, active }) => (
                <div
                  key={id}
                  className=" flex justify-center items-start flex-col gap-2.5"
                >
                  <Link
                    href={path}
                    className={` flex gap-2 items-center ${
                      !active && "pointer-events-none"
                    }`}
                  >
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
                    {title !== "confirmation" && (
                      <div className=" border h-12 ms-[1.12rem] w-0 mb-2.5 border-dashed border-primary"></div>
                    )}
                  </>
                </div>
              ))}
            </div>
            <div className=" col-span-9">{children}</div>
          </div>
        </Container>
      </div>
    </Container>
  );
};

export default Layout;
