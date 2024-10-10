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

const SizeForm = ({
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
    const names = arg.name.split(",").map((name) => ({ name: name.trim() }));
    return postFetch(url, names);
  };

  const {
    data,
    error,
    isMutating,
    trigger: add,
  } = useSWRMutation(`${Backend_URL}/product-sizings`, postFetcher);

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
  } = useSWRMutation(
    `${Backend_URL}/product-sizings/${editId?.id}`,
    editFetcher
  );

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const res = editId.status
        ? await edit({ name: formData.name })
        : await add({ name: formData.name });

      if (res.status) {
        mutate(`${Backend_URL}/product-sizings`);
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
          <Label className="flex items-center gap-1">
            <span>Add Size</span>
            <Popover>
              <PopoverTrigger className="text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#030202"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1-12,12A12,12,0,0,1,112,84Z"></path>
                </svg>
              </PopoverTrigger>
              <PopoverContent className="text-sm">
                You can type S, M, L, XL to speed up the process!
              </PopoverContent>
            </Popover>
          </Label>
          <FormInput id="size" {...register("name")} type="text" />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
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

export default SizeForm;
