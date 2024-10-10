"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

const BreadCrumbComponent = ({
  path,
  currentPage,
}: {
  path: string;
  currentPage: string;
}) => {
  const router = useRouter();
  return (
    <div className=" flex justify-between mb-3 items-center">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage
                onClick={() => router.push("/")}
                className=" font-semibold text-sm lg:text-base cursor-pointer"
              >
                {path}
              </BreadcrumbPage>
            </BreadcrumbItem>
            {currentPage !== undefined && (
              <BreadcrumbSeparator>|</BreadcrumbSeparator>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary/75 capitalize lg:text-sm ">
                {currentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadCrumbComponent;
