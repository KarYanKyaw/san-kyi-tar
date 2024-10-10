"use client";

import FormInput from "@/components/FormInput.components";
import { AddProductControlBar } from "@/components/pos/products";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const AddProductPageOne = () => {
  const {
    navigateForward,
    navigateBackward,
    addProductFormData,
    setAddProductFormData,
  } = useProductProvider();

  const schema = z.object({
    name: z.string().min(3, { message: "This field cannot be empty!" }),
    productCode: z.string().min(3, { message: "This field cannot be empty!" }),
    description: z.string().optional(),
    addTo: z
      .object({
        eCommerce: z.boolean(),
        pos: z.boolean(),
      })
      .refine(
        (value) => {
          return Object.values(value).some((i) => i === true);
        },
        { message: "At least one option must be selected!" }
      ),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: addProductFormData.name,
      productCode: addProductFormData.productCode,
      description: addProductFormData.description,
      addTo: addProductFormData.addTo,
    },
  });

  const onSubmit = (data: FormData) => {
    setAddProductFormData({
      ...addProductFormData,
      ...data,
    });
    navigateForward(2);
  };

  return (
    <div className="space-y-4">
      <AddProductControlBar
        goBackward={navigateBackward}
        goForward={handleSubmit(onSubmit)}
      />

      <div className=" w-3/4 space-y-4">
        {/* Multiple toggle switches */}
        <div className="space-y-1.5">
          <Label>Product For</Label>
          <div className="bg-white border p-4 rounded-lg">
            <div className="flex justify-between pb-4 items-center">
              <div>
                <Label className="mb-1">E-commerce</Label>
                <p className="text-sm text-primary/60">
                  This product Information is updated on E-commerce Website
                </p>
              </div>
              <Switch
                id="e-commerce"
                checked={addProductFormData.addTo.eCommerce}
                onCheckedChange={(isChecked) => {
                  setValue("addTo.eCommerce", isChecked);
                  setAddProductFormData((prev) => ({
                    ...prev,
                    addTo: {
                      ...prev.addTo,
                      eCommerce: isChecked,
                    },
                  }));
                }}
              />
            </div>
            <hr />
            <div className="flex justify-between pt-4 items-center">
              <div>
                <Label className="mb-1">POS</Label>
                <p className="text-sm text-primary/60">
                  This product Information is updated on point of sale
                </p>
              </div>
              <Switch
                id="pos"
                checked={addProductFormData.addTo.pos}
                onCheckedChange={(isChecked) => {
                  setValue("addTo.pos", isChecked);
                  setAddProductFormData((prev) => ({
                    ...prev,
                    addTo: {
                      ...prev.addTo,
                      pos: isChecked,
                    },
                  }));
                }}
              />
            </div>
          </div>
          {errors.addTo && (
            <p className="text-red-500 text-sm">{errors.addTo.message}</p>
          )}
        </div>

        {/* Product name */}
        <div className=" grid gap-4 grid-cols-2">
          <div className=" space-y-1.5">
            <FormInput
              label="Product Name"
              id="name"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className=" space-y-1.5">
            <FormInput
              label="Product Code"
              id="product_code"
              type="text"
              {...register("productCode")}
            />
            {errors.productCode && (
              <p className="text-red-500 text-sm">
                {errors.productCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Product description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Product Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Please include all information relevant to your issue."
            rows={6}
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default AddProductPageOne;
