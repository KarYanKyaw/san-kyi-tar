"use client";
import React from "react";
import { ProductProvider } from "./Provider/ProductProvider";

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
  return <ProductProvider>{children}</ProductProvider>;
};

export default ProductLayout;
