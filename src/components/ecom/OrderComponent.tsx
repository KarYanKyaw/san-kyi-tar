import { CarFront, Check, Package, ShirtIcon, User2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import useSWRMutation from "swr/mutation";
import { Backend_URL } from "@/lib/fetch";

interface OrderData {
  orderStatus: string;
  cancelReason: string;
}

const OrderComponent = ({ data, refetch }: any) => {
  const [active, setActive] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const patchOrder = async (url: string, { arg }: { arg: OrderData }) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
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

      return data; // Return the parsed JSON data
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const {
    data: editOrderData,
    error: editOrderError,
    trigger: editOrder,
  } = useSWRMutation(
    orderId !== null ? `${Backend_URL}/orders/ecommerce/${orderId}` : null,
    patchOrder
  );

  useEffect(() => {
    if (data) {
      if (data.orderStatus == "ORDERED") {
        setActive(1);
        return;
      }
      if (data.orderStatus == "CONFIRMED") {
        setActive(2);
        return;
      }
      if (data.orderStatus == "DELIVERED") {
        setActive(3);
        return;
      }
      if (data.orderStatus == "COMPLETED") {
        setActive(4);
        return;
      }
    }
  }, [data]);

  const handleCancelOrder = async () => {
    await setOrderId(data?.id);
    const orderData: OrderData = {
      orderStatus: "CANCELED",
      cancelReason: cancelReason,
    };
    const res = await editOrder(orderData);
    if (res) {
      refetch();
    }
  };

  return (
    <>
      {data?.orderStatus == "CANCELED" ? (
        <div className="mx-auto border-b pb-3 space-y-4 h-full overflow-x-auto w-[80%] lg:w-[90%]">
          <div className=" bg-secondary overflow-x-auto space-y-4 p-3 lg:p-5 lg:w-[60%] border border-input">
            <p className=" lg:text-base text-center text-sm font-medium">
              Your order has been canceled due to{" "}
              {data?.cancelReason || "out of stock"}
            </p>
          </div>
          <div className=" bg-secondary space-y-4 p-5 lg:w-1/3 border border-input">
            <p className=" lg:text-lg text-sm">Order Details:</p>
            <div className="flex gap-3">
              <p className="text-sm text-start w-[130px] text-primary/80">
                Order Number :
              </p>
              <p className="text-sm font-normal w-[104px] text-start ">
                {data?.orderCode}
              </p>
            </div>
            <div className="flex gap-3">
              <p className="text-sm text-start w-[130px] text-primary/80">
                Order Date :
              </p>
              <p className="text-sm font-normal w-[134px] text-start ">
                {data?.date}
              </p>
            </div>
            <div className="flex gap-3">
              <p className="text-sm text-start w-[130px] text-primary/80">
                Total Amount :
              </p>
              <p className="text-sm font-normal text-start ">
                {new Intl.NumberFormat("ja-JP").format(data?.total)} MMK
              </p>
            </div>
          </div>
          <div className="pt-4">
            <div className=" flex gap-1 items-center">
              <User2 />
              <p className=" font-medium lg:text-base text-sm">
                {data?.ecommerceUser?.name} .
              </p>
              <p className=" text-xs">{data?.ecommerceUser?.phone}</p>
            </div>
            <p className=" ms-1 py-1 lg:text-sm text-xs">
              {data?.customerAddress?.addressDetail},
              {data?.customerAddress?.street},{data?.customerAddress?.township},
              {data?.customerAddress?.city}
            </p>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="mx-auto h-full  border-b pb-3 overflow-x-hidden w-screen lg:w-[90%]">
            <div className=" bg-secondary space-y-4 p-3 lg:p-5 lg:w-[60%] border border-input">
              <p className=" lg:text-base text-xs capitalize font-medium">
                Your Order {data?.orderCode} Has Been{" "}
                {data?.orderStatus.toLowerCase()}!
              </p>
              <div className=" flex items-center gap-3">
                <div className=" flex flex-col justify-center items-center text-center gap-1.5 ">
                  <div
                    className={`border-dashed  ${
                      active > 0 && "bg-primary"
                    } duration-200 circle p-1.5 border-2 rounded-full border-primary inline-block`}
                  >
                    <ShirtIcon className=" lg:w-5 lg:h-5 stroke-white h-3 w-3" />
                  </div>
                  <p className=" text-xs font-normal lg:text-sm capitalize">
                    Processing
                  </p>
                </div>

                <div className=" border w-12  h-0 mb-2.5 border-dashed border-primary"></div>

                <div className=" flex flex-col justify-center items-center gap-1.5">
                  <div
                    className={`border-dashed  ${
                      active > 1 && " bg-primary"
                    } duration-200 circle p-1.5 border-2  rounded-full border-primary inline-block`}
                  >
                    <Package
                      className={` lg:w-5 lg:h-5 ${
                        active < 2 ? " stroke-black" : "stroke-white"
                      } h-3 w-3`}
                    />
                  </div>
                  <p className=" font-normal text-xs lg:text-sm capitalize">
                    Packed
                  </p>
                </div>

                <div className=" border w-12  h-0 mb-2.5 border-dashed border-primary"></div>

                <div className=" flex flex-col justify-center items-center gap-1.5">
                  <div
                    className={`border-dashed  ${
                      active > 2 && "bg-primary"
                    } duration-200 circle p-1.5 border-2  rounded-full border-primary inline-block`}
                  >
                    <CarFront
                      className={` lg:w-5 lg:h-5 ${
                        active < 3 ? " stroke-black" : "stroke-white"
                      } h-3 w-3`}
                    />
                  </div>
                  <p className=" font-normal text-xs lg:text-sm capitalize">
                    Delivery
                  </p>
                </div>

                <div className=" border w-12  h-0 mb-2.5 border-dashed border-primary"></div>

                <div className=" flex flex-col justify-center items-center gap-1.5">
                  <div
                    className={`border-dashed  ${
                      active > 3 && "bg-primary"
                    } duration-200 circle p-1.5 border-2  rounded-full border-primary inline-block`}
                  >
                    <Check
                      className={` lg:w-5 lg:h-5 ${
                        active < 4 ? " stroke-black" : "stroke-white"
                      } h-3 w-3`}
                    />
                  </div>
                  <p className=" font-normal text-xs lg:text-sm capitalize">
                    Complete
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" mx-auto lg:w-[90%]">
            <div className=" space-y-2 py-6">
              <p className=" lg:text-base text-sm">
                Hi {data?.ecommerceUser?.name},
              </p>
              <p className=" text-xs lg:text-sm">
                We are pleased to inform you that your order {data?.orderCode}{" "}
                has been successfully completed. Thank you for shopping with us!
              </p>
            </div>
            <div className=" bg-secondary space-y-4 p-5 lg:w-1/3 border border-input">
              <p className=" lg:text-lg text-sm">Order Details:</p>
              <div className="flex gap-3">
                <p className="text-sm text-start w-[130px] text-primary/80">
                  Order Number :
                </p>
                <p className="text-sm font-normal w-[104px] text-start ">
                  {data?.orderCode}
                </p>
              </div>
              <div className="flex gap-3">
                <p className="text-sm text-start w-[130px] text-primary/80">
                  Order Date :
                </p>
                <p className="text-sm font-normal w-[134px] text-start ">
                  {data?.date}
                </p>
              </div>
              <div className="flex gap-3">
                <p className="text-sm text-start w-[130px] text-primary/80">
                  Total Amount :
                </p>
                <p className="text-sm font-normal text-start ">
                  {new Intl.NumberFormat("ja-JP").format(data?.total)} MMK
                </p>
              </div>
            </div>
            <div className="pt-4">
              <div className=" flex gap-1 items-center">
                <User2 />
                <p className=" font-medium lg:text-base text-sm">
                  {data?.ecommerceUser?.name} .
                </p>
                <p className=" text-xs">{data?.ecommerceUser?.phone}</p>
              </div>
              <p className=" ms-1 py-1 lg:text-sm text-xs">
                {data?.customerAddress?.addressDetail},
                {data?.customerAddress?.street},
                {data?.customerAddress?.township},{data?.customerAddress?.city}
              </p>
            </div>
            <div className=" mt-4">
              {data?.orderStatus == "ORDERED" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Cancel Order</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                      <AlertDialogDescription
                        asChild
                        className=" text-primary/90"
                      >
                        <div className="">
                          <Label htmlFor="reason">
                            Reason for canceling the order.
                          </Label>
                          <div className=" mt-3">
                            <Textarea
                              id="reason"
                              placeholder="Please describe reason here to cancel your order!"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                            />
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={cancelReason === ""}
                        onClick={() => handleCancelOrder()}
                      >
                        Cancel Now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderComponent;
