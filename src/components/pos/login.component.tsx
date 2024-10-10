"use client";

import { Button } from "@/components/ui/button";
import FormInput from "../FormInput.components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Backend_URL, fetchApi } from "@/lib/api";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { login } from "@/lib/lib";
import Image from "next/image";
import image1 from "../../../public/image1.png";
import image2 from "../../../public/image2.png";
import image3 from "../../../public/image3.png";
import image4 from "../../../public/image4.png";
import image5 from "../../../public/image5.png";
import image6 from "../../../public/image6.png";

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginFetch = async (
    url: string,
    { arg }: { arg: { email: string; password: string } }
  ) => {
    return login(arg.email, arg.password);
  };

  const { data, error, isMutating, trigger } = useSWRMutation(
    `${Backend_URL}/auth/login`,
    loginFetch
  );

  const onSubmit = async (data: { email: string; password: string }) => {
    const res = await trigger({ email: data.email, password: data.password });
    if (res) {
      router.push("/pos/app/sale");
    }
  };

  return (
    <div className="grid grid-cols-12 h-screen items-center">
      <div className="col-span-6 h-full border-e flex justify-center items-center">
        <div className="w-full h-full overflow-hidden relative">
          <div className="grid grid-cols-5 md:gap-5 gap-2 md:w-[100vw] w-[150vw] h-full tile-box">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="col-span-1 tiles">
                <div className="w-full h-full flex flex-col md:gap-5 gap-2">
                  {[image1, image2, image3, image4, image5, image6].map(
                    (el, index) => (
                      <Image key={index} src={el} alt="home" />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-6 h-full">
        <div className="flex justify-center h-full flex-col items-center">
          <div className="col-span-full w-[80%] mx-auto">
            <div className="text-start mb-3">
              <p className="text-3xl mb-1.5 tracking-wider font-semibold">
                Boss Nation
              </p>
              <p className="text-sm tracking-wider font-medium">
                Welcome Back!
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormInput
                  label={"Email"}
                  id={"email"}
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
                <div className="space-y-3">
                  <FormInput
                    id="password"
                    label={"Password"}
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="block mt-11 w-full"
                disabled={isMutating}
              >
                {isMutating ? "Logging in..." : "Login to account"}
              </Button>
              {error && (
                <p className="mt-3 text-red-500">
                  Login failed. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
