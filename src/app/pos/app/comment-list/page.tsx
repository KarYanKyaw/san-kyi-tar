"use client";

import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import React, { use, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { Backend_URL, getFetch, putFetch } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const [id, setId] = useState<number | null>(null);

  const getData = (url: string) => getFetch(url);

  const putFetcher = (url: string, { arg }: { arg: any }) => {
    return putFetch(url, arg);
  };

  const { data, mutate } = useSWR(`${Backend_URL}/comments`, getData);

  const { data: processData, trigger: process } = useSWRMutation(
    id !== null ? `${Backend_URL}/comments/${id}` : null,
    putFetcher
  );

  const processComment = async (type: any) => {
    const data = {
      status: `${type}`,
    };

    const res = await process(data);
    if (res) mutate();
  };

  const router = useRouter();

  console.log(data);

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader
          parentPage="Comments"
          path="E-commerce"
          currentPage="Comments"
        />

        <div className=" min-h-[780px]">
          <Table>
            <TableHeader className="hover:bg-white z-50">
              <TableRow className="hover:bg-white bg-white">
                <TableHead>No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className=" w-[500px] text-start">Comment</TableHead>
                {/* <TableHead>Date</TableHead> */}
                <TableHead className=" text-end">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map(
                (
                  {
                    id,
                    customerName,
                    content,
                    productId,
                    status,
                    replies,
                  }: any,
                  index: number
                ) => (
                  <React.Fragment key={index}>
                    <TableRow
                      onClick={() => {
                        router.push("/pos/app/comment-list/" + productId);
                      }}
                      key={id}
                      className="bg-white hover:bg-white/50"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{customerName}</TableCell>
                      <TableCell className=" w-[500px] text-start">
                        {content}
                      </TableCell>
                      <TableCell className=" flex gap-3 justify-end">
                        {status == "APPROVED" && (
                          <Badge className=" bg-green-600">
                            <p className="">APPROVED</p>
                          </Badge>
                        )}
                        {status == "DECLINED" && (
                          <Badge className=" bg-red-500">
                            <p>DECLINED</p>
                          </Badge>
                        )}
                        {status == "PENDING" && (
                          <>
                            <Button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await setId(id);
                                await processComment("APPROVED");
                              }}
                              size={"sm"}
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await setId(id);
                                await processComment("DECLINED");
                              }}
                              size={"sm"}
                              variant="outline"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>

                    {replies?.length > 0 && (
                      <>
                        {replies.map(
                          (
                            {
                              id,
                              customerName,
                              content,
                              productId,
                              status,
                            }: any,
                            index: number
                          ) => (
                            <TableRow
                              onClick={() => {
                                router.push(
                                  "/pos/app/comment-list/" + productId
                                );
                              }}
                              key={index}
                              className="bg-white hover:bg-white/50"
                            >
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{customerName}</TableCell>
                              <TableCell className=" w-[500px] text-start">
                                {content}
                              </TableCell>
                              <TableCell className=" flex gap-3 justify-end">
                                {status == "APPROVED" && (
                                  <Badge className=" bg-green-600">
                                    <p className="">APPROVED</p>
                                  </Badge>
                                )}
                                {status == "DECLINED" && (
                                  <Badge className=" bg-red-500">
                                    <p>DECLINED</p>
                                  </Badge>
                                )}
                                {status == "PENDING" && (
                                  <>
                                    <Button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        await setId(id);
                                        await processComment("APPROVED");
                                      }}
                                      size={"sm"}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        await setId(id);
                                        await processComment("DECLINED");
                                      }}
                                      size={"sm"}
                                      variant="outline"
                                    >
                                      Decline
                                    </Button>
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </>
                    )}
                  </React.Fragment>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default Page;
