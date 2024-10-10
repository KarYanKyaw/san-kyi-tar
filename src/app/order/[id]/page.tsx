"use client";

import { Container } from "@/components/ecom";
import OrderComponent from "@/components/ecom/OrderComponent";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const Order = ({ params }: any) => {
  const [isClient, setIsClient] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isClient) setUserId(localStorage.getItem("userId"));
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const { data, isLoading, error, mutate } = useSWR(
    userId !== null ? `${Backend_URL}/orders/ecommerce/${params.id}` : null,
    getData,
    {
      refreshInterval: 4000,
      errorRetryCount: 0,
      errorRetryInterval: 1000000,
    }
  );

  return (
    <div className="space-y-5">
      <Container className=" pt-4">
        <p className=" text-sm lg:text-sm pb-3 font-normal">
          Checkout | Orders
        </p>
      </Container>
      {(!error || !isLoading) && (
        <OrderComponent data={data} refetch={mutate} />
      )}
    </div>
  );
};

export default Order;
