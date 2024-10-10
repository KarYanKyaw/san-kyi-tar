"use client";

import Container from "@/components/Container.components";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AddProductPage = () => {
  const app = useRouter();
  useEffect(() => {
    app.push("/pos/app/products/add-new-product-step/1");
  }, []);
  return;
};

export default AddProductPage;
