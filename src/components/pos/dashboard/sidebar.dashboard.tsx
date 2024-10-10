"use client";

import React, { useEffect, useState } from "react";
import SidebarNavHeading from "@/components/SidebarNavHeading";
import { sidebarMenuItems } from "@/utils/constants";
import useSWR from "swr";
import { Backend_URL, getFetch } from "@/lib/fetch";

export default function Sidebar() {
  // Filter routes based on group
  const filterRoutesByGroup = (group: string) =>
    sidebarMenuItems.filter((el) => el.group === group);

  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Only set the open state if we are on the client side
    if (typeof window !== "undefined") {
      setOpen(localStorage.getItem("open"));
    }
  }, []);

  // Function to handle opening/closing of sidebar nav
  const handleOpen = (value: string) => () => {
    setOpen(open === value ? open : value);
    if (isClient) {
      localStorage.setItem("open", value);
    }
  };

  // Define filtered routes
  const controlRoutes = filterRoutesByGroup("control");
  const reportRoutes = filterRoutesByGroup("report");
  const inventoryRoutes = filterRoutesByGroup("inventory");
  const CRMRoutes = filterRoutesByGroup("CRM");
  const profileRoutes = filterRoutesByGroup("profile");
  const stockRoutes = filterRoutesByGroup("stock");
  const EcommerceRoutes = filterRoutesByGroup("Ecommerce");

  const getData = (url: string) => {
    return getFetch(url);
  };

  const { data } = useSWR(`${Backend_URL}/orders`, getData, {
    refreshInterval: 5000,
  });

  const { data: userData } = useSWR(`${Backend_URL}/users/me`, getData);

  const sidebarNavHeading = [
    {
      id: 0,
      name: "",
      routes: controlRoutes,
      disabled: false,
    },
    {
      id: 1,
      name: "Sale Report",
      routes: reportRoutes,
      disabled: userData?.role !== "ADMIN" ? true : false,
    },
    {
      id: 2,
      name: "Inventory",
      routes: inventoryRoutes,
      disabled: userData?.role !== "ADMIN" ? true : false,
    },
    {
      id: 3,
      name: "CRM",
      routes: CRMRoutes,
      disabled: false,
    },
    {
      id: 4,
      name: "stock",
      routes: stockRoutes,
      disabled: userData?.role !== "ADMIN" ? true : false,
    },
    {
      id: 5,
      name: "Ecommerce",
      routes: EcommerceRoutes,
      order: data?.totalOrdered,
      disabled: false,
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xl mb-3 font-semibold">Boss Nation</p>
      <ul className="space-y-2">
        {sidebarNavHeading.map(({ id, name, routes, order, disabled }) => {
          if (name === "") {
            return (
              <SidebarNavHeading
                key={id}
                handleOpen={handleOpen}
                routes={routes}
                disabled={disabled}
              />
            );
          }
          return (
            <SidebarNavHeading
              key={id}
              open={open}
              openId={id}
              handleOpen={handleOpen}
              name={name}
              routes={routes}
              disabled={disabled}
              order={order}
            />
          );
        })}
      </ul>
    </div>
  );
}
