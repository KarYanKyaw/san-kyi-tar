import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, PlusCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
import { Backend_URL, postFetch, putFetch } from "@/lib/fetch";
import useSWRMutation from "swr/mutation";
import FormInput from "@/components/FormInput.components";

const CategoryNameControlBar = ({
  refetch,
  searchInputValue,
  setSearchInputValue,
  openSheetRef,
  inputValue,
  resetValue,
  promotionId,
  setInputValue,
  setPromotionId,
  editId,
}: {
  refetch: () => void;
  searchInputValue: string;
  setSearchInputValue: any;
  openSheetRef: any;
  resetValue: () => void;
  inputValue: string;
  setInputValue: any;
  promotionId: any;
  setPromotionId: any;
  editId: any;
}) => {
  const [open, setOpen] = useState(false);
  const schema = z.object({
    name: z.string().min(1, { message: "This field cannot be empty!" }),
    promotionRate: z
      .string()
      .min(1, { message: "This field cannot be empty!" }),
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
      name: "",
      promotionRate: "",
    },
  });

  const putFetcher = async (url: string, { arg }: { arg: any }) => {
    return putFetch(url, arg);
  };

  const postFetcher = async (
    url: string,
    { arg }: { arg: { name: string; promotionRate: number } }
  ) => {
    return postFetch(url, arg);
  };

  const {
    data: addData,
    trigger: add,
    error: addError,
  } = useSWRMutation(`${Backend_URL}/specials`, postFetcher);

  const {
    data: editData,
    trigger: edit,
    error: editError,
  } = useSWRMutation(`${Backend_URL}/specials/${editId.id}`, putFetcher, {
    onSuccess: () => closeRef.current && closeRef.current.click(),
  });

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = async (value: any) => {
    const res = editId.status
      ? await edit({
          name: value.name,
          promotionRate: parseInt(value.promotionRate),
        })
      : await add({
          name: value.name,
          promotionRate: parseInt(value.promotionRate),
        });
    if (res) {
      reset({
        name: "",
        promotionRate: "",
      });
      refetch();
      closeRef?.current && closeRef.current.click();
    }
  };

  useEffect(() => {
    if (inputValue !== "" && promotionId !== "") {
      reset({
        name: inputValue,
        promotionRate: promotionId,
      });
    }
  }, [inputValue, promotionId]);

  return (
    <div>
      <div className=" flex justify-between">
        <div className=" flex gap-3">
          <Input
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <Sheet
          open={open}
          onOpenChange={() => {
            setOpen(!open);
            if (open) {
              resetValue();
              reset({
                name: "",
                promotionRate: "",
              });
              setOpen(false);
              closeRef.current?.click();
            }
          }}
        >
          <SheetTrigger asChild>
            <Button ref={openSheetRef} size={"sm"}>
              <Plus /> <p className=" ms-1">Add Level</p>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Level</SheetTitle>
              <SheetDescription>
                Make new level here. Click save when you are done.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
              <div className=" space-y-3">
                <FormInput
                  label="Name"
                  className=" my-4"
                  id="shopCode"
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <p className=" text-sm text-red-500">
                    {errors.name?.message}
                  </p>
                )}

                <FormInput
                  label="Amount"
                  id="amount"
                  type="text"
                  {...register("promotionRate")}
                />
                {errors.promotionRate && (
                  <p className=" text-sm text-red-500">
                    {errors.promotionRate?.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between">
                <Button
                  ref={closeRef}
                  type="button"
                  onClick={() => closeRef.current && closeRef.current.click()}
                  variant="link"
                >
                  Cancel
                </Button>
                <Button size="sm">Save changes</Button>
              </div>
              {addError && (
                <p className=" text-red-500 text-sm">{addError.message}</p>
              )}
            </form>
            <SheetFooter className={"flex !justify-between items-center"}>
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

export default CategoryNameControlBar;
