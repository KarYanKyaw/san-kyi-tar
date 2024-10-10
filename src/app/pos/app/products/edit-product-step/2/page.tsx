"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProductControlBar } from "@/components/pos/products";
import { editProductFetch, getFetch } from "@/lib/fetch";
import { Backend_URL } from "@/lib/api";
import useSWR from "swr";
import { useEffect } from "react";
import useSWRMutation from "swr/mutation";

const EditProductPageTwo = () => {
  const {
    editProductFormData,
    setEditProductFormData,
    categoryData,
    setCategoryData,
    fittingData,
    setFittingData,
    setSwalProps,
    swalProps,
  } = useProductProvider();

  // form validation
  const schema =  typeof window !== "undefined" ? z.object({
    gender:  typeof window !== "undefined" ? z.string({
      required_error: "This field cannot be empty!",
    }) : z.any(),

    brand: typeof window !== "undefined" ? z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(1, { message: "This field cannot be empty!" }) : z.any(),

    productTypeId: typeof window !== "undefined" ? z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(1, { message: "This field cannot be empty!" }) : z.any(),

    productCategoryId: typeof window !== "undefined" ? z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(1, { message: "This field cannot be empty!" }) : z.any(),

    productFittingId: typeof window !== "undefined" ? z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(1, { message: "This field cannot be empty!" }) : z.any(),
  }) : z.any();

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: editProductFormData.gender,
      brand: editProductFormData.brand,
      productCategoryId: editProductFormData.productCategoryId,
      productTypeId: editProductFormData.productTypeId,
      productFittingId: editProductFormData.productFittingId,
    },
  });

  // get brands
  const getData = (url: string) => {
    return getFetch(url);
  };

  const { data: brandData } = useSWR(
    `${Backend_URL}/product-brands/all`,
    getData
  );

  const { data: typeData } = useSWR(
    `${Backend_URL}/product-types/all`,
    getData
  );

  const { data: categoriesData } = useSWR(
    `${Backend_URL}/product-categories/all`,
    getData
  );

  const { data: fittingsData } = useSWR(
    `${Backend_URL}/product-fittings/all`,
    getData
  );

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
    const formData = new FormData();
    formData.append("productBrandId", `${data.brand}`);
    formData.append("productTypeId", `${data.productTypeId}`);
    formData.append("productCategoryId", `${data.productCategoryId}`);
    formData.append("productFittingId", `${data.productFittingId}`);
    formData.append("gender", `${data.gender}`);
    const res = await edit(formData);
    if (res.status) {
      setSwalProps({
        ...swalProps,
        show: true,
      });
    }
  };

  useEffect(() => {
    if (categoriesData) {
      
      setCategoryData(categoriesData.data);
    }
    if (fittingsData) {
      setFittingData(fittingsData.data);
    }
  }, [categoriesData, fittingsData]);

  return (
    <div className=" space-y-4">
      <EditProductControlBar run={handleSubmit(onSubmit)} />
      {error && <p className=" text-sm text-red-500">{error.message}</p>}
      <div className=" w-3/4 space-y-4">
        {/* gender */}
        <div className=" space-y-1.5">
          <Label>Gender</Label>
          <RadioGroup
            defaultValue={editProductFormData.gender}
            name="gender"
            onValueChange={(e) => setValue("gender", e)}
            className=" bg-white rounded-md border p-3 flex justify-around"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MEN" id="r1" />
              <Label htmlFor="r1">Man</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="WOMEN" id="r2" />
              <Label htmlFor="r2">Woman</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="UNISEX" id="r3" />
              <Label htmlFor="r3">Unisex</Label>
            </div>
          </RadioGroup>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender.message as never}</p>
          )}
        </div>

        <>
          {/* brand */}
          <div className=" space-y-1.5">
            <Label>Brand</Label>
            <Select
              defaultValue={`${editProductFormData.brand}`}
              onValueChange={(e) => setValue("brand", parseInt(e))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                {brandData && (
                  <>
                    {brandData.data.map(({ name, id }: any) => (
                      <SelectItem key={id} value={`${id}`}>
                        {name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.brand && (
              <p className="text-sm text-red-500">{errors.brand.message as never}</p>
            )}
          </div>

          {/* product type */}
          <div className=" space-y-6">
            <div className=" flex gap-3 justify-normal">
              <div className=" space-y-1.5 basis-1/2">
                <Label>Product Type</Label>
                <Select
                  defaultValue={`${editProductFormData.productTypeId}`}
                  onValueChange={(e) => {
                    setValue("productTypeId", parseInt(e));
                    setCategoryData(
                      typeData.data.find(({ id }: any) => id == e)
                        .productCategories
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeData && (
                      <>
                        {typeData.data.map(({ name, id }: any) => (
                          <SelectItem key={id} value={`${id}`}>
                            {name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.productTypeId && (
                  <p className="text-sm text-red-500">
                    {errors.productTypeId.message as never}
                  </p>
                )}
              </div>

              {categoryData.length > 0 && (
                <div className=" space-y-1.5 basis-1/2">
                  <Label>Product Categories</Label>
                  <Select
                    defaultValue={`${editProductFormData.productCategoryId}`}
                    onValueChange={(e) => {
                      setValue("productCategoryId", parseInt(e));
                      setFittingData(
                        categoryData.find(({ id }: any) => id == e)
                          .productFittings
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryData && (
                        <>
                          {categoryData?.map(({ id, name }: any) => (
                            <SelectItem key={id} value={`${id}`}>
                              {name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {fittingData && (
              <div className=" space-y-1.5">
                <Label>Fitting</Label>
                <Select
                  defaultValue={`${editProductFormData.productFittingId}`}
                  onValueChange={(e) =>
                    setValue("productFittingId", parseInt(e))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Fitting" />
                  </SelectTrigger>
                  <SelectContent>
                    {fittingData && (
                      <>
                        {fittingData?.map(({ name, id }: any) => (
                          <SelectItem key={id} value={`${id}`}>
                            {name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.productFittingId && (
                  <p className="text-sm text-red-500">
                    {errors.productFittingId.message as never}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default EditProductPageTwo;
