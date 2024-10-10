"use client";

import Sidebar from "@/components/pos/dashboard/sidebar.dashboard";
import { Button } from "@/components/ui/button";
import { clearTokens } from "@/lib/lib";
import { useRouter } from "next/navigation";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSubmit = async () => {
    const result = await clearTokens();
    router.push("/pos/login");
  };

  return (
    <div className="grid grid-cols-12 h-screen overflow-hidden">
      <div className=" col-span-2 ">
        <div className="p-5 h-screen  overflow-auto">
          <div className=" space-y-3 flex flex-col justify-between  h-full">
            <Sidebar />
            <Button
              variant="outline"
              className=" w-full"
              size="sm"
              onClick={handleSubmit}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
      <div className="col-span-10 h-screen overflow-auto">
        <div className="py-5 min-h-screen bg-secondary">
          <div className=" w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
