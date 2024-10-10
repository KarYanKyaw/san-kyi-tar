import AppLayout from "@/components/ecom/AppLayout";
import React from "react";

const Layout = ({ children, params }: any) => {
  return (
    <AppLayout params={params}>
      <div className=" py-3">{children}</div>
    </AppLayout>
  );
};

export default Layout;
