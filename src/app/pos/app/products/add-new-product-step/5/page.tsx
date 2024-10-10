"use client";

import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Camera, Check, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Backend_URL } from "@/lib/api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getFetch } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import useSWR from "swr";
import FormInput from "@/components/FormInput.components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ProductVariantTable } from "@/components/pos/products";
import { Label } from "@/components/ui/label";

type ProductVariant = {
  id: number;
  shopCode: string;
  colorCode: string;
  barcode: string;
  productSizingId: number;
  image: File;
  sizeName: string;
};

const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const AddProductPageFive = () => {
  const [readyToProceed, setReadyToProceed] = useState(false);

  const {
    navigateForward,
    navigateBackward,
    addProductFormData,
    setAddProductFormData,
  } = useProductProvider();

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [size, setSize] = useState<string>("");
  const [editMode, setEditMode] = useState({
    status: false,
    id: "",
  });

  const getData = async (url: string) => {
    const response = await getFetch(url);
    return response;
  };

  const { data } = useSWR(`${Backend_URL}/product-sizings/all`, getData);
  const inputRef = useRef<HTMLInputElement>(null);

  const schema = z.object({
    image:
      typeof window !== "undefined"
        ? z
            .instanceof(File)
            .refine(
              (file) => validImageTypes.includes(file.type),
              ".jpg, .jpeg and .png files are accepted."
            )
        : z.any(),
    shopCode: z.string().min(2, { message: "This field cannot be empty!" }),
    colorCode: z.string().min(2, { message: "This field cannot be empty!" }),
    barcode: z.string().min(2, { message: "This field cannot be empty!" }),
    productSizingId: z
      .number()
      .min(1, { message: "This field cannot be empty!" }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: undefined,
      shopCode: "",
      colorCode: "",
      barcode: "",
      productSizingId: 0,
    },
  });

  const { name } = register("image");

  const onSubmit = (formData: FormData) => {
    const imageFile = formData.image as File;
    const updatedData: ProductVariant = {
      ...formData,
      id: editMode.status ? Number(editMode.id) : Date.now(),
      image: imageFile,
      sizeName:
        data?.data.find((el: any) => el.id === formData.productSizingId)
          ?.name || "",
    };

    const updatedVariants = editMode.status
      ? addProductFormData.productVariants.map((el: ProductVariant) =>
          el.id === updatedData.id ? updatedData : el
        )
      : [...addProductFormData.productVariants, updatedData];

    setAddProductFormData({
      ...addProductFormData,
      productVariants: updatedVariants,
    });

    reset({
      image: undefined,
      shopCode: "",
      colorCode: "",
      barcode: "",
    });
    setImage(undefined);
    setSize("");
    setEditMode({ status: false, id: "" });
    if (inputRef?.current) {
      inputRef.current.value = "";
    }
  };

  const handleProceed = () => {
    setAddProductFormData({
      ...addProductFormData,
      productVariants: addProductFormData.productVariants,
    });
  };

  const handleEdit = (id: number) => {
    const variantToEdit = addProductFormData.productVariants.find(
      (el) => el.id === id
    );

    if (variantToEdit) {
      setEditMode({
        status: true,
        id: `${id}`,
      });
      setSize(
        data.data.find((el: any) => el.id == variantToEdit.productSizingId).name
      );
      reset({
        image: variantToEdit.image,
        shopCode: variantToEdit.shopCode,
        colorCode: variantToEdit.colorCode,
        barcode: variantToEdit.barcode,
        productSizingId: variantToEdit.productSizingId,
      });
      setImage(variantToEdit.image);
    }
  };

  const handleDelete = (id: number) => {
    const updatedVariants = addProductFormData.productVariants.filter(
      (el) => el.id !== id
    );
    setAddProductFormData({
      ...addProductFormData,
      productVariants: updatedVariants,
    });
  };

  useEffect(() => {
    if (addProductFormData.productVariants.length > 0) setReadyToProceed(true);
  }, [addProductFormData.productVariants, setReadyToProceed]);

  return (
    <div className="space-y-4">
      <div>
        <div className="pb-4 flex justify-between items-center">
          <div className="space-y-2">
            <p className="font-bold text-xl">Add Product</p>
            <p className="font-normal text-primary/60 text-sm">
              Products Information placed across your store.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigateBackward()} type="button" size="sm">
              <ArrowLeft size={24} />
            </Button>
            <Button
              onClick={() => {
                if (readyToProceed) {
                  handleProceed();
                  navigateForward(6);
                }
              }}
              type="button"
              size="sm"
            >
              <ArrowRight size={24} />
            </Button>
          </div>
        </div>

        <hr className="py-3" />

        <div className="space-y-5">
          <div className="space-y-1.5">
            <form className=" w-full " onSubmit={handleSubmit(onSubmit)}>
              <div
                className="flex gap-3 justify-start"
                style={{ alignItems: "flex-end" }}
              >
                <div className="block basis-1/12">
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="flex justify-center items-center cursor-pointer h-10 w-10 bg-white rounded-full"
                  >
                    {image ? (
                      <Avatar>
                        <AvatarImage
                          className="object-cover"
                          src={URL.createObjectURL(image)}
                        />
                      </Avatar>
                    ) : (
                      <Camera />
                    )}
                  </div>
                  <div className="hidden">
                    <input
                      type="file"
                      id="image"
                      ref={inputRef}
                      name={name}
                      onChange={(e) => {
                        if (e.target.files) {
                          const file = e.target.files[0];
                          setValue("image", file);
                          setImage(file);
                        }
                      }}
                    />
                  </div>
                </div>
                <FormInput
                  className="basis-2/12  w-[70px]"
                  label="Shop Code"
                  id="shopCode"
                  type="text"
                  {...register("shopCode")}
                />

                <FormInput
                  className="basis-2/12 w-[100px]"
                  label="Color Code"
                  id="color_code"
                  type="text"
                  {...register("colorCode")}
                />

                <div className="space-y-1.5 basis-2/12">
                  <Label>Select Size</Label>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between !rounded-md"
                      >
                        {size ? size : "Sizes"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command defaultValue="">
                        <CommandInput
                          placeholder="Search Size..."
                          className="h-9"
                        />
                        <CommandEmpty>No sizes found!</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {data?.data.map(({ id, name }: any) => (
                              <CommandItem
                                className={cn(size === name ? "bg-accent" : "")}
                                key={id}
                                value={name}
                                onSelect={(e) => {
                                  setSize(e);
                                  setValue("productSizingId", parseInt(id));
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    size === name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <FormInput
                  className="basis-2/12 w-[100px]"
                  label="Barcode"
                  id="barcode"
                  {...register("barcode")}
                  type="text"
                />

                <Button>
                  <Plus />
                </Button>
              </div>
            </form>

            {Object.keys(errors).length > 0 && (
              <p className="text-sm text-red-500">
                Please fill all necessary information.
              </p>
            )}
          </div>
          <ProductVariantTable
            step={5}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            variant={addProductFormData.productVariants}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProductPageFive;
