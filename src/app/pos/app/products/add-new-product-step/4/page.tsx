"use client";

import { AddProductControlBar } from "@/components/pos/products";
import React, { useEffect, useState } from "react";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import FormInput from "@/components/FormInput.components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const AddProductPageFour = () => {
  const {
    navigateForward,
    navigateBackward,
    addProductFormData,
    setAddProductFormData,
  } = useProductProvider();

  const [profitPercentage, setProfitPercentage] = useState({
    profitInPercent: 0,
    profitInDigit: 0,
  });

  const schema = z.object({
    stock_price:
      typeof window !== "undefined"
        ? z
            .number({
              required_error: "This field cannot be empty!",
            })
            .min(3, { message: "This field cannot be empty." })
        : z.any(),

    sale_price:
      typeof window !== "undefined"
        ? z
            .number({
              required_error: "This field cannot be empty!",
            })
            .min(3, { message: "This field cannot be empty." })
        : z.any(),

    discount: typeof window !== "undefined" ? z.number().optional() : z.any(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      stock_price: addProductFormData.stock_price,
      sale_price: addProductFormData.sale_price,
      discount: addProductFormData.discount,
    },
  });

  const onSubmit = (data: any) => {
    setAddProductFormData({
      ...addProductFormData,
      ...data,
    });
    navigateForward(5);
  };

  useEffect(() => {
    if (watch("sale_price") < watch("stock_price")) {
      setAddProductFormData((prevData) => ({
        ...prevData,
        profitInPercent: 0,
        profitInDigit: 0,
      }));
      setProfitPercentage({
        profitInPercent: 0,
        profitInDigit: 0,
      });
      return;
    }
    if (watch("sale_price") > watch("stock_price")) {
      const stockPrice = watch("stock_price");
      const salePrice = watch("sale_price");
      const discount = watch("discount") || 0;

      const effectiveSalePrice = salePrice * (1 - discount / 100);

      if (effectiveSalePrice > stockPrice) {
        const profitValue = effectiveSalePrice - stockPrice;
        const percentage = (profitValue / stockPrice) * 100;
        setAddProductFormData((prevData) => ({
          ...prevData,
          profitInPercent: parseInt(percentage.toFixed(0)),
          profitInDigit: parseInt(profitValue.toFixed(0)),
        }));
        setProfitPercentage({
          profitInPercent: parseInt(percentage.toFixed(0)),
          profitInDigit: parseInt(profitValue.toFixed(0)),
        });
      } else {
        setProfitPercentage({
          profitInPercent: 0,
          profitInDigit: 0,
        });
      }
    }
  }, [watch("stock_price"), watch("sale_price"), watch("discount")]);
  return (
    <div className="space-y-4">
      <AddProductControlBar
        goBackward={navigateBackward}
        goForward={handleSubmit(onSubmit)}
      />
      <div className="space-y-5 w-1/2">
        <div className="space-y-1">
          <FormInput
            min={0}
            type="number"
            id="original"
            label="Original Price"
            {...register("stock_price", { valueAsNumber: true })}
          />
          {errors.stock_price && (
            <p className=" text-red-500 text-sm">
              {errors.stock_price.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <FormInput
            type="number"
            id="sale"
            label="Sale Price"
            {...register("sale_price", { valueAsNumber: true })}
          />
          {errors.sale_price && (
            <p className=" text-red-500 text-sm">{errors.sale_price.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <FormInput
            type="number"
            min={0}
            id="discount"
            label="Discount"
            {...register("discount", { valueAsNumber: true })}
          />
          {errors.discount && <p>{errors.discount.message}</p>}
        </div>
        <div className="flex">
          <div className="text-end border border-input basis-1/2 bg-white rounded-r-none p-3 rounded">
            <p className="text-sm me-2 text-primary/60">Percentage</p>
            <p className="text-xl me-2">
              {profitPercentage.profitInPercent || 0}%
            </p>
          </div>
          <div className="text-end border border-input basis-1/2 rounded-s-none border-s-0 bg-white p-3 rounded">
            <p className="text-sm text-primary/60">Profit Value</p>
            <p className="text-xl">{profitPercentage.profitInDigit || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPageFour;
