"use client";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import { AddProductControlBar } from "@/components/pos/products";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { FilePond } from "react-filepond";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AddProductPageThree = () => {
  const {
    navigateForward,
    navigateBackward,
    addProductFormData,
    setAddProductFormData,
  } = useProductProvider();

  // to display
  const [images, setImages] = useState<File[]>([]);

  const handleFileUpdate = (fileItems: any) => {
    const validFiles = fileItems.map((fileItem: any) => fileItem.file);

    setImages(validFiles);
  };

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  const schema = z.object({
    image:
      typeof window !== "undefined"
        ? z
            .array(
              z.object({
                file: z
                  .instanceof(File)
                  .refine((file) => validImageTypes.includes(file.type), {
                    message: "Invalid file type",
                  }),
              })
            )
            .min(1, { message: "At least one image is required" })
            .max(5, { message: "No more than 5 images are allowed" })
        : z.any(),
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
      image: addProductFormData.image || [],
    },
  });

  const onSubmit = (data: FormData) => {
    setAddProductFormData({
      ...addProductFormData,
      ...data,
    });
    navigateForward(4);
  };

  return (
    <div className="space-y-4 ">
      <AddProductControlBar
        goBackward={navigateBackward}
        goForward={handleSubmit(onSubmit)}
      />

      <div className="w-1/2">
        <FilePond
          className="!bg-white !rounded-md"
          allowMultiple={true}
          onupdatefiles={(fileItems: any) => {
            handleFileUpdate(fileItems);
            const validFiles = fileItems.map((fileItem: any) => ({
              file:
                fileItem.file instanceof File
                  ? fileItem.file
                  : (fileItem.file.file as File),
            }));
            setValue("image", validFiles, { shouldValidate: true });
            setAddProductFormData({
              ...addProductFormData,
              image: validFiles,
            });
          }}
          allowDrop={true}
          maxFiles={5}
          server={null}
          instantUpload={false}
        />
        {errors.image && (
          <p className="text-sm text-red-500">
            {errors.image.message as string}
          </p>
        )}
      </div>

      <div className=" w-full overflow-auto">
        <div className=" flex gap-3 justify-start items-center">
          {images.map((file, index) => (
            <Image
              key={index}
              className=" object-cover"
              src={URL.createObjectURL(file)}
              alt=""
              width={400}
              height={400}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProductPageThree;
