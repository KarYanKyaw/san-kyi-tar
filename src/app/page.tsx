"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import {
  Banner,
  BreadCrumbComponent,
  Container,
  Heading,
  ProductCategories,
  Products,
} from "@/components/ecom";
import useSWR from "swr";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ErrorComponent from "@/components/ErrorComponent";
import AppLayout from "@/components/ecom/AppLayout";
import { useRouter } from "next/navigation";
import { useAppProvider } from "./Provider/AppProvider";

export default function Home() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true); // Await the promise to get the ID token
    } catch (error) {
      console.error(error);
    }
  };

  const { searchInputValue, setSearchInputValue } = useAppProvider();

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    searchInputValue !== ""
      ? `${Backend_URL}/ecommerce-Products/riddle/man?search=${searchInputValue}`
      : `${Backend_URL}/ecommerce-Products/riddle/man?limit=${4}`,
    getData
  );

  return (
    <main className=" min-h-screen max-w-screen !overflow-x-hidden bg-secondary">
      <AppLayout>
        <Banner />
        {error ? (
          <ErrorComponent refetch={() => {}} />
        ) : (
          <>
            <Container>
              <div className=" flex flex-col gap-[40px] lg:pt-12 pt-6">
                <div className=" flex flex-col gap-[15px]">
                  <BreadCrumbComponent path="Home" currentPage="Best Sellers" />
                  <Heading
                    header="Best selling products for you"
                    desc="the latest and greatest products that every man needs to enhance his lifestyle"
                  />
                </div>
                <div className=" pt-8 space-y-4 ">
                  <Products isLoading={isLoading} data={data?.data} />
                </div>
              </div>
            </Container>
            {!isLoading && (
              <Button
                className=" w-full mt-5 bg-transparent flex !py-4 !text-xs rounded-none justify-center items-center"
                variant={"outline"}
                onClick={() => router.push("/new-in?page=1")}
              >
                <Plus /> <span className=" capitalize !text-xs">VIEW MORE</span>
              </Button>
            )}

            <ProductCategories />
          </>
        )}
      </AppLayout>
    </main>
  );
}
