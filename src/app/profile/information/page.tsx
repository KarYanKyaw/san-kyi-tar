"use client";

import { useAppProvider } from "@/app/Provider/AppProvider";
import FormInput from "@/components/FormInput.components";
import { Button } from "@/components/ui/button";
import { Backend_URL } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SweetAlert2 from "react-sweetalert2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

const UserInfoPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const getData = async (url: string) => {
    try {
      const token = isClient && localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data } = useSWR(
    userId !== null ? `${Backend_URL}/ecommerce-users/${userId}` : null,
    getData
  );

  useEffect(() => {
    if (isClient) setUserId(localStorage.getItem("userId"));
  }, [isClient]);

  const patchUser = async (url: string, { arg }: any) => {
    try {
      const token = isClient && localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(arg),
      };
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
      return response;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const {
    data: editUserData,
    error: editUserError,
    trigger: editUser,
  } = useSWRMutation(
    userId !== null ? `${Backend_URL}/ecommerce-users/${userId}` : null,
    patchUser
  );

  const schema = z.object({
    name: z.string().min(3, { message: "This field cannot be empty!" }),
    phone: z.string().min(1, { message: "This field cannot be empty!" }),
    email: z.string().email({ message: "Invalid email format!" }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  const { handleLogin } = useAppProvider();
  const router = useRouter();

  const [swalProps2, setSwalProps2] = useState({
    show: false,
    showConfirmButton: false,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!localStorage.getItem("accessToken")) {
        setSwalProps2({
          show: true,
          showConfirmButton: false,
        });
      }
    }
  }, [isClient]);

  const onSubmit = async (values: any) => {
    const res = await editUser(values);
    if (res?.ok) {
      setSwalProps({
        ...swalProps,
        show: true,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" space-y-4 w-[90%]">
          <div className=" bg-secondary border border-input px-3 font-medium lg:text-lg py-2">
            Personal Information
          </div>
          {editUserError && (
            <p className=" text-sm text-red-500">{editUserError.message}</p>
          )}
          <div className=" px-4 lg:grid-cols-2 gap-3 lg:gap-7  grid grid-cols-1">
            <div className=" space-y-0.5">
              <FormInput
                label="Name"
                {...register("name")}
                type="text"
                id={"name"}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name?.message}</p>
              )}
            </div>
            <div className=" space-y-0.5">
              <FormInput
                label="Phone"
                {...register("phone")}
                type="text"
                id={"phone"}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone?.message}</p>
              )}
            </div>
            <div className=" space-y-0.5">
              <FormInput
                label="Email"
                {...register("email")}
                type="email"
                id={"email"}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email?.message}</p>
              )}
            </div>
            <div className=" col-span-full flex justify-end">
              <Button>Save</Button>
            </div>
          </div>
        </div>
        {isClient && localStorage.getItem("accessToken") && (
          <SweetAlert2
            timer={1500}
            position="bottom-end"
            icon="success"
            iconColor="black"
            customClass={{
              popup: "colored-toast",
            }}
            toast={true}
            {...swalProps}
            didClose={() =>
              setSwalProps({
                ...swalProps,
                show: false,
              })
            }
          >
            <p>Your Information is updated!</p>
          </SweetAlert2>
        )}
      </form>
      <>
        {isClient && swalProps2.show && (
          <SweetAlert2
            didClose={() => {
              router.push("/");
            }}
            customClass={{
              popup: " w-auto",
            }}
            {...swalProps2}
          >
            <div className=" pointer-events-none space-y-3 text-center">
              <p className=" pointer-events-none font-medium">
                Please Login To Continue.
              </p>

              <div className="  pointer-events-none flex gap-3 justify-center items-center">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSwalProps2({
                      ...swalProps2,
                      show: false,
                    });
                    router.push("/");
                  }}
                  size={"sm"}
                  className=" pointer-events-auto"
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    handleLogin();
                    e.stopPropagation();
                    setSwalProps2({
                      ...swalProps2,
                      show: false,
                    });
                  }}
                  size={"sm"}
                  className=" pointer-events-auto"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </SweetAlert2>
        )}
      </>
    </>
  );
};

export default UserInfoPage;
