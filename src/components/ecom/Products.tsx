"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

interface ProductType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId: number | null;
  updatedByUserId: number | null;
  isArchived: boolean | null;
}

interface Product {
  id: number;
  name: string;
  gender: "MEN" | "WOMEN" | "UNISEX";
  salePrice: number;
  productBrand: string;
  productType: ProductType;
  medias: any;
  discountPrice?: number;
  productCode: any;
  productVariants: boolean;
}

const Products = ({
  data,
  isLoading,
}: {
  data: Product[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  return (
    <div className=" space-y-3">
      <>
        {isLoading ? (
          <div className=" grid grid-cols-2 gap-x-5 gap-y-24 lg:grid-cols-4">
            <ProductSkeleton />
          </div>
        ) : (
          <div className=" grid grid-cols-2 gap-x-[20px] gap-y-[45px] lg:grid-cols-4">
            {data.length == 0 ? (
              <div className=" h-[500px] text-sm text-red-500 col-span-full text-center">
                Thank you for your interest. Unfortunately, this product is
                currently unavailable
              </div>
            ) : (
              <>
                {data.map(
                  ({
                    name,
                    gender,
                    productBrand,
                    salePrice,
                    id,
                    medias,
                    productCode,
                    discountPrice,
                    productVariants,
                  }) => (
                    <ProductCard
                      id={id}
                      key={id}
                      name={name}
                      productBrand={productBrand}
                      salePrice={salePrice}
                      medias={medias}
                      discountPrice={discountPrice}
                      productCode={productCode}
                      productVariants={productVariants}
                    />
                  )
                )}
              </>
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default Products;
