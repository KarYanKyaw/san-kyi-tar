"use client";

import {
  AddProductControlBar,
  EditProductControlBar,
} from "@/components/pos/products";
import React, { useEffect, useState } from "react";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import FormInput from "@/components/FormInput.components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { editProductFetch } from "@/lib/fetch";
import { Backend_URL } from "@/lib/api";

const EditProductPageFour = () => {
  const {
    editProductFormData,
    setEditProductFormData,
    setSwalProps,
    swalProps,
  } = useProductProvider();

  const [profitPercentage, setProfitPercentage] = useState({
    profitInPercent: 0,
    profitInDigit: 0,
  });

  const schema = z.object({
    stockPrice: z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(3, { message: "This field cannot be empty." }),

    salePrice: z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(3, { message: "This field cannot be empty." }),

    discountPrice: z.number().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      stockPrice: editProductFormData.stockPrice,
      salePrice: editProductFormData.salePrice,
      discountPrice: editProductFormData.discount,
    },
  });

  // Fetcher function to make API requests
  const putFetcher = async (url: string, { arg }: { arg: any }) => {
    return editProductFetch(url, arg);
  };

  const {
    data,
    error,
    isMutating,
    trigger: edit,
  } = useSWRMutation(
    `${Backend_URL}/products/${editProductFormData.id}`,
    putFetcher
  );

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("salePrice", data.salePrice);
    formData.append("stockPrice", data.stockPrice);
    formData.append("discountPrice", data.discountPrice);
    const res = await edit(formData);
    if (res.status) {
      setSwalProps({
        ...swalProps,
        show: true,
      });
    }
  };

  useEffect(() => {
    const stockPrice = watch("stockPrice");
    const salePrice = watch("salePrice");
    const discountPrice = watch("discountPrice") || 0;
    const effectiveSalePrice = salePrice * (1 - discountPrice / 100);

    if (salePrice < stockPrice) {
      setEditProductFormData((prevData) => ({
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

    if (salePrice > stockPrice) {
      if (effectiveSalePrice > stockPrice) {
        const profitValue = effectiveSalePrice - stockPrice;
        const percentage = (profitValue / stockPrice) * 100;
        setEditProductFormData((prevData) => ({
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
  }, [
    setEditProductFormData,
    watch("stockPrice"),
    watch("salePrice"),
    watch("discountPrice"),
  ]);

  return (
    <div className="space-y-4">
      <EditProductControlBar run={handleSubmit(onSubmit)} />
      {error && <p className=" text-red-500 text-sm">{error.message}</p>}
      <div className="space-y-5 w-1/2">
        <div className="space-y-1">
          <FormInput
            min={0}
            type="number"
            id="original"
            label="Original Price"
            {...register("stockPrice", { valueAsNumber: true })}
          />
          {errors.stockPrice && (
            <p className=" text-red-500 text-sm">{errors.stockPrice.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <FormInput
            type="number"
            id="sale"
            label="Sale Price"
            {...register("salePrice", { valueAsNumber: true })}
          />
          {errors.salePrice && (
            <p className=" text-red-500 text-sm">{errors.salePrice.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <FormInput
            type="number"
            min={0}
            id="discountPrice"
            label="Discount"
            {...register("discountPrice", { valueAsNumber: true })}
          />
          {errors.discountPrice && <p>{errors.discountPrice.message}</p>}
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

export default EditProductPageFour;
