"use client";

import { Container } from "@/components/ecom";
import { FacebookIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SiFacebook, SiTiktok } from "react-icons/si";

const ContactUs = () => {
  const router = useRouter();

  return (
    <Container className=" !relativemx-auto">
      <div className="  mt-20">
        <div className=" space-y-1.5">
          <div className=" justify-center flex items-center gap-3">
            <p
              onClick={() => router.push("/")}
              className="font-medium text-sm cursor-pointer"
            >
              Home
            </p>
            - <p className=" text-sm">About Us</p>
          </div>
          <p className=" text-2xl text-center font-bold">Our Grantee</p>
        </div>
        <div className=" mt-12 lg:w-[50%] mx-auto text-center">
          <ul className=" text-primary/70 flex flex-col gap-4 text-start">
          <li className="list-item">
              - Since established in 2021.&quot;Boss Nation&quot; has gained the full trust of customers by enabling to sell up to 3,000 pieces of Boss brand Polo-shirt over a year.
            </li>
            <li className="list-item">
              - All items from &quot;Boss Nation&quot; are guaranteed to be 100% authentic. If there may be counterfeits, we will refund (10) times the value of your purchased items.
            </li>
            <li className="list-item">
              - In addition to this refund, we have strongly committed that we will no longer sell &quot;Boss&quot; branded items.
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default ContactUs;

// Guarantee
// ….
// Since established in 2021."Boss Nation" has gained the full trust of customers by enabling to sell up to 3,000 pieces of Boss brand Polo-shirt over a year.         All items from "Boss Nation" are guaranteed to be 100% authentic. If there may be counterfeits, we will refund (10) times the value of your purchased items. In addition to this refund, we have strongly commited that we will no longer sell "Boss" branded items.
