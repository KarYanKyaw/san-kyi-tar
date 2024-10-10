"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardAppPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/pos/app/sale");
  }, []);
  return;
}
