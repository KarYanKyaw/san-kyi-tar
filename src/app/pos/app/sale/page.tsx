"use client";

import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import SaleInfoBox from "@/components/pos/sale/SaleInfoBox";
import SaleTable from "@/components/pos/sale/SaleTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Backend_URL, getFetch } from "@/lib/fetch";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Check, Plus, PlusCircle } from "lucide-react";
import React, { useEffect, useRef, useState, FormEvent } from "react";
import useSWR from "swr";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
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
import AddCustomerForm from "@/components/pos/crm/AddCustomerForm";

interface Customer {
  id: string;
  name: string;
  level: string;
  phoneNumber: string;
  promotionRate: number;
  special: any;
}

interface BarcodeState {
  status: boolean;
  code: string;
}

interface Product {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  discountByValue: number;
  cost: number;
  productCategory: string;
  productFitting: string;
  productType: string;
  gender: string;
  productSizing: string;
  discount: number;
}

interface customerInfoData {
  name: string | undefined;
  phone: string | undefined;
}

const SaleForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [customers, setCustomer] = useState<string>("");
  const [data, setData] = useState<Product[]>([]);
  const [customerPromotion, setCustomerPromotion] = useState<
    number | undefined
  >();

  const [customerInfoData, setCustomerData] = useState<customerInfoData>({
    name: "",
    phone: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    customer: {
      customerId: "",
      amount: 0,
    },
    type: "offline",
    payment_method: "cash",
    discountByValue: 0,
    discount: 0,
    tax: false,
  });

  const barcodeRef = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState<BarcodeState>({
    status: false,
    code: "",
  });

  const getData = (url: string) => {
    return getFetch(url);
  };

  const {
    data: customerData,
    error: customerError,
    isLoading: customerLoading,
    mutate,
  } = useSWR(`${Backend_URL}/customers/all`, getData);

  const {
    data: productData,
    error: productError,
    isLoading: productLoading,
  } = useSWR(
    barcode.status ? `${Backend_URL}/vouchers/barcode/${barcode.code}` : null,
    getData,
    {
      errorRetryCount: 0,
    }
  );

  const submitBarcode = (e: FormEvent) => {
    e.preventDefault();
    if (barcodeRef.current) {
      setBarcode({
        status: true,
        code: barcodeRef.current.value,
      });
    }
  };

  useEffect(() => {
    if (barcodeRef.current) {
      barcodeRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (productError) {
      if (barcodeRef.current) {
        barcodeRef.current.value = "";
        barcodeRef.current.focus();
      }
      return;
    }
    if (productData && !productLoading && !productError) {
      const productExists = data.some(
        (product) => product.id === productData.id
      );

      if (productExists) {
        if (barcodeRef.current) {
          barcodeRef.current.value = "";
          barcodeRef.current.focus();
        }
      } else {
        const newData = {
          ...productData,
          quantity: 1,
          discountByValue: 0,
        };

        newData.cost = newData.quantity * newData.price;
        newData.discount = productData.discountPrice || 0;

        setData([...data, newData]);
        if (barcodeRef.current) {
          barcodeRef.current.focus();
          barcodeRef.current.value = "";
        }
      }

      setBarcode({
        status: false,
        code: "",
      });
    }
  }, [productData, productLoading, productError, barcodeRef]);

  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openRef = useRef<HTMLButtonElement | null>(null);

  const refetch = async () => {
    mutate();
  };

  const handleClose = () => {
    closeRef.current && closeRef.current.click();
    refetch();
    setOpen(false);
  };

  const { data: userData, isLoading } = useSWR(
    `${Backend_URL}/users/me`,
    getData
  );

  return (
    <Container className=" h-screen">
      <div className=" relative w-full h-[95%]">
        <NavHeader parentPage="Sale" path="Sale" />
        <div className=" grid grid-cols-12 mt-4 gap-5">
          <div className=" col-span-9 space-y-3">
            <p className=" text-2xl font-bold">Receipt Voucher List</p>
            <SaleTable data={data} setData={setData} />
          </div>

          <div className="space-y-2 col-span-3">
            <p className=" text-2xl font-bold">Information</p>

            <form onSubmit={submitBarcode}>
              <div className=" flex flex-col gap-3">
                {/* tax */}
                <div className=" flex justify-center gap-3">
                  <Label htmlFor="tax">Tax</Label>
                  <Switch
                    id="tax"
                    checked={paymentInfo.tax}
                    onCheckedChange={() =>
                      setPaymentInfo({
                        ...paymentInfo,
                        tax: !paymentInfo.tax,
                      })
                    }
                  />
                </div>

                {/* customer */}
                <div className="space-y-1.5">
                  <div className=" flex gap-3 justify-between">
                    <Label htmlFor="Customer">Select Customer</Label>

                    <div className=" text-end text-sm">
                      {customerPromotion} %
                    </div>
                  </div>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full text-sm  justify-between !rounded-md"
                      >
                        {customers ? customers : "Customers"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command className=" relative">
                        <CommandInput
                          placeholder="Search customers..."
                          className="h-9"
                        />
                        <CommandEmpty>
                          No customers found!
                          <Button
                            onClick={() => openRef.current?.click()}
                            variant={"ghost"}
                            className=" flex gap-1 my-3 items-center w-full"
                          >
                            <PlusCircle /> <span>Add New Customer</span>
                          </Button>
                        </CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            <Label className=" ps-8 !py-3 text-lg text-neutral-500">
                              Customer List
                            </Label>
                            {!customerLoading &&
                              customerData?.map(
                                ({ id, name, phoneNumber }: any) => (
                                  <CommandItem
                                    className={cn(
                                      customers === name ? "bg-accent" : ""
                                    )}
                                    key={id}
                                    value={name}
                                    onSelect={(e) => {
                                      setCustomerPromotion(
                                        customerData?.find(
                                          (el: any) => el.id == id
                                        )?.special.promotionRate
                                      );
                                      setCustomerData({
                                        name: customerData?.find(
                                          (el: any) => el.id == id
                                        )?.name,
                                        phone: customerData?.find(
                                          (el: any) => el.id == id
                                        )?.phoneNumber,
                                      });
                                      setPaymentInfo({
                                        ...paymentInfo,
                                        customer: {
                                          customerId: id,
                                          amount: customerData?.find(
                                            (el: any) => el.id == id
                                          )?.special.promotionRate,
                                        },
                                      });
                                      setCustomer(`${e}`);
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        customers === name
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {name} {phoneNumber}
                                  </CommandItem>
                                )
                              )}
                            <div className=" my-[90px]"></div>
                            <div className=" absolute bg-white w-full bottom-0">
                              <Label className=" block py-1 ps-8 text-lg text-neutral-500">
                                Add Customer
                              </Label>
                              <Button
                                onClick={() => openRef.current?.click()}
                                variant={"ghost"}
                                className=" flex gap-1 items-center w-full"
                              >
                                <PlusCircle /> <span>Add New Customer</span>
                              </Button>
                            </div>
                            <Sheet>
                              <SheetTrigger className=" relative" asChild>
                                <Button
                                  ref={openRef}
                                  variant={"ghost"}
                                  className=" hidden gap-1 items-center w-full"
                                >
                                  <PlusCircle /> <span>Add New Customer</span>
                                </Button>
                              </SheetTrigger>
                              <SheetContent className=" w-[90%] h-full overflow-auto lg:w-2/3 space-y-2">
                                <SheetHeader>
                                  <SheetTitle className=" text-start !pb-0">
                                    Add New Customer
                                  </SheetTitle>
                                  <SheetDescription className="!mt-0 text-start">
                                    Make new Customer here. Click save when
                                    you&apos;re done.
                                  </SheetDescription>
                                </SheetHeader>
                                <AddCustomerForm
                                  handleClose={handleClose}
                                  closeRef={closeRef}
                                />
                                <SheetFooter className=" hidden">
                                  <SheetClose asChild>
                                    <Button ref={closeRef} variant="link">
                                      Cancel
                                    </Button>
                                  </SheetClose>
                                  <Button>Save changes</Button>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className=" flex flex-col gap-1.5">
                    <Label htmlFor="Type">Type</Label>
                    <Select
                      defaultValue={paymentInfo.type}
                      onValueChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          type: e,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className=" flex flex-col gap-1.5">
                    <Label>Method</Label>
                    <Select
                      defaultValue={paymentInfo.payment_method}
                      onValueChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          payment_method: e,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="wallet">Wallet</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className=" grid grid-cols-2 gap-3">
                  {/* discount % */}
                  <div className=" flex flex-col gap-1.5">
                    <Label htmlFor="discount">Disc %</Label>
                    <Input
                      id="discount"
                      type="number"
                      className="h-9 "
                      value={paymentInfo.discount}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          discount: parseFloat(e.target.value),
                          discountByValue: 0,
                        })
                      }
                    />
                  </div>

                  <div className=" flex flex-col gap-1.5">
                    <Label htmlFor="discountValue">Disc</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      className="h-9 "
                      value={paymentInfo.discountByValue}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          discountByValue: parseFloat(e.target.value),
                          discount: 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className=" flex flex-col gap-1.5">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input ref={barcodeRef} id="barcode" className="h-9" />
                </div>

                {/* <div className=" flex flex-col gap-1.5">
                  <Label htmlFor="remark">Remark</Label>
                  <Textarea className=" bg-white" id="remark" />
                </div> */}

                <Button disabled={productLoading} type="submit" size="sm">
                  {productLoading ? (
                    "Loading"
                  ) : (
                    <>
                      <span className=" me-1"> Add Product</span> <Plus />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {productError && (
              <p className="text-red-500">{productError.message}</p>
            )}

            {customerError && (
              <p className="text-red-500">
                Customer Data has {customerError.message}
              </p>
            )}
          </div>
        </div>
        <div className=" absolute bottom-0 w-full">
          <SaleInfoBox
            setPaymentInfo={setPaymentInfo}
            loyaltyDiscount={customerPromotion}
            discountByValue={paymentInfo.discountByValue}
            discount={paymentInfo.discount}
            data={data}
            setData={setData}
            paymentInfo={paymentInfo}
            paymentType={paymentInfo.payment_method}
            customerInfoData={customerInfoData}
            setCustomerPromotion={setCustomerPromotion}
            salePerson={userData?.name}
          />
        </div>
      </div>
    </Container>
  );
};

export default SaleForm;
