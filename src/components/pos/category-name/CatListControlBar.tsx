import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Backend_URL,
  getFetch,
  postFetch,
  postMediaFetch,
  putFetch,
  putMediaFetch,
} from "@/lib/fetch";
import useSWRMutation from "swr/mutation";
import FormInput from "@/components/FormInput.components";
import { FilePond } from "react-filepond";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import Image from "next/image";

const CatListControlBar = ({
  refetch,
  searchInputValue,
  setSearchInputValue,
  openSheetRef,
  inputValue,
  resetValue,
  editId,
  setImageToShow,
  imageToShow,
  catId,
  setCatId,
}: {
  refetch: () => void;
  searchInputValue: string;
  setSearchInputValue: React.Dispatch<React.SetStateAction<string>>;
  openSheetRef: any;
  resetValue: () => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  editId: { id: string; status: boolean };
  setImageToShow: any;
  imageToShow: any;
  catId: any;
  setCatId: any;
}) => {
  const [open, setOpen] = useState(false);

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  const schema = z.object({
    name:
      typeof window !== "undefined"
        ? z.string().min(1, { message: "This field cannot be empty!" })
        : z.any(),

    productCategoryId:
      typeof window !== "undefined"
        ? z.string().min(1, { message: "This field cannot be empty!" })
        : z.any(),
    image:
      typeof window !== "undefined"
        ? z
            .array(
              z.object({
                file: z.instanceof(File),
              })
            )
            .min(0, { message: "At least one image is required" })
            .max(1, { message: "Only one image is required" })
            .optional()
        : z.any(),
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
      name: "",
      productCategoryId: catId || "",
      image: [],
    },
  });

  const putFetcher = async (url: string, { arg }: { arg: any }) => {
    return putMediaFetch(url, arg);
  };

  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postMediaFetch(url, arg);
  };

  const getData = (url: string) => {
    return getFetch(url);
  };

  const {
    data: addData,
    trigger: add,
    error: addError,
  } = useSWRMutation(`${Backend_URL}/ecommerce-categories`, postFetcher);

  const { data: categoriesAllData } = useSWR(
    `${Backend_URL}/product-categories/all`,
    getData
  );

  const { trigger: edit } = useSWRMutation(
    `${Backend_URL}/ecommerce-categories/${editId.id}`,
    putFetcher,
    {
      onSuccess: () => closeRef.current?.click(),
    }
  );

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = async (value: FormData) => {
    const formData = new FormData();
    formData.append("name", value.name);
    formData.append("productCategoryId", value.productCategoryId);

    if (value.image && value.image.length > 0) {
      formData.append("image", value.image[0].file);
    }

    const res = editId.status ? await edit(formData) : await add(formData);

    if (res) {
      reset();
      refetch();
      closeRef.current?.click();
    }
  };

  const handleFileUpdate = (fileItems: any) => {
    const validFiles = fileItems.map((fileItem: any) => ({
      file: fileItem.file instanceof File ? fileItem.file : fileItem.file.file,
    }));
    setValue("image", validFiles, { shouldValidate: true });
  };

  useEffect(() => {
    if (inputValue !== "" && catId !== "") {
      reset({
        name: inputValue,
        productCategoryId: `${catId}`,
      });
    }
  }, [inputValue, catId]);

  return (
    <div>
      <div className="flex justify-between">
        <Input
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          placeholder="Search..."
        />
        <Sheet
          open={open}
          onOpenChange={() => {
            setOpen(!open);
            if (open) {
              resetValue();
              reset();
              setOpen(false);
              closeRef.current?.click();
            }
          }}
        >
          <SheetTrigger asChild>
            <Button ref={openSheetRef} size="sm">
              <Plus /> <span className="ms-1">Add Category</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Category</SheetTitle>
              <SheetDescription>
                Make a new level here. Click save when you are done.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FilePond
                className="!rounded-md"
                allowMultiple={true}
                onupdatefiles={handleFileUpdate}
                allowDrop={true}
                maxFiles={1}
                server={null}
                instantUpload={false}
              />
              {imageToShow !== undefined && (
                <Image
                  src={imageToShow}
                  alt="Image Preview"
                  className=" object-contain w-[300px] h-[300px]"
                  width={500}
                  height={500}
                />
              )}
              {errors.image && (
                <p className="text-sm text-red-500">
                  {errors.image.message as never}
                </p>
              )}
              <FormInput
                label="Name"
                id="name"
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name.message as never}
                </p>
              )}
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  defaultValue={catId || ""}
                  onValueChange={(e) => setValue("productCategoryId", e)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesAllData?.data.map(({ name, id }: any) => (
                      <SelectItem key={id} value={`${id}`}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productCategoryId && (
                  <p className="text-sm text-red-500">
                    {errors.productCategoryId.message as never}
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <Button
                  ref={closeRef}
                  type="button"
                  onClick={() => closeRef.current?.click()}
                  variant="link"
                >
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  Save changes
                </Button>
              </div>
              {addError && (
                <p className="text-red-500 text-sm">{addError.message}</p>
              )}
            </form>
            <SheetFooter className="flex justify-between items-center">
              <SheetClose asChild>
                <Button className="hidden" ref={closeRef} variant="link">
                  Cancel
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button className="hidden" size="sm">
                  Save changes
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CatListControlBar;
