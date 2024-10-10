import React, { useEffect } from "react";
import FormInput from "@/components/FormInput.components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Backend_URL, fetchApi } from "@/lib/api";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { postFetch, putFetch } from "@/lib/fetch";

type form = {
  closeRef: any;
  editId: any;
  inputValue: string;
  resetValue: () => void;
  refetch: () => void;
};

const ProductTypeForm = ({
  closeRef,
  editId,
  inputValue,
  resetValue,
  refetch,
}: form) => {
  const schema = z.object({
    name: z.string().min(1, { message: "This field cannot be empty!" }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: inputValue || "",
    },
  });

  // Fetcher function to make API requests
  const postFetcher = async (
    url: string,
    { arg }: { arg: { name: string } }
  ) => {
    return postFetch(url, arg);
  };

  const {
    data,
    error,
    isMutating,
    trigger: add,
  } = useSWRMutation(`${Backend_URL}/product-types`, postFetcher);

  const editFetcher = async (
    url: string,
    { arg }: { arg: { name: string } }
  ) => {
    return putFetch(url, arg);
  };

  const {
    data: editData,
    error: editError,
    isMutating: editMutating,
    trigger: edit,
  } = useSWRMutation(`${Backend_URL}/product-types/${editId?.id}`, editFetcher);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const res = editId.status
        ? await edit({ name: formData.name })
        : await add({ name: formData.name });

      if (res.status) {
        mutate(`${Backend_URL}/product-types`);
        closeRef.current.click();
        resetValue();
        refetch();
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
          <Label className="flex items-center gap-1">Add Product Types</Label>
          <FormInput id="size" {...register("name")} type="text" />
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
            {isMutating || editMutating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductTypeForm;
