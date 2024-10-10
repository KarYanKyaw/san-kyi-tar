"use client";
import { ArrowRight, ArrowRightToLine, MoveRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Container from "./Container";
import { useRouter } from "next/navigation";

const CallToAction = () => {
  const router = useRouter();
  return (
    <Container className=" my-12 lg:my-24 lg:!w-[60%]">
      <div className=" bg-neutral-200 lg:flex-row flex-col flex gap-3 justify-between items-center p-5 lg:px-[56px] lg:py-[64px]">
        <p className=" text-sm lg:text-xl flex flex-col font-semibold">
          <span>Discover our latest arrivals and</span>
          <span>exclusive offers just for you.</span>
        </p>
        <Button size={"default"} onClick={() => router.push("/")}>
          <span className=" me-2">Shop Now</span> <ArrowRight />
        </Button>
      </div>
    </Container>
  );
};

export default CallToAction;
