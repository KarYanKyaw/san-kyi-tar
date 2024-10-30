"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Heart, ShoppingCart, User, Gift } from "lucide-react";
import Container from "./Container";
import { useRouter } from "next/navigation";
import ControlSheet from "./ControlSheet";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import useSWR from "swr";
import { Backend_URL } from "@/lib/fetch";
import text from "../../../public/text.png";
import logo from "../../../public/logo.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const Navbar = () => {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const closeWishListRef = useRef<HTMLButtonElement | null>(null);
  const { searchInputValue, setSearchInputValue } = useAppProvider();
  const [debouncedValue, setDebouncedValue] = useState(searchInputValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchInputValue(debouncedValue);
    }, 800); // delay in milliseconds

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, setSearchInputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
  };

  const { handleLogin } = useAppProvider();

  const getWishlistData = async (url: string) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  };

  const {
    data: wishlistData,
    error: wishlistError,
    mutate,
  } = useSWR(`${Backend_URL}/wishlist`, getWishlistData, {
    errorRetryCount: 0,
  });

  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (debouncedValue.length > 3) {
      setOpen(true);
    }

    return () => {
      setOpen(false);
    };
  }, [debouncedValue]);

  return (
    <div className=" overflow-hidden select-none">
      <div className="z-[50] h-[80px]  overflow-hidden fixed flex justify-center items-center bg-secondary w-full border-b-2 border-input">
        <Container className="flex justify-center  overflow-hidden flex-col h-full">
          <div className="grid grid-cols-2 lg:grid-cols-3 items-center gap-3">
            <div
              onClick={() => {
                setSearchInputValue("");
                router.push("/");
              }}
              className="lg:text-xl flex items-center justify-start  cursor-pointer font-semibold"
            >
              <Image
                className="lg:h-[100px] w-[80px] h-[50px] object-left object-contain"
                src={logo}
                alt="logo"
              />

              <div className=" flex flex-col lg:-ms-0 -ms-6 justify-center items-start">
                <p className=" font-medium mb-0 pb-0 lg:leading-6 lg:text-xl text-[10px] uppercase font-serif">
                  Boss Nation
                </p>
                <p className=" font-medium lg:tracking-wide uppercase text-[10px] lg:text-xs font-serif">
                  Authentic Fashion
                </p>
              </div>
              {/* 
              <Image
                className="h-[80px] object-left -ms-7 object-contain"
                src={text}
                alt="logo"
              /> */}
            </div>

            {/* nav links */}
            <div className="hidden lg:flex justify-around">
              <p
                onClick={() => {
                  setSearchInputValue("");
                  router.push("/new-in?page=1");
                }}
                className="text-sm cursor-pointer uppercase"
              >
                New In
              </p>

              <p
                onClick={() => {
                  setSearchInputValue("");
                  router.push("/men?page=1");
                }}
                className="text-sm cursor-pointer uppercase"
              >
                Men
              </p>

              <p
                onClick={() => {
                  setSearchInputValue("");
                  router.push("/women?page=1");
                }}
                className="text-sm cursor-pointer uppercase"
              >
                Women
              </p>

              <p
                onClick={() => {
                  setSearchInputValue("");
                  router.push("/unisex?page=1");
                }}
                className="text-sm cursor-pointer uppercase"
              >
                Unisex
              </p>
            </div>

            {/* controls */}
            <div className="flex justify-end items-center">
              <div className="border-neutral-400 border w-[200px] rounded hidden lg:flex items-center">
                {/* <DropdownMenu open={open} modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="!h-8 border-0 -me-2 !p-0 !px-2 rounded-e-0"
                      variant="ghost"
                    >
                      <Search size={20} color="#A3a3a3" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    onInteractOutside={() => setOpen(false)}
                    className=" ms-[192px] w-56"
                  >
                    <DropdownMenuCheckboxItem>
                      Status Bar
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}

                <Input
                  value={debouncedValue}
                  onChange={handleInputChange}
                  ref={searchRef}
                  placeholder="Search..."
                  className="w-[80%] border-none h-4 bg-transparent rounded-none focus:outline-none focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="block lg:hidden">
                <ControlSheet
                  buttonName={<Search />}
                  title=""
                  desc=""
                  closeRef={closeRef}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      closeRef.current && closeRef.current.click();
                    }}
                  >
                    <div className="border-input w-full rounded border flex items-center">
                      <Button
                        type="submit"
                        className="!h-8 border-0 -me-2 rounded-e-0"
                        variant="outline"
                      >
                        <Search />
                      </Button>
                      <Input
                        value={debouncedValue}
                        onChange={handleInputChange}
                        placeholder="Search..."
                        className="w-[80%] border-none h-9 bg-transparent rounded-none focus:outline-none focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </form>
                </ControlSheet>
              </div>

              <div>
                <ControlSheet
                  closeRef={closeRef}
                  buttonName={
                    <>
                      {wishlistData?.data?.length > 0 ? (
                        <>
                          <Heart className=" fill-red-500 stroke-red-500" />
                        </>
                      ) : (
                        <Heart />
                      )}
                    </>
                  }
                  title="Wishlist"
                  desc="Your wishlist is here"
                >
                  <Wishlist closeRef={closeRef} />
                </ControlSheet>
              </div>

              <ControlSheet
                buttonName={<ShoppingCart />}
                title="Add to Cart"
                closeRef={closeRef}
                desc="Your Cart Items"
              >
                <Cart closeRef={closeRef} />
              </ControlSheet>

              <div className="hidden lg:block">
                <Button
                  onClick={() => {
                    setSearchInputValue("");
                    router.push("/profile/information");
                  }}
                  size="sm"
                  variant="ghost"
                  className="relative"
                >
                  <User />
                </Button>
              </div>
              <div className="block lg:hidden">
                <ControlSheet
                  buttonName={<HamburgerMenuIcon width={24} height={24} />}
                  title="Menu"
                >
                  <div className="space-y-3">
                    <p
                      onClick={() => {
                        setSearchInputValue("");
                        router.push("/new-in?page=1");
                      }}
                      className="text-sm cursor-pointer uppercase"
                    >
                      New In
                    </p>

                    <hr className="border-1.5 border-input" />

                    <p
                      onClick={() => {
                        setSearchInputValue("");
                        router.push("/men?page=1");
                      }}
                      className="text-sm cursor-pointer uppercase"
                    >
                      Men
                    </p>
                    <hr className="border-1.5 border-input" />
                    <p
                      onClick={() => {
                        setSearchInputValue("");
                        router.push("/women?page=1");
                      }}
                      className="text-sm cursor-pointer uppercase"
                    >
                      Women
                    </p>
                    <hr className="border-1.5 border-input" />
                    <p
                      onClick={() => {
                        setSearchInputValue("");
                        router.push("/unisex?page=1");
                      }}
                      className="text-sm cursor-pointer uppercase"
                    >
                      Unisex
                    </p>
                    <hr className="border-1.5 border-input" />
                    <p
                      onClick={() => {
                        setSearchInputValue("");
                        router.push("/profile/information");
                      }}
                      className="text-sm cursor-pointer uppercase"
                    >
                      Profile
                    </p>
                  </div>
                </ControlSheet>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
