"use client";

import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import React, { useEffect, useRef, useState } from "react";
import { Backend_URL, getFetch, postMediaFetch, putFetch } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Check, Plus, PlusCircle } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import FormInput from "@/components/FormInput.components";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { PaginationComponent } from "@/components/pos/inventory";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const StockControlPage = () => {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [searchInputValue, setSearchInputValue] = useState<string>("");

  // for fetching
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("createdAt");
  const [sortBy, setSortBy] = useState("desc");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<string>("");

  const filterTable = (value: string) => {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
    setFilterType(value);
  };

  // for pagination
  const incrementPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const decrementPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToLastPage = () => {
    setCurrentPage(data?.totalPages);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const getData = (url: string) => {
    return getFetch(url);
  };

  const [debouncedValue, setDebouncedValue] = useState(searchInputValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchInputValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInputValue]); // Only call effect if value changes

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${Backend_URL}/stock-reports?page=${currentPage}&search=${debouncedValue}`,
    getData,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryInterval: 5000,
      revalidateOnMount: true,
      refreshWhenHidden: true,
    }
  );

  const [editId, setEditId] = useState({
    status: false,
    id: "",
  });

  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [image, setImage] = useState<File | undefined | string>(undefined);

  const { data: sizeData } = useSWR(
    `${Backend_URL}/product-sizings/all`,
    getData
  );

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  const schema = z.object({
    image:
      typeof window !== "undefined"
        ? z
            .instanceof(File)
            .refine(
              (file) => validImageTypes.includes(file.type),
              ".jpg, .jpeg and .png files are accepted."
            )
            .optional()
        : z.any(),
    shopCode:
      typeof window !== "undefined"
        ? z.string().min(2, { message: "This field cannot be empty!" })
        : z.any(),
    colorCode:
      typeof window !== "undefined"
        ? z.string().min(2, { message: "This field cannot be empty!" })
        : z.any(),
    barcode:
      typeof window !== "undefined"
        ? z.string().min(2, { message: "This field cannot be empty!" })
        : z.any(),
    productSizingId:
      typeof window !== "undefined"
        ? z.number().min(1, { message: "This field cannot be empty!" })
        : z.any(),
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
      image: undefined,
      shopCode: "",
      colorCode: "",
      barcode: "",
      productSizingId: parseInt(""),
    },
  });

  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postMediaFetch(url, arg);
  };

  const {
    data: putData,
    trigger: add,
    error: addError,
  } = useSWRMutation(`${Backend_URL}/product-variants`, postFetcher);

  const onSubmit = async (value: any) => {
    const formData = new FormData();
    formData.append("image", value.image);
    formData.append("shopCode", value.shopCode);
    formData.append("colorCode", value.colorCode);
    formData.append("barcode", value.barcode);
    formData.append("productSizingId", value.productSizingId);
    formData.append("productId", `${editId.id}`);

    const res = await add(formData);
    if (res.status) {
      closeRef.current && closeRef.current.click();
      reset({
        image: undefined,
        shopCode: "",
        colorCode: "",
        barcode: "",
        productSizingId: parseInt(""),
      });
      mutate(`${Backend_URL}/stock-reports?page=${currentPage}`);
      setImage("");
      setSize("");
    }
  };

  const startIndex = (currentPage - 1) * 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
  };

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader parentPage="Stock" path="Stock Control" />
        <div className="flex justify-between">
          <div className="">
            <Input
              placeholder="Search..."
              value={debouncedValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {isLoading ? (
          <TableSkeletonLoader />
        ) : (
          <div className=" space-y-4">
            <div className=" min-h-[740px]">
              <Table>
                <TableHeader className="hover:bg-white z-50">
                  <TableRow className="hover:bg-white bg-white">
                    <TableHead>
                      <span>No</span>
                    </TableHead>

                    <TableHead>
                      <div
                        // onClick={() => filterTable("name")}
                        className="flex gap-1 cursor-pointer select-none items-center"
                      >
                        <span>Product</span> <CaretSortIcon />
                      </div>
                    </TableHead>
                    <TableHead className=" text-end">Sale Price</TableHead>
                    <TableHead className=" text-end">Total Stock</TableHead>
                    <TableHead className=" text-end">Stock Level</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.products &&
                    data?.products.map(
                      (
                        {
                          id,
                          name,
                          totalStock,
                          salePrice,
                          stockLevel,
                          gender,
                          productCategory,
                          productFitting,
                          productType,
                        }: {
                          id: any;
                          name: string;
                          salePrice: number;
                          stockLevel: string;
                          benefit: number;
                          gender: string;
                          productBrand: string;
                          productCategory: string;
                          productFitting: string;
                          productType: string;
                          totalStock: number;
                        },
                        index: any
                      ) => (
                        <TableRow
                          className=" bg-white cursor-pointer hover:bg-white/50"
                          key={id}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span>{index + startIndex + 1}.</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className=" flex items-center gap-3">
                              <div className=" flex gap-1.5 flex-col">
                                <p className=" capitalize">{name}</p>
                                <div className=" flex gap-1">
                                  <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                                    {gender.toLocaleLowerCase()}
                                  </div>
                                  <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                                    {productType}
                                  </div>
                                  <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                                    {productCategory}
                                  </div>
                                  <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                                    {productFitting}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className=" text-end">
                            {new Intl.NumberFormat("ja-JP").format(salePrice)}
                          </TableCell>
                          <TableCell className=" text-end">
                            {totalStock}
                          </TableCell>
                          <TableCell className=" text-end">
                            <Badge
                              className={`${
                                stockLevel == "LowStock" && "!bg-red-400"
                              }
                        ${stockLevel == "InStock" && "!bg-green-400"}
                        ${stockLevel == "SoldOut" && "!bg-black"}
                        `}
                            >
                              {stockLevel}
                            </Badge>
                          </TableCell>

                          <TableCell
                            onClick={() => setEditId({ ...editId, id })}
                          >
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="outline" size={"sm"}>
                                  <Plus /> <p className=" ms-1">Add Stock</p>
                                </Button>
                              </SheetTrigger>
                              <SheetContent side={"bottom"}>
                                <SheetHeader>
                                  <SheetTitle>Add Stock</SheetTitle>
                                  <SheetDescription>
                                    Add Stock here. Click add when you are done.
                                  </SheetDescription>
                                </SheetHeader>
                                <hr className=" mt-3" />
                                <form
                                  className=" p-5 my-3 rounded"
                                  onSubmit={handleSubmit(onSubmit)}
                                >
                                  <div
                                    className="flex justify-around"
                                    style={{ alignItems: "flex-end" }}
                                  >
                                    <div className="block border rounded-full">
                                      <div
                                        onClick={() =>
                                          inputRef.current?.click()
                                        }
                                        className="flex justify-center items-center cursor-pointer h-10 w-10 bg-white rounded-full"
                                      >
                                        {image ? (
                                          typeof image === "string" ? (
                                            <Avatar>
                                              <AvatarImage
                                                className="object-cover"
                                                src={image as string}
                                              />
                                            </Avatar>
                                          ) : (
                                            <Avatar>
                                              <AvatarImage
                                                className="object-cover"
                                                src={URL.createObjectURL(
                                                  image as File
                                                )}
                                              />
                                            </Avatar>
                                          )
                                        ) : (
                                          <Camera />
                                        )}
                                      </div>
                                      <div className="hidden">
                                        <input
                                          type="file"
                                          id="image"
                                          ref={inputRef}
                                          name={name}
                                          onChange={(e) => {
                                            if (e.target.files) {
                                              const file = e.target.files[0];
                                              setValue("image", file);
                                              setImage(file);
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <FormInput
                                      className="  "
                                      label="Shop Code"
                                      id="shopCode"
                                      type="text"
                                      {...register("shopCode")}
                                    />

                                    <FormInput
                                      className=" "
                                      label="Color Code"
                                      id="color_code"
                                      type="text"
                                      {...register("colorCode")}
                                    />

                                    <div className="space-y-1.5 flex flex-col ">
                                      <Label>Select Size</Label>

                                      <Popover
                                        open={open}
                                        onOpenChange={setOpen}
                                      >
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-[200px] justify-between !rounded-md"
                                          >
                                            {size ? size : "Sizes"}
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                          <Command
                                            defaultValue={`${getValues(
                                              "productSizingId"
                                            )}`}
                                          >
                                            <CommandInput
                                              placeholder="Search Size..."
                                              className="h-9"
                                            />
                                            <CommandEmpty>
                                              No sizes found!
                                            </CommandEmpty>
                                            <CommandGroup>
                                              <CommandList>
                                                {sizeData?.data.map(
                                                  ({ id, name }: any) => (
                                                    <CommandItem
                                                      className={cn(
                                                        size === name
                                                          ? "bg-accent"
                                                          : ""
                                                      )}
                                                      key={id}
                                                      value={name}
                                                      onSelect={(e) => {
                                                        setSize(e);
                                                        setValue(
                                                          "productSizingId",
                                                          parseInt(id)
                                                        );
                                                        setOpen(false);
                                                      }}
                                                    >
                                                      <Check
                                                        className={cn(
                                                          "mr-2 h-4 w-4",
                                                          size === name
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                      />
                                                      {name}
                                                    </CommandItem>
                                                  )
                                                )}
                                              </CommandList>
                                            </CommandGroup>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>
                                    </div>

                                    <FormInput
                                      className=" "
                                      label="Barcode"
                                      id="barcode"
                                      {...register("barcode")}
                                      type="text"
                                    />

                                    <Button>
                                      <span className=" me-2">Add</span>{" "}
                                      <Plus />
                                    </Button>
                                  </div>
                                </form>
                                {addError && (
                                  <p className=" text-red-500 text-sm">
                                    {addError.message}
                                  </p>
                                )}
                                <SheetFooter
                                  className={
                                    "flex !justify-between items-center"
                                  }
                                >
                                  <SheetClose asChild>
                                    <Button
                                      className="hidden"
                                      ref={closeRef}
                                      variant="link"
                                    >
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
                          </TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </div>
            <PaginationComponent
              goToFirstPage={goToFirstPage}
              currentPage={currentPage}
              decrementPage={decrementPage}
              incrementPage={incrementPage}
              goToLastPage={goToLastPage}
              lastPage={data?.totalPages}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default StockControlPage;
