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
import { AddProductControlBar } from "@/components/pos/products";
import { getFetch } from "@/lib/fetch";
import { Backend_URL } from "@/lib/api";
import useSWR from "swr";

const AddProductPageTwo = () => {
  const {
    navigateForward,
    navigateBackward,
    addProductFormData,
    setAddProductFormData,
    categoryData,
    setCategoryData,
    fittingData,
    setFittingData,
  } = useProductProvider();

  // form validation
  const schema = z.object({
    gender: z.string({
      required_error: "This field cannot be empty!",
    }),

    brand: z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(1, { message: "This field cannot be empty!" }),

    product_type_id: z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(1, { message: "This field cannot be empty!" }),

    product_category_id: z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(1, { message: "This field cannot be empty!" }),

    product_fitting_id: z
      .number({
        required_error: "This field cannot be empty!",
      })
      .min(1, { message: "This field cannot be empty!" }),
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
      gender: addProductFormData.gender || undefined,
      brand: addProductFormData.brand || undefined,
      product_category_id: addProductFormData.product_category_id || undefined,
      product_type_id: addProductFormData.product_type_id || undefined,
      product_fitting_id: addProductFormData.product_fitting_id || undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    setAddProductFormData({
      ...addProductFormData,
      ...data,
    });
    navigateForward(3);
  };

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

  return (
    <div className=" space-y-4">
      <AddProductControlBar
        goBackward={navigateBackward}
        goForward={handleSubmit(onSubmit)}
      />

      <div className=" w-3/4 space-y-4">
        {/* gender */}
        <div className=" space-y-1.5">
          <Label>Gender</Label>
          <RadioGroup
            defaultValue={addProductFormData.gender}
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
            <p className="text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <>
          {/* brand */}
          <div className=" space-y-1.5">
            <Label>Brand</Label>
            <Select
              defaultValue={`${addProductFormData.brand}`}
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
              <p className="text-sm text-red-500">{errors.brand.message}</p>
            )}
          </div>

          {/* product type */}

          <div className=" space-y-6">
            <div className=" flex gap-3 justify-normal">
              <div className=" space-y-1.5 basis-1/2">
                <Label>Product Type</Label>
                <Select
                  defaultValue={`${addProductFormData.product_type_id}`}
                  onValueChange={(e) => {
                    setValue("product_type_id", parseInt(e));
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
                {errors.product_type_id && (
                  <p className="text-sm text-red-500">
                    {errors.product_type_id.message}
                  </p>
                )}
              </div>

              {categoryData.length > 0 && (
                <div className=" space-y-1.5 basis-1/2">
                  <Label>Product Categories</Label>
                  <Select
                    defaultValue={`${addProductFormData.product_category_id}`}
                    onValueChange={(e) => {
                      setValue("product_category_id", parseInt(e));
                      setFittingData(
                        categoryData.find(({ id }) => id == e).productFittings
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryData.length > 0 && (
                        <>
                          {categoryData.map(({ id, name }: any) => (
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
            {fittingData.length > 0 && (
              <div className=" space-y-1.5">
                <Label>Fitting</Label>
                <Select
                  defaultValue={`${addProductFormData.product_fitting_id}`}
                  onValueChange={(e) =>
                    setValue("product_fitting_id", parseInt(e))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Fitting" />
                  </SelectTrigger>
                  <SelectContent>
                    {fittingData.length > 0 && (
                      <>
                        {fittingData.map(({ name, id }: any) => (
                          <SelectItem key={id} value={`${id}`}>
                            {name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.product_fitting_id && (
                  <p className="text-sm text-red-500">
                    {errors.product_fitting_id.message}
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

export default AddProductPageTwo;
