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
import { Backend_URL, getFetch } from "@/lib/fetch";
import useSWR from "swr";

const NavHeader = ({
  parentPage,
  path,
  currentPage,
}: {
  parentPage: string;
  path?: string;
  currentPage?: string;
}) => {
  const getData = (url: string) => {
    return getFetch(url);
  };

  const { data } = useSWR(`${Backend_URL}/users/me`, getData);

  return (
    <div className=" flex justify-between mb-3 items-center">
      <div className="space-y-2">
        <p className="text-2xl font-medium">{parentPage}</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>{path}</BreadcrumbLink>
            </BreadcrumbItem>
            {currentPage !== undefined && (
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className=" gap-3 flex items-center">
        <div>
          <p className=" text-sm text-end">{data?.name}</p>
          <p className=" text-sm opacity-50 font-light text-end">active</p>
        </div>

        <Avatar>
          <AvatarImage src={""} />
        </Avatar>
      </div>
    </div>
  );
};

export default NavHeader;
