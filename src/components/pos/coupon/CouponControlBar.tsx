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

const CouponControlBar = ({
  refetch,
  searchInputValue,
  setSearchInputValue,
  openSheetRef,
  inputValue,
  resetValue,
  editId,
  setDiscount,
  setCouponId,
  setExpiredDate,
  expiredDate,
  couponId,
  discount,
}: {
  refetch: () => void;
  searchInputValue: string;
  setSearchInputValue: any;
  openSheetRef: any;
  resetValue: () => void;
  inputValue: string;
  setInputValue: any;
  discount: any;
  editId: any;
  setDiscount: any;
  setCouponId: any;
  setExpiredDate: any;
  couponId: any;
  expiredDate: any;
}) => {
  const [open, setOpen] = useState(false);
  const schema = z.object({
    name: z.string().min(1, { message: "This field cannot be empty!" }),
    discount: z.string().min(1, { message: "This field cannot be empty!" }),
    couponId: z.string().min(1, { message: "This field cannot be empty!" }),
    expiredDate: z.string().min(1, { message: "This field cannot be empty!" }),
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
      discount: "",
      couponId: "",
      expiredDate: "",
    },
  });

  const putFetcher = async (url: string, { arg }: { arg: any }) => {
    return putFetch(url, arg);
  };

  const postFetcher = async (
    url: string,
    {
      arg,
    }: {
      arg: {
        name: string;
        discount: number;
        couponId: string;
        expiredDate: string;
      };
    }
  ) => {
    return postFetch(url, arg);
  };

  const {
    data: addData,
    trigger: add,
    error: addError,
  } = useSWRMutation(`${Backend_URL}/coupon`, postFetcher);

  const {
    data: editData,
    trigger: edit,
    error: editError,
  } = useSWRMutation(`${Backend_URL}/coupon/${editId.id}`, putFetcher, {
    onSuccess: () => closeRef.current && closeRef.current.click(),
  });

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = async (value: any) => {
    const formattedDate = formatDate(new Date(value.expiredDate));
    value.expiredDate = formattedDate;

    const res = editId.status
      ? await edit({
          name: value.name,
          discount: parseInt(value.discount),
          couponId: value.couponId,
          expiredDate: value.expiredDate,
        })
      : await add({
          name: value.name,
          discount: parseInt(value.discount),
          couponId: value.couponId,
          expiredDate: value.expiredDate,
        });
    if (res) {
      reset({
        name: "",
        discount: "",
        couponId: "",
        expiredDate: "",
      });
      refetch();
      closeRef?.current && closeRef.current.click();
    }
  };

  useEffect(() => {
    if (editId) {
      if (inputValue !== "" || discount !== "") {
        reset({
          name: inputValue,
          discount: `${discount}`,
          couponId: couponId,
          expiredDate: formatDateToEdit(expiredDate),
        });
      }
    }
  }, [inputValue, discount, editId, couponId]);

  const formatDate = (date: any) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateToEdit = (dateString: string): string => {
    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // Months are zero-based in JS Date

    const formattedDay = String(date.getDate()).padStart(2, "0");
    const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
    const formattedYear = date.getFullYear();

    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  };

  return (
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
              discount: "",
              couponId: "",
              expiredDate: "",
            });
            setOpen(false);
            closeRef.current?.click();
          }
        }}
      >
        <SheetTrigger asChild>
          <Button ref={openSheetRef} size={"sm"}>
            <Plus /> <p className=" ms-1">Add Coupon</p>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Coupon</SheetTitle>
            <SheetDescription>
              Make new coupon here. Click save when you are done.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
            <div className=" space-y-3">
              <FormInput
                label="Coupon Name"
                className=" my-4"
                id="name"
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <p className=" text-sm text-red-500">{errors.name?.message}</p>
              )}

              <FormInput
                label="Coupon Code"
                id="Coupon Code"
                type="text"
                {...register("couponId")}
              />
              {errors.couponId && (
                <p className=" text-sm text-red-500">
                  {errors.couponId?.message}
                </p>
              )}

              <FormInput
                label="Discount"
                id="Discount"
                type="number"
                {...register("discount")}
              />
              {errors.discount && (
                <p className=" text-sm text-red-500">
                  {errors.discount?.message}
                </p>
              )}

              <FormInput
                label="Expired Date"
                id="expiredDate"
                type="date"
                {...register("expiredDate")}
              />
              {errors.expiredDate && (
                <p className=" text-sm text-red-500">
                  {errors.expiredDate?.message}
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
  );
};

export default CouponControlBar;
