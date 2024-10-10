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
import {
  deleteSingleFetch,
  getFetch,
  postMediaFetch,
  putMediaFetch,
} from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import useSWR from "swr";
import FormInput from "@/components/FormInput.components";
import { object, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  EditProductControlBar,
  ProductVariantTable,
} from "@/components/pos/products";
import { Label } from "@/components/ui/label";
import useSWRMutation from "swr/mutation";

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

const EditProductPageFive = () => {
  const {
    editProductFormData,
    setEditProductFormData,
    swalProps,
    setSwalProps,
  } = useProductProvider();

  const [variants, setVariants] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<string>("");
  const [image, setImage] = useState<File | undefined | string>(undefined);
  const [editMode, setEditMode] = useState({
    status: false,
    id: "",
  });

  const getData = async (url: string) => {
    const response = await getFetch(url);
    return response;
  };

  useEffect(() => {
    setVariants(
      editProductFormData.productVariants.filter((el) => !el.statusStock)
    );
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useSWR(`${Backend_URL}/product-sizings/all`, getData);

  const schema = z.object({
    image:
      typeof window !== "undefined"
        ? z
            .instanceof(File)
            .refine(
              (file) => validImageTypes.includes(file.type),
              ".jpg, .jpeg and .png files are accepted."
            )
            .optional()
        : z.any(),
    shopCode:
      typeof window !== "undefined"
        ? z.string().min(2, { message: "This field cannot be empty!" })
        : z.any(),
    colorCode:
      typeof window !== "undefined"
        ? z.string().min(2, { message: "This field cannot be empty!" })
        : z.any(),
    barcode:
      typeof window !== "undefined"
        ? z.string().min(2, { message: "This field cannot be empty!" })
        : z.any(),
    productSizingId:
      typeof window !== "undefined"
        ? z.number().min(1, { message: "This field cannot be empty!" })
        : z.any(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: undefined,
      shopCode: "",
      colorCode: "",
      barcode: "",
      productSizingId: parseInt(""),
    },
  });

  const { name } = register("image");

  const putFetcher = async (url: string, { arg }: { arg: any }) => {
    return putMediaFetch(url, arg);
  };

  const {
    data: putData,
    trigger: edit,
    error: editError,
  } = useSWRMutation(
    `${Backend_URL}/product-variants/${editMode.id}`,
    putFetcher
  );

  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postMediaFetch(url, arg);
  };

  const {
    data: postData,
    trigger: add,
    error,
  } = useSWRMutation(`${Backend_URL}/product-variants`, postFetcher);

  const onSubmit = async (value: any) => {
    const formData = new FormData();
    formData.append("shopCode", value.shopCode);
    formData.append("colorCode", value.colorCode);
    formData.append("productSizingId", value.productSizingId);

    if (editMode.status) {
      if (typeof value.image !== "undefined") {
        formData.append("image", value.image);
      }
      if (
        value.barcode !== variants.find((el) => el.id == editMode.id).barcode
      ) {
        formData.append("barcode", value.barcode);
      }
    }

    if (editMode.status) {
      const res = await edit(formData);
      if (res.status) {
        setVariants(
          variants.map((el) => (el.id == editMode.id ? res.data : el))
        );
        setImage(undefined);
        reset({
          image: undefined,
          shopCode: "",
          colorCode: "",
          barcode: "",
          productSizingId: parseInt(""),
        });
        setEditMode({
          status: false,
          id: "",
        });
        setSize("");
        return;
      }
    } else {
      formData.append("productId", `${editProductFormData.id}`);
      formData.append("image", value.image);
      formData.append("barcode", value.barcode);
      const res = await add(formData);
      if (res.status) {
        setVariants([...variants, res.data]);
        setImage(undefined);
        reset({
          image: undefined,
          shopCode: "",
          colorCode: "",
          barcode: "",
          productSizingId: parseInt(""),
        });
        setSize("");
      }
    }
  };

  const [idToDelete, setIdToDelete] = useState<number | undefined>();

  const { data: deleteData, trigger: drop } = useSWRMutation(
    `${Backend_URL}/product-variants/${idToDelete}`,
    deleteSingleFetch
  );

  const handleDelete = async (id: number) => {
    await setIdToDelete(id);
    const data = await drop();
    if (data.status) {
      setIdToDelete(undefined);
    }
    setVariants(variants.filter((el) => el.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditMode({
      status: true,
      id: `${id}`,
    });

    const data = variants.find((el) => el.id == id);

    reset({
      image: data.image,
      shopCode: data.shopCode,
      colorCode: data.colorCode,
      barcode: data.barcode,
      productSizingId: data.productSizing.id,
    });
    setSize(data.productSizing.name);
    setImage(data.media.url);
  };

  return (
    <div className="space-y-4">
      <div>
        <EditProductControlBar
          run={() =>
            setSwalProps({
              ...swalProps,
              show: true,
            })
          }
        />

        <hr className="py-3" />

        {error && <p className=" text-sm text-red-500">{error.message}</p>}
        {editError && (
          <p className=" text-sm text-red-500">{editError.message}</p>
        )}

        <div className="space-y-5">
          <div className="space-y-1.5">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                      typeof image === "string" ? (
                        <Avatar>
                          <AvatarImage
                            className="object-cover"
                            src={image as string}
                          />
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AvatarImage
                            className="object-cover"
                            src={URL.createObjectURL(image as File)}
                          />
                        </Avatar>
                      )
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
                  className="basis-2/12  w-[100px]"
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
                      <Command defaultValue={`${getValues("productSizingId")}`}>
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
            variant={variants}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProductPageFive;
