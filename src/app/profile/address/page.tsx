"use client";

import { useAppProvider } from "@/app/Provider/AppProvider";
import FormInput from "@/components/FormInput.components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Backend_URL } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SweetAlert2 from "react-sweetalert2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

const UserAddressPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { handleLogin } = useAppProvider();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const patchData = async (url: string, { arg }: any) => {
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

  const deleteData = async (url: string, { arg }: any) => {
    try {
      const token = isClient && localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
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

  const postData = async (url: string, { arg }: { arg: any }) => {
    try {
      const token = isClient && localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "POST",
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
      return data;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setUserId(localStorage.getItem("userId"));
      if (!localStorage.getItem("accessToken")) {
        router.push("/shopping-bag");
      }
    }
  }, [isClient]);

  const {
    data: addressData,
    isLoading: addressLoading,
    mutate,
  } = useSWR(userId !== null ? `${Backend_URL}/address` : null, getData);

  useEffect(() => {
    if (addressData) {
      setSelectedAddress(`${addressData[0]?.id}`);
    }
  }, [addressData]);

  const {
    data: addAddressData,
    error: addAddressError,
    trigger: addAddress,
    isMutating: addingAddress,
  } = useSWRMutation(
    selectedAddress !== "" ? `${Backend_URL}/address` : null,
    postData
  );

  const {
    data: editAddressData,
    error: editAddressError,
    trigger: editAddress,
    isMutating: editingAddress,
  } = useSWRMutation(
    selectedAddress !== "" ? `${Backend_URL}/address/${selectedAddress}` : null,
    patchData
  );

  const {
    data: editAddressDeleteData,
    error: editAddressDeleteError,
    trigger: deleteAddress,
  } = useSWRMutation(
    selectedAddress !== "" ? `${Backend_URL}/address/${selectedAddress}` : null,
    deleteData
  );

  const schema = z.object({
    city: z.string().min(1, { message: "This field cannot be empty!" }),
    township: z.string().min(1, { message: "This field cannot be empty!" }),
    street: z.string().min(1, { message: "This field cannot be empty!" }),
    company: z.string().optional(),
    addressDetail: z
      .string()
      .min(1, { message: "This field cannot be empty!" }),
  });
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: "",
      township: "",
      street: "",
      company: "",
      addressDetail: "",
    },
  });

  const [swalProps2, setSwalProps2] = useState({
    show: false,
    showConfirmButton: false,
  });

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  useEffect(() => {
    if (isClient) {
      if (!localStorage.getItem("accessToken")) {
        setSwalProps({
          show: true,
          showConfirmButton: false,
        });
      }
    }
  }, [isClient]);

  const handleEdit = (id: any) => {
    setOpen(true);
    setIsEditing(true);
    const data = addressData?.find((el: any) => el.id == id);
    if (data) {
      reset({
        city: data.city || "",
        company: data.company || "",
        addressDetail: data.addressDetail || "",
        street: data.street || "",
        township: data.township || "",
      });
    }
  };

  const onSubmit = async (value: any) => {
    const res = isEditing ? await editAddress(value) : await addAddress(value);
    if (res) {
      setIsEditing(false);
      setOpen(false);
      mutate();
    }
  };

  return (
    <div>
      <div className=" space-y-4 w-[90%]">
        <div className=" bg-secondary border border-input px-3 font-medium lg:text-lg py-2">
          Delivery Address
        </div>
        <div className=" space-y-3 px-4">
          <RadioGroup
            defaultValue={selectedAddress}
            value={selectedAddress}
            onValueChange={(e) => setSelectedAddress(e)}
            className=" space-y-2"
          >
            {addressLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {addressData?.map(
                  ({
                    id,
                    city,
                    company,
                    street,
                    township,
                    addressDetail,
                  }: any) => (
                    <div
                      key={id}
                      className="flex items-center justify-between space-x-2"
                    >
                      <div className=" flex items-center gap-2">
                        <RadioGroupItem value={`${id}`} id={id} />
                        <Label htmlFor={id}>
                          {addressDetail}, {street} , {township} , {city},{" "}
                          {company}
                        </Label>
                      </div>
                      <div className=" flex items-center">
                        <Button
                          size={"sm"}
                          disabled={editingAddress}
                          onClick={() => {
                            handleEdit(id);
                            setSelectedAddress(`${id}`);
                          }}
                          variant={"ghost"}
                        >
                          Edit
                        </Button>
                        <p className=" text-neutral-400">|</p>

                        <Button
                          disabled={editingAddress}
                          onClick={async () => {
                            await setSelectedAddress(id);
                            const res = await deleteAddress();
                            if (res) mutate();
                          }}
                          size={"sm"}
                          className=" text-red-500 hover:text-red-500"
                          variant={"ghost"}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </RadioGroup>
          {!open && (
            <Button variant={"ghost"} onClick={() => setOpen(true)}>
              <Plus /> <span className=" ms-3">Add new address</span>
            </Button>
          )}
        </div>
      </div>

      {open && (
        <div className=" mt-4">
          <div className=" w-[90%] space-y-4">
            {open && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className=" px-4 lg:grid-cols-2 gap-3 lg:gap-7 grid grid-cols-1"
              >
                <div className=" space-y-1.5">
                  <FormInput
                    label="City"
                    type="text"
                    {...register("city")}
                    id={"City"}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs">
                      {errors.city?.message}
                    </p>
                  )}
                </div>

                <div className=" space-y-1.5">
                  <FormInput
                    label="Township"
                    {...register("township")}
                    type="text"
                    id={"Township"}
                  />
                  {errors.township && (
                    <p className="text-red-500 text-xs">
                      {errors.township?.message}
                    </p>
                  )}
                </div>
                <div className=" space-y-1.5">
                  <FormInput
                    {...register("street")}
                    label="Street"
                    type="text"
                    id={"Street"}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-xs">
                      {errors.street?.message}
                    </p>
                  )}
                </div>
                <div className=" space-y-1.5">
                  <FormInput
                    label="Company(optional)"
                    type="text"
                    {...register("company")}
                    id={"Company(optional)"}
                  />
                  {errors.company && (
                    <p className="text-red-500 text-xs">
                      {errors.company?.message}
                    </p>
                  )}
                </div>
                <div className=" flex flex-col gap-1.5">
                  <Label htmlFor="address">Address Detail</Label>
                  <Textarea id="address" {...register("addressDetail")} />
                  {errors.addressDetail && (
                    <p className="text-red-500 text-xs">
                      {errors.addressDetail?.message}
                    </p>
                  )}
                </div>
                <div className=" flex col-span-full justify-end gap-3 items-center">
                  <Button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setIsEditing(false);
                      reset({
                        city: "",
                        company: "",
                        addressDetail: "",
                        street: "",
                        township: "",
                      });
                    }}
                    disabled={addingAddress || editingAddress}
                    variant={"link"}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={addingAddress || editingAddress}
                    variant={"default"}
                  >
                    Save
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {isClient && (
        <SweetAlert2
          didClose={() => {
            router.push("/");
          }}
          customClass={{
            popup: " w-auto",
          }}
          {...swalProps}
        >
          <div className=" pointer-events-none space-y-3 text-center">
            <p className=" pointer-events-none font-medium">
              Please Login To Continue.
            </p>

            <div className="  pointer-events-none flex gap-3 justify-center items-center">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSwalProps({
                    ...swalProps,
                    show: false,
                  });
                  router.push("/");
                }}
                size={"sm"}
                className="  pointer-events-auto"
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  handleLogin();
                  e.stopPropagation();
                  setSwalProps({
                    ...swalProps,
                    show: false,
                  });
                }}
                size={"sm"}
                className="  pointer-events-auto"
              >
                Sign In
              </Button>
            </div>
          </div>
        </SweetAlert2>
      )}

      {isClient && (
        <SweetAlert2
          timer={1500}
          position="bottom-end"
          icon="success"
          iconColor="black"
          customClass={{
            popup: "colored-toast",
          }}
          toast={true}
          {...swalProps2}
          didClose={() =>
            setSwalProps2({
              ...swalProps2,
              show: false,
            })
          }
        >
          <p>Your address is updated!</p>
        </SweetAlert2>
      )}
    </div>
  );
};

export default UserAddressPage;
