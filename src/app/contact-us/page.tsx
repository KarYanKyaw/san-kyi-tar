"use client";

import { Container } from "@/components/ecom";
import { useRouter } from "next/navigation";
import React from "react";
import { SiFacebook, SiTiktok, SiViber } from "react-icons/si";

const ContactUs = () => {
  const router = useRouter();

  return (
    <Container className=" mx-auto">
      <div className="  mt-20">
        <div className=" space-y-1.5">
          <div className=" justify-center flex items-center gap-3">
            <p
              onClick={() => router.push("/")}
              className="font-medium text-sm cursor-pointer"
            >
              Home
            </p>
            - <p className=" text-sm">Contact Us</p>
          </div>
          <p className=" text-2xl text-center font-bold">
            Let us know what you think!
          </p>
        </div>
        <div className=" mt-12 grid-cols-12 lg:w-[80%] mx-auto grid gap-3">
          <div className=" border-input border space-y-4 rounded col-span-full lg:col-span-4 p-6">
            <p className=" font-semibold text-lg">Mail Us</p>
            <div className="text-xs lg:text-sm">
              <a
                className=" text-primary/60 block"
                href="mailto:bossnation134@gmail.com"
              >
                bossnation134@gmail.com
              </a>
            </div>
            <div className=" flex justify-between items-center">
              <p>Follow us : </p>
              <div className=" flex items-center gap-3">
                <a
                  href="https://www.facebook.com/boss.nation.clothing.shop"
                  target="_blank"
                >
                  <span className=" bg-neutral-200 rounded flex justify-center items-center w-6 h-6">
                    <SiFacebook size={18} color="#1877F2" />
                  </span>
                </a>
                <a
                  href="https://www.tiktok.com/@boss.nation0?lang=en"
                  target="_blank"
                >
                  <span className=" bg-neutral-200 rounded flex justify-center items-center w-6 h-6">
                    <SiTiktok size={18} />
                  </span>
                </a>
                <a
                  href="https://invite.viber.com/?g2=AQAr3pdeu90u3k9M%2FQ%2BlMW9UYGgkdtZuAEpIwxSsQ7%2FpwBBU%2B5qaIDmkU2urII8w"
                  target="_blank"
                >
                  <span className="  rounded flex justify-center items-center w-6 h-6">
                    <SiViber size={18} color="white" />
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className=" border-input border space-y-4 rounded col-span-full lg:col-span-4 p-6">
            <p className=" font-semibold text-lg">Call Now</p>
            <div className="text-xs lg:text-sm">
              <a className=" block" href="tel:+95943179753">
                +95943179753
              </a>
            </div>
          </div>
          <div className=" border-input border space-y-4 rounded col-span-full lg:col-span-4 p-6">
            <p className=" font-semibold text-lg">Location</p>
            <div className="text-xs lg:text-sm">
              <p>No(41), Min Street, Sanchaung Township, Yangon, Myanmar.</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ContactUs;
