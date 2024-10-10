"use client";

import ProductVariableTable from "@/components/pos/products/ProductVariantTable";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import useSWRMutation from "swr/mutation";
import { Backend_URL, getFetch, postFetch, postMediaFetch } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";

const AddProductPageSix = () => {
  const { addProductFormData, navigateBackward, setAddProductFormData } =
    useProductProvider();

  const router = useRouter();

  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postMediaFetch(url, arg);
  };

  const getData = async (url: string) => {
    return getFetch(url);
  };

  const {
    trigger: add,
    error,
    isMutating,
  } = useSWRMutation(`${Backend_URL}/products`, postFetcher, {
    onSuccess: () => router.push("/pos/app/products"),
  });

  const { data: brandData, error: brandError } = useSWR(
    `${Backend_URL}/product-brands/${addProductFormData.brand}`,
    getData
  );

  const { data: categoryData, error: categoryError } = useSWR(
    `${Backend_URL}/product-categories/${addProductFormData.product_category_id}`,
    getData
  );

  const { data: typeData } = useSWR(
    `${Backend_URL}/product-types/${addProductFormData.product_type_id}`,
    getData
  );

  const { data: fittingData } = useSWR(
    `${Backend_URL}/product-fittings/${addProductFormData.product_fitting_id}`,
    getData
  );

  const handleSubmit = async () => {
    // create product
    const formData = new FormData();
    formData.append("name", addProductFormData.name);
    formData.append("gender", addProductFormData.gender);
    formData.append("description", addProductFormData.description);
    formData.append(
      "isEcommerce",
      `${addProductFormData.addTo.eCommerce ? 1 : 0}`
    );
    formData.append("isPos", `${addProductFormData.addTo.pos ? 1 : 0}`);

    formData.append("productBrandId", `${addProductFormData.brand}`);
    formData.append("productTypeId", `${addProductFormData.product_type_id}`);
    formData.append(
      "productCategoryId",
      `${addProductFormData.product_category_id}`
    );
    formData.append(
      "productFittingId",
      `${addProductFormData.product_fitting_id}`
    );
    formData.append("salePrice", `${addProductFormData.sale_price}`);
    formData.append("stockPrice", `${addProductFormData.stock_price}`);
    formData.append("discountPrice", `${addProductFormData.discount}`);
    formData.append("productCode", `${addProductFormData.productCode}`);

    addProductFormData.image.forEach((img) =>
      formData.append("images", img.file)
    );

    addProductFormData.productVariants.forEach((variant, variantIndex) => {
      // Append regular fields of the variant
      formData.append(
        `productVariants[${variantIndex}][shopCode]`,
        variant.shopCode
      );
      formData.append(
        `productVariants[${variantIndex}][colorCode]`,
        variant.colorCode
      );
      formData.append(
        `productVariants[${variantIndex}][barcode]`,
        variant.barcode
      );
      formData.append(
        `productVariants[${variantIndex}][productSizingId]`,
        variant.productSizingId
      );

      formData.append(`productVariants[${variantIndex}][image]`, variant.image);
    });

    try {
      const res = await add(formData);
      if (res) {
        setAddProductFormData({
          addTo: {
            eCommerce: true,
            pos: true,
          },
          name: "",
          description: "",
          gender: "",
          brand: Number(""),
          productCode: "",
          product_type_id: Number(""),
          product_category_id: Number(""),
          product_fitting_id: Number(""),
          image: [],
          stock_price: 0,
          sale_price: 0,
          discount: 0,
          profitInPercent: 0,
          profitInDigit: 0,
          productVariants: [],
        });
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
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
            disabled={isMutating}
            onClick={handleSubmit}
            type="button"
            size="sm"
          >
            Publish
          </Button>
        </div>
      </div>

      {error && <p className="capitalize text-red-500">{error.message}</p>}

      <hr className="py-3" />
      <div className=" space-y-4">
        {/* photos */}
        {addProductFormData.image && (
          <div className=" w-full justify-start overflow-x-auto flex gap-3">
            {addProductFormData.image?.map((image, index) => (
              <Image
                key={index}
                className="h-[400px] object-cover"
                src={URL.createObjectURL(image.file)}
                alt=""
                width={400}
                height={400}
              />
            ))}
          </div>
        )}
        {/* product name */}
        <p className=" text-3xl font-bold">{addProductFormData.name}</p>

        {/* product variant */}
        <div className=" bg-white p-4 space-y-2 font-bold">
          <p>Product Variant</p>
          <div className="flex gap-1">
            <Badge className={" text-primary/60"} variant={"secondary"}>
              <span>Brand :</span>
              <span className=" text-primary/80 ms-1 text-xs capitalize">
                {brandData?.name}
              </span>
            </Badge>
            <Badge className={" text-primary/60"} variant={"secondary"}>
              <div className="flex">
                <span>Gender:</span>
                <span className=" text-primary/80 ms-1 text-xs capitalize">
                  {addProductFormData.gender}
                </span>
              </div>
            </Badge>
            <Badge className={" text-primary/60"} variant={"secondary"}>
              <span> Type :</span>
              <span className=" text-primary/80 ms-1 text-xs capitalize">
                {typeData?.name}
              </span>
            </Badge>
            <Badge className={" text-primary/60"} variant={"secondary"}>
              <span> Category :</span>
              <span className=" text-primary/80 ms-1 text-xs capitalize">
                {categoryData?.name}
              </span>
            </Badge>
            <Badge className={" text-primary/60"} variant={"secondary"}>
              <span>Fitting :</span>
              <span className=" text-primary/80 ms-1 text-xs capitalize">
                {fittingData?.name}
              </span>
            </Badge>
          </div>
        </div>

        {/* pricing */}
        <div className="flex">
          <div className="text-end basis-1/2 bg-white rounded-r-none p-3 rounded border border-input">
            <p className="text-xs me-2 text-primary/60">Sale Price</p>
            <p className="text-xl me-2">{addProductFormData.sale_price}</p>
          </div>
          <div className="text-end basis-1/2 rounded-s-none border-s-0 rounded-r-none bg-white p-3 rounded border border-input">
            <p className="text-xs text-primary/60">Base Price</p>
            <p className="text-xl">{addProductFormData.stock_price}</p>
          </div>
          <div className="text-end basis-1/2 rounded-s-none border-s-0 rounded-r-none bg-white p-3 rounded border border-input">
            <p className="text-xs text-primary/60">Profit in Percentage</p>
            <p className="text-xl">{addProductFormData.profitInPercent} %</p>
          </div>
          <div className="text-end basis-1/2 rounded-s-none border-s-0 bg-white p-3 rounded border border-input">
            <p className="text-xs text-primary/60">Profit Value</p>
            <p className="text-xl">{addProductFormData.profitInDigit}</p>
          </div>
        </div>

        <ProductVariableTable variant={addProductFormData.productVariants} />
        <div className="flex">
          <div className="text-end basis-1/4 bg-white rounded-r-none p-3 rounded border border-input">
            <p className="text-xs me-2 text-primary/60">Total Color</p>
            <p className="text-xl me-2">
              {
                Array.from(
                  new Set(
                    addProductFormData.productVariants.map((el) => el.colorCode)
                  )
                ).length
              }
            </p>
          </div>
          <div className="text-end basis-1/4 rounded-s-none  border-s-0 rounded-r-none bg-white p-3 rounded border border-input">
            <p className="text-xs text-primary/60">Size</p>
            <p className="text-xl">
              <React.Fragment>
                {Array.from(
                  new Set(
                    addProductFormData.productVariants.map((el) => el.sizeName)
                  )
                ).toString()}
              </React.Fragment>
            </p>
          </div>
          <div className="text-end basis-1/4 rounded-s-none border-s-0 rounded-r-none bg-white p-3 rounded border border-input">
            <p className="text-xs text-primary/60">Available</p>
            <p className="text-xl">
              <>{addProductFormData.productVariants.length}</>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPageSix;
