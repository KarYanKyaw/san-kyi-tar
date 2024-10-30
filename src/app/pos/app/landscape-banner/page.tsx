"use client";

import Container from "@/components/Container.components";
import React, { useEffect, useRef, useState } from "react";
import NavHeader from "@/components/pos/NavHeader";
import { Button } from "@/components/ui/button";
import { Edit2, MinusCircle, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import ConfirmBox from "@/components/ConfirmBox";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import {
  Backend_URL,
  deleteSingleFetch,
  getFetch,
  postMediaFetch,
  putMediaFetch,
} from "@/lib/fetch";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePond } from "react-filepond";
import useSWRMutation from "swr/mutation";

const Page = () => {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openRef = useRef<HTMLButtonElement | null>(null);

  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  const [editId, setEditId] = useState<any>({
    status: false,
    id: "",
  });

  const [brandImageToShow, setBrandImageToShow] = useState<any>();
  const [brandImageToShow2, setBrandImageToShow2] = useState<any>();

  const [open, setOpen] = useState(false);

  const schema = z.object({
    image1: editId?.status
      ? z.union([z.string().nullable(), z.any()])
      : z
          .any()
          .refine((files) => files?.length === 1, {
            message: "Image is required.",
          })
          .refine((files) => validImageTypes.includes(files?.[0]?.type), {
            message: ".jpg, .jpeg, and .png files are accepted.",
          }),

    image2: editId?.status
      ? z.union([z.string().nullable(), z.any()])
      : z
          .any()
          .refine((files) => files?.length === 1, {
            message: "Image is required.",
          })
          .refine((files) => validImageTypes.includes(files?.[0]?.type), {
            message: ".jpg, .jpeg, and .png files are accepted.",
          }),
  });

  type FormData = z.infer<typeof schema>;

  const getData = async (url: string) => {
    return getFetch(url);
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${Backend_URL}/landscape-banners`,
    getData,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
      revalidateOnMount: true,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      image1: brandImageToShow || undefined,
      image2: brandImageToShow || undefined,
    },
  });

  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postMediaFetch(url, arg);
  };

  const {
    trigger: addPhoto,
    error: addError,
    isMutating,
  } = useSWRMutation(`${Backend_URL}/landscape-banners`, postFetcher);

  const handleFileUpdateOne = (fileItems: any) => {
    // Extract valid file objects from the fileItems array
    const validFiles = fileItems.map((fileItem: any) => {
      // FilePond sometimes wraps files, so unwrap if necessary
      return fileItem.file instanceof File ? fileItem.file : fileItem.file.file;
    });

    // Set files to the state to preview
    setBrandImageToShow(validFiles);

    // Set the form value for validation
    setValue("image1", validFiles, { shouldValidate: true });
  };

  const handleFileUpdateTwo = (fileItems: any) => {
    // Extract valid file objects from the fileItems array
    const validFiles = fileItems.map((fileItem: any) => {
      // FilePond sometimes wraps files, so unwrap if necessary
      return fileItem.file instanceof File ? fileItem.file : fileItem.file.file;
    });

    // Set files to the state to preview
    setBrandImageToShow2(validFiles);

    // Set the form value for validation
    setValue("image2", validFiles, { shouldValidate: true });
  };

  const singleDeleteFetcher = async (url: string) => {
    return deleteSingleFetch(url);
  };

  const [deleteId, setDeleteId] = useState<number | undefined>();

  const { error: singleDeleteError, trigger: singleDrop } = useSWRMutation(
    `${Backend_URL}/landscape-banners/${deleteId}`,
    singleDeleteFetcher
  );

  const handleSingleDelete = async () => {
    const res = await singleDrop();
    if (res.status) setDeleteId(undefined);
    mutate();
  };

  const { data: singleData, mutate: editMutate } = useSWR(
    editId.status ? `${Backend_URL}/landscape-banners/${editId.id}` : null,
    getData,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
      dedupingInterval: 0,
      onSuccess: () =>
        editId.status && openRef.current && openRef.current.click(),
    }
  );

  const handleEdit = (id: any): void => {
    setEditId({
      status: true,
      id,
    });
    editMutate();
  };

  const putFetcher = async (url: string, { arg }: { arg: any }) => {
    return putMediaFetch(url, arg);
  };

  useEffect(() => {
    if (singleData) {
      setBrandImageToShow(singleData?.desktopImage);
      setBrandImageToShow2(singleData?.mobileImage);
    }
  }, [singleData]);

  const { trigger: edit, isMutating: editMutating } = useSWRMutation(
    `${Backend_URL}/landscape-banners/${editId.id}`,
    putFetcher,
    {
      onSuccess: () => closeRef.current?.click(),
    }
  );

  const onSubmit = async (value: FormData) => {
    if (editId.status) {
      const formData = new FormData();

      if (typeof brandImageToShow !== "string") {
        formData.append("desktopImage", value.image1[0]);
      }
      if (typeof brandImageToShow2 !== "string") {
        formData.append("mobileImage", value.image2[0]);
      }

      const res = await edit(formData);
      if (res?.status) {
        closeRef?.current && closeRef.current.click();
      }
    }

    const formData = new FormData();
    formData.append("desktopImage", value.image1[0]);
    formData.append("mobileImage", value.image2[0]);

    const res = await addPhoto(formData);
    if (res?.status) {
      closeRef?.current && closeRef.current.click();
    }
  };

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader
          parentPage="Landscape Banner"
          path="E-commerce"
          currentPage="Landscape Banner List"
        />
      </div>
      <div className=" flex justify-end">
        <Button onClick={() => openRef.current && openRef.current.click()}>
          <PlusCircle /> <span className=" ms-2">Add Banner</span>
        </Button>
      </div>
      <div className=" mt-6 min-h-[780px]">
        <Table>
          <TableHeader className="hover:bg-white z-50">
            <TableRow className="hover:bg-white bg-white">
              <TableHead className=" w-[50px]">No</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead className=" text-end">Date</TableHead>
              <TableHead className=" w-[200px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((data: any, index: number) => (
              <TableRow
                key={index}
                className=" bg-white cursor-pointer hover:bg-white/50"
              >
                <TableCell>{index + 1}.</TableCell>
                <TableCell className=" text-end">
                  <Image
                    src={data?.desktopImage}
                    width={150}
                    height={150}
                    alt=""
                  />
                </TableCell>

                <TableCell className=" text-end">{data.date}</TableCell>

                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end">
                    {/* <Button
                      variant={"ghost"}
                      className="!p-0"
                      onClick={() => handleEdit(data.id)}
                    >
                      <Edit2 />
                    </Button> */}

                    <ConfirmBox
                      buttonName={<MinusCircle />}
                      buttonSize="sm"
                      buttonVariant={"ghost"}
                      confirmTitle={"Are you sure?"}
                      confirmDescription={"This action can't be undone!"}
                      confirmButtonText={"Yes, delete this."}
                      run={async () => {
                        await setDeleteId(data.id);
                        handleSingleDelete();
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setBrandImageToShow(undefined);
          setBrandImageToShow2(undefined);
        }}
      >
        <SheetTrigger className=" relative hidden" asChild>
          <Button ref={openRef}>hello</Button>
        </SheetTrigger>
        <SheetContent className=" w-[90%] lg:w-2/3 space-y-2">
          <SheetHeader>
            <SheetTitle className=" text-start !pb-0">Add Banner</SheetTitle>
            <SheetDescription className=" text-start">
              Make Banner here. Click save when you are done.
            </SheetDescription>
          </SheetHeader>

          <div className=" my-12"></div>

          <form className=" h-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5 h-[85%] pb-4 overflow-auto ">
              <div className="space-y-3">
                <Label className="flex items-center gap-1">
                  For Desktop Size
                </Label>
                <FilePond
                  className=" !rounded-md"
                  allowMultiple={false}
                  onupdatefiles={(fileItems: any) => {
                    handleFileUpdateOne(fileItems);
                    const validFiles = fileItems.map((fileItem: any) => ({
                      file:
                        fileItem.file instanceof File
                          ? fileItem.file
                          : (fileItem.file.file as File),
                    }));
                  }}
                  allowDrop={true}
                  server={null}
                  instantUpload={false}
                />
                <>
                  {typeof brandImageToShow === "string" ? (
                    <Image
                      src={brandImageToShow}
                      alt=""
                      className=" w-full h-[300px] object-contain"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <>
                      {brandImageToShow?.length > 0 && (
                        <Image
                          src={URL?.createObjectURL(brandImageToShow[0])}
                          alt=""
                          className=" w-full h-[300px] object-contain"
                          width={300}
                          height={300}
                        />
                      )}
                    </>
                  )}
                </>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-1">
                  For Phone Size
                </Label>
                <FilePond
                  className=" !rounded-md"
                  allowMultiple={false}
                  onupdatefiles={(fileItems: any) => {
                    handleFileUpdateTwo(fileItems);
                    const validFiles = fileItems.map((fileItem: any) => ({
                      file:
                        fileItem.file instanceof File
                          ? fileItem.file
                          : (fileItem.file.file as File),
                    }));
                  }}
                  allowDrop={true}
                  server={null}
                  instantUpload={false}
                />
                <>
                  {typeof brandImageToShow2 === "string" ? (
                    <Image
                      src={brandImageToShow2}
                      alt=""
                      className=" w-full h-[300px] object-contain"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <>
                      {brandImageToShow2?.length > 0 && (
                        <Image
                          src={URL?.createObjectURL(brandImageToShow2[0])}
                          alt=""
                          className=" w-full h-[300px] object-contain"
                          width={300}
                          height={300}
                        />
                      )}
                    </>
                  )}
                </>
              </div>

              {errors.image1 && (
                <p className=" text-sm text-red-500">
                  {errors.image1.message as string}
                </p>
              )}
            </div>
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  closeRef.current && closeRef.current.click();
                  setEditId({ status: false, id: "" });
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
                Save
              </Button>
            </div>

            {addError && (
              <p className=" text-red-500 text-sm">{addError?.message}</p>
            )}
          </form>

          <SheetFooter className={" !justify-between hidden items-center"}>
            <SheetClose ref={closeRef} asChild>
              <Button className="hidden" variant="link">
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
    </Container>
  );
};

export default Page;
