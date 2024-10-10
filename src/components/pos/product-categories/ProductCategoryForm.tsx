import React, { useEffect } from "react";
import FormInput from "@/components/FormInput.components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Backend_URL, fetchApi } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { postFetch, putFetch } from "@/lib/fetch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormProps = {
  closeRef: any;
  editId: any;
  inputValue: string;
  resetValue: () => void;
  refetch: () => void;
  fittingData: { id: number; name: string }[];
  productFittingIds: number[];
  setProductFittingIds: any;
  typesData: [];
  productTypeId: number | undefined;
  setProductTypeId: any;
};

const CategoryForm = ({
  closeRef,
  editId,
  inputValue,
  resetValue,
  refetch,
  fittingData,
  productFittingIds,
  setProductFittingIds,
  typesData,
  productTypeId,
  setProductTypeId,
}: FormProps) => {
  const schema = z.object({
    name: z.string().min(1, { message: "This field cannot be empty!" }),
    productTypeId: z
      .number()
      .min(1, { message: "This field cannot be empty!" }),
    productFittingIds: z
      .array(z.number())
      .min(1, { message: "This field cannot be empty!" }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: inputValue || "",
      productFittingIds: productFittingIds || [],
      productTypeId: productTypeId || parseInt(""),
    },
  });

  // Fetcher function to make API requests
  const postFetcher = async (
    url: string,
    {
      arg,
    }: {
      arg: { name: string; productFittingIds: number[]; productTypeId: number };
    }
  ) => {
    return postFetch(url, arg);
  };

  const {
    data,
    error,
    isMutating,
    trigger: add,
  } = useSWRMutation(`${Backend_URL}/product-categories`, postFetcher);

  // edit
  const editFetcher = async (
    url: string,
    { arg }: { arg: { name: string; productFittingIds: number[] } }
  ) => {
    return putFetch(url, arg);
  };

  const {
    data: editData,
    error: editError,
    isMutating: editMutating,
    trigger: edit,
  } = useSWRMutation(
    `${Backend_URL}/product-categories/${editId?.id}`,
    editFetcher
  );

  const onSubmit: SubmitHandler<FormData> = async (value) => {
    try {
      const res = editId.status ? await edit(value) : await add(value);
      if (res.status) {
        mutate(`${Backend_URL}/product-categories`);
        closeRef.current.click();
        resetValue();
        refetch();
        setProductFittingIds([]);
      }
      reset();
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8">
        <div className="space-y-5">
          <div className=" space-y-2.5">
            <Label className="flex items-center gap-1">Category Name</Label>
            <FormInput id="size" {...register("name")} type="text" />
            {errors.name && (
              <p className="text-red-600 text-xs">{errors.name.message}</p>
            )}
          </div>
          <div className=" space-y-1.5">
            <Label>Product Types</Label>
            <Select
              defaultValue={`${productTypeId}`}
              onValueChange={(value) =>
                setValue("productTypeId", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {typesData.map(({ id, name }, index) => (
                    <SelectItem key={index} value={`${id}`}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.productTypeId && (
              <p className="text-xs text-red-500">
                {errors.productTypeId.message}
              </p>
            )}
          </div>
          <div className=" space-y-1.5">
            <Label>Fitting</Label>
            <div className="max-h-[400px] overflow-auto">
              <ToggleGroup
                defaultValue={productFittingIds.map((el: any) => el.toString())}
                onValueChange={(e) =>
                  setValue(
                    "productFittingIds",
                    e.map((i) => parseInt(i))
                  )
                }
                {...register("productFittingIds")}
                size="sm"
                type="multiple"
              >
                {fittingData?.map(({ id, name }) => (
                  <ToggleGroupItem key={id} value={`${id}`}>
                    {name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            {errors.productFittingIds && (
              <p className="text-xs text-red-500">
                {errors.productFittingIds.message}
              </p>
            )}
          </div>
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
            {isMutating || editMutating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
