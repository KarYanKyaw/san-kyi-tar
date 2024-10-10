"use client";

import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Backend_URL, getFetch, postFetch, postMediaFetch } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

const AddCustomer = () => {
  const schema = z.object({
    name: z.string().min(3, { message: "This field cannot be empty!" }),
    gender: z.string().min(1, { message: "This field cannot be empty!" }),
    phoneNumber: z.string().min(1, { message: "This field cannot be empty!" }),
    ageRange: z.string().min(1, { message: "This field cannot be empty!" }),
    specialId: z.string().min(1, { message: "This field cannot be empty!" }),
    dateOfBirth: z
      .string()
      .min(1, { message: "This field cannot be empty!" })
      .optional()
      .or(z.literal("")),
    address: z.string().optional(),
    remark: z.string().optional(),
    email: z.string().email({ message: "Invalid email format!" }).nullable(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      gender: "",
      phoneNumber: "",
      ageRange: "",
      specialId: "",
      address: "",
      remark: "",
      email: null,
      dateOfBirth: "",
    },
  });

  const getData = (url: string) => {
    return getFetch(url);
  };

  const { data: levelData, isLoading: levelLoading } = useSWR(
    `${Backend_URL}/specials/all`,
    getData
  );

  const postFetcher = async (url: string, { arg }: { arg: any }) => {
    return postFetch(url, arg);
  };

  const router = useRouter();

  const {
    data,
    isMutating,
    trigger: add,
    error,
  } = useSWRMutation(`${Backend_URL}/customers`, postFetcher);

  const dateConverter = (date: any) => {
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const onSubmit = async (value: any) => {
    value.specialId = parseInt(value.specialId);
    const res = await add(value);
    if (res) {
      router.push("/pos/app/crm");
    }
  };

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader
          parentPage="Customer"
          path="Customer"
          currentPage="Add Customer"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className=" w-1/3">
            <CardHeader className="pb-4">
              <CardTitle className=" text-lg">Customer Information</CardTitle>
              <CardDescription className=" text-sm">
                Add customer Information here.
              </CardDescription>
              {error && (
                <p className=" text-red-500 text-sm">{error.message}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-1">
              <div className=" grid grid-cols-2 gap-3">
                {/* name */}
                <div className=" flex flex-col gap-1.5 col-span-full">
                  <Label>Name</Label>
                  <Input {...register("name")} />
                  {errors.name && (
                    <p className="text-sm mt-1.5 text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* gender */}
                <div className="space-y-1 col-span-full">
                  <Label htmlFor="username">Gender</Label>
                  <div className=" border p-1 rounded">
                    <RadioGroup
                      className=" flex justify-around"
                      onValueChange={(e) => setValue("gender", e)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="Male" />
                        <Label htmlFor="Male">Male</Label>
                      </div>
                      <p className=" text-gray-200">|</p>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="Female" />
                        <Label htmlFor="Female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {errors.gender && (
                    <p className="text-sm mt-1.5 text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* mail */}
                <div className=" flex flex-col gap-1.5 col-span-1">
                  <Label>Email</Label>
                  <Input {...register("email")} />
                  {errors.email && (
                    <p className="text-sm mt-1.5 text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* phone */}
                <div className=" flex flex-col gap-1.5 col-span-1">
                  <Label>Phone</Label>
                  <Input {...register("phoneNumber")} />
                  {errors.phoneNumber && (
                    <p className="text-sm mt-1.5 text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* age */}
                <div className=" flex flex-col gap-1.5 col-span-full">
                  <Label htmlFor="username">Age</Label>
                  <Input type="date" {...register("dateOfBirth")} />
                  {errors.dateOfBirth && (
                    <p className="text-sm mt-1.5 text-red-500">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                {/* age range */}
                <div className="space-y-1 col-span-full">
                  <Label htmlFor="username">Age Range</Label>

                  <div className=" border p-1 rounded">
                    <RadioGroup
                      className=" flex justify-around"
                      onValueChange={(e) => setValue("ageRange", e)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="YOUNG" id="YOUNG" />
                        <Label htmlFor="YOUNG">Young</Label>
                      </div>
                      <p className=" text-gray-200">|</p>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MIDDLE" id="MIDDLE" />
                        <Label htmlFor="MIDDLE">Middle</Label>
                      </div>
                      <p className=" text-gray-200">|</p>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OLD" id="OLD" />
                        <Label htmlFor="OLD">Old</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {errors.ageRange && (
                    <p className="text-sm mt-1.5 text-red-500">
                      {errors.ageRange.message}
                    </p>
                  )}
                </div>

                {/* level */}
                <div className="col-span-full space-y-1.5">
                  <Label>Level</Label>
                  <Select onValueChange={(e) => setValue("specialId", e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelLoading ? (
                        <SelectItem
                          className="pointer-events-none capitalize"
                          value=" "
                        >
                          Loading...
                        </SelectItem>
                      ) : (
                        <>
                          {levelData?.data.map(({ id, name }: any) => (
                            <SelectItem key={id} value={`${id}`}>
                              {name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.specialId && (
                    <p className="text-sm mt-1.5 text-red-500">
                      {errors.specialId.message}
                    </p>
                  )}
                </div>

                {/* address */}
                <div className=" col-span-full">
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Address</Label>
                    <Textarea {...register("address")} id="address" />
                  </div>
                </div>

                {/* remark */}
                <div className=" col-span-full">
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Remark</Label>
                    <Textarea id="remark" {...register("remark")} />
                    {errors.remark && (
                      <p className="text-sm mt-1.5 text-red-500">
                        {errors.remark.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                // disabled={addLoading}
                className=" block w-full"
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Container>
  );
};

export default AddCustomer;
