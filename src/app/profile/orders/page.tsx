"use client";

import { useAppProvider } from "@/app/Provider/AppProvider";
import { Container } from "@/components/ecom";
import OrderComponent from "@/components/ecom/OrderComponent";
import { Button } from "@/components/ui/button";
import { Backend_URL } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SweetAlert2 from "react-sweetalert2";
import useSWR from "swr";

const UserOrdersPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { handleLogin } = useAppProvider();
  const router = useRouter();

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [token, setToken] = useState<string | null>("");

  useEffect(() => {
    if (isClient) {
      if (!localStorage.getItem("accessToken")) {
        setSwalProps({
          show: true,
          showConfirmButton: false,
        });
      } else {
        setToken(localStorage.getItem("accessToken"));
      }
    }
  }, [isClient]);

  const getData = async (url: string) => {
    try {
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

  const { data, isLoading, mutate } = useSWR(
    token !== "" ? `${Backend_URL}/orders/ecommerce` : null,
    getData,
    {
      errorRetryInterval: 500,
    }
  );

  return (
    <>
      {!isLoading && (
        <div className=" space-y-6">
          {data?.map((data: any, index: any) => (
            <OrderComponent key={index} data={data} refetch={mutate} />
          ))}
        </div>
      )}
      {isClient && (
        <SweetAlert2
          didClose={() => {
            router.push("/");
          }}
          {...swalProps}
          customClass={{
            popup: " w-auto",
          }}
        >
          <div className=" pointer-events-none space-y-3 text-center">
            <p className=" pointer-events-none font-medium">
              Please Login To Continue.
            </p>

            <div className=" pointer-events-none flex gap-3 justify-center items-center">
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
    </>
  );
};

export default UserOrdersPage;
