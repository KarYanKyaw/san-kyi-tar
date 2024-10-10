import React, { useEffect, useState } from "react";
import FormInput from "@/components/FormInput.components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Backend_URL } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { postMediaFetch, putMediaFetch } from "@/lib/fetch";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type FormProps = {
  closeRef: any;
  editId: any;
  inputValue: string;
  resetValue: () => void;
  refetch: () => void;
  brandImageToShow: any;
  setBrandImageToShow: any;
};

const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const MAX_FILE_SIZE = 1000000000;

const BrandForm: React.FC<FormProps> = ({
  closeRef,
  editId,
  inputValue,
  resetValue,
  refetch,
  brandImageToShow,
  setBrandImageToShow,
}) => {
  // schema
  const schema = z.object({
    name: z.string().min(1, { message: "This field cannot be empty!" }),
    brand: editId?.status
      ? z.union([z.string().nullable(), z.any()])
      : z
          .any()
          .refine((files) => files?.length == 1, "Image is required.")

          .refine(
            (files) => validImageTypes.includes(files?.[0]?.type),
            ".jpg, .jpeg and .png files are accepted."
          ),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validImageTypes.includes(file.type) && file.size <= MAX_FILE_SIZE) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBrandImageToShow(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setBrandImageToShow(null);
      }
    } else {
      setBrandImageToShow(null);
    }
  };

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: inputValue || "",
      brand: brandImageToShow || undefined,
    },
  });

  // Fetcher function to make API requests
  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postMediaFetch(url, arg);
  };

  const {
    data,
    error,
    isMutating,
    trigger: add,
  } = useSWRMutation(`${Backend_URL}/product-brands`, postFetcher);

  const editFetcher = async (url: string, { arg }: { arg: any }) => {
    return putMediaFetch(url, arg);
  };

  const {
    data: editData,
    error: editError,
    isMutating: editMutating,
    trigger: edit,
  } = useSWRMutation(
    `${Backend_URL}/product-brands/${editId?.id}`,
    editFetcher
  );

  const onSubmit: SubmitHandler<FormData> = async (value) => {
    const formData = new FormData();
    formData.append("image", value.brand[0] || "");
    formData.append("name", value.name);
    try {
      const res = editId.status ? await edit(formData) : await add(formData);
      if (res.status) {
        mutate(`${Backend_URL}/product-brands`);
        closeRef.current.click();
        resetValue();
        refetch();
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="space-y-3">
          <Label className="flex items-center gap-1">Image</Label>
          <Input
            id="image"
            {...register("brand")}
            type="file"
            onChange={handleImageChange}
          />
          {brandImageToShow && (
            <Image
              src={brandImageToShow}
              alt="Image Preview"
              className=" object-contain"
              width={500}
              height={500}
            />
          )}

          {errors.brand && (
            <p className="text-red-600 text-xs">
              {errors.brand.message as never}
            </p>
          )}

          <FormInput
            id="size"
            label="Brand Name"
            {...register("name")}
            type="text"
          />
          {errors.name && (
            <p className="text-red-600 text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            onClick={() => {
              resetValue();
              closeRef.current.click();
            }}
            type="button"
            variant="link"
          >
            Cancel
          </Button>
          <Button
            disabled={isMutating || editMutating}
            type="submit"
            className="block"
          >
            {isMutating ? "Saving" : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BrandForm;
