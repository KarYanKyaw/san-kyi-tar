"use client";

import FormInput from "@/components/FormInput.components";
import { EditProductControlBar } from "@/components/pos/products";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Backend_URL, editProductFetch } from "@/lib/fetch";
import useSWRMutation from "swr/mutation";

const EditProductPageOne = () => {
  const {
    editProductFormData,
    setEditProductFormData,
    swalProps,
    setSwalProps,
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
      name: editProductFormData.name,
      productCode: editProductFormData.productCode,
      description: editProductFormData.description,
      addTo: editProductFormData.addTo,
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

  const onSubmit = async (data: FormData) => {
    setEditProductFormData({
      ...editProductFormData,
      ...data,
    });

    const editedData = {
      isEcommerce: data.addTo.eCommerce ? 1 : 0,
      isPos: data.addTo.pos ? 1 : 0,
      name: data.name,
      productCode: data.productCode,
      description: data.description,
    };

    const formData = new FormData();

    formData.append("name", editedData.name);
    formData.append("productCode", editedData.productCode);
    formData.append("description", editedData.description || "");
    formData.append("isEcommerce", editedData.isEcommerce.toString());
    formData.append("isPos", editedData.isPos.toString());

    const res = await edit(formData);
    if (res.status) {
      setSwalProps({
        ...swalProps,
        show: true,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <EditProductControlBar run={handleSubmit(onSubmit)} />
        <hr className=" py-1" />
      </div>
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
                checked={editProductFormData.addTo.eCommerce}
                onCheckedChange={(isChecked) => {
                  setValue("addTo.eCommerce", isChecked);
                  setEditProductFormData((prev) => ({
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
                checked={editProductFormData.addTo.pos}
                onCheckedChange={(isChecked) => {
                  setValue("addTo.pos", isChecked);
                  setEditProductFormData((prev) => ({
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

export default EditProductPageOne;
