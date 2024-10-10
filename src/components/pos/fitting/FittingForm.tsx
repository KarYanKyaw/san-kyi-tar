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

type FormProps = {
  closeRef: any;
  editId: any;
  inputValue: string;
  resetValue: () => void;
  refetch: () => void;
  sizeData: { id: number; name: string }[];
  productSizingIds: number[];
  setProductSizingIds: any;
};

const FittingForm = ({
  closeRef,
  editId,
  inputValue,
  resetValue,
  refetch,
  sizeData,
  productSizingIds,
  setProductSizingIds,
}: FormProps) => {
  const schema = z.object({
    name: z.string().min(1, { message: "This field cannot be empty!" }),
    productSizingIds: z
      .array(z.number())
      .min(1, { message: "At least one product sizing ID is required!" }),
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
      productSizingIds: productSizingIds || [],
    },
  });

  // Fetcher function to make API requests
  const postFetcher = async (
    url: string,
    { arg }: { arg: { name: string; productSizingIds: number[] } }
  ) => {
    return postFetch(url, arg);
  };

  const {
    data,
    error,
    isMutating,
    trigger: add,
  } = useSWRMutation(`${Backend_URL}/product-fittings`, postFetcher);

  // edit
  const editFetcher = async (
    url: string,
    { arg }: { arg: { name: string; productSizingIds: number[] } }
  ) => {
    return putFetch(url, arg);
  };

  const {
    data: editData,
    error: editError,
    isMutating: editMutating,
    trigger: edit,
  } = useSWRMutation(
    `${Backend_URL}/product-fittings/${editId?.id}`,
    editFetcher
  );

  const onSubmit: SubmitHandler<FormData> = async (value) => {
    try {
      const res = editId.status ? await edit(value) : await add(value);
      if (res.status) {
        mutate(`${Backend_URL}/product-fittings`);
        closeRef.current.click();
        resetValue();
        refetch();
        setProductSizingIds([]);
      }
      reset();
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="space-y-3">
          <Label className="flex items-center gap-1">Fitting Name</Label>
          <FormInput id="size" {...register("name")} type="text" />
          {errors.name && (
            <p className="text-red-600 text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <Label>Size</Label>
          <div className="h-[400px] overflow-auto">
            <ToggleGroup
              defaultValue={productSizingIds.map((el: any) => el.toString())}
              onValueChange={(e) =>
                setValue(
                  "productSizingIds",
                  e.map((i) => parseInt(i))
                )
              }
              {...register("productSizingIds")}
              size="sm"
              type="multiple"
            >
              {sizeData?.map(({ id, name }) => (
                <ToggleGroupItem key={id} value={`${id}`}>
                  {name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          {errors.productSizingIds && (
            <p className="text-sm text-red-500">
              {errors.productSizingIds.message}
            </p>
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
            {isMutating || editMutating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FittingForm;
