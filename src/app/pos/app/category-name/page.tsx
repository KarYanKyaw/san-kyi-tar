"use client";

import Container from "@/components/Container.components";
import CatListControlBar from "@/components/pos/category-name/CatListControlBar";
import CatListTable from "@/components/pos/category-name/CatListTable";
import CouponControlBar from "@/components/pos/coupon/CouponControlBar";
import CouponTable from "@/components/pos/coupon/CouponTable";
import { PaginationComponent } from "@/components/pos/inventory";
import NavHeader from "@/components/pos/NavHeader";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import {
  Backend_URL,
  deleteFetch,
  deleteSingleFetch,
  getFetch,
} from "@/lib/fetch";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const CatPage = () => {
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [catId, setCatId] = useState("");
  const [imageToShow, setImageToShow] = useState<any | undefined>();

  const openSheetRef = useRef<HTMLDivElement>(null);

  // for fetching
  const [currentPage, setCurrentPage] = useState(1);

  const [filterType, setFilterType] = useState("promotionRate");
  const [sortBy, setSortBy] = useState("desc");

  const filterTable = (value: string) => {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
    setFilterType(value);
  };

  // for pagination
  const incrementPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const decrementPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToLastPage = () => {
    setCurrentPage(data?.totalPages);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const getData = (url: string) => {
    return getFetch(url);
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${Backend_URL}/ecommerce-categories?search=${searchInputValue}`,
    getData,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
      revalidateOnMount: true,
    }
  );

  const refetch = () => {
    return mutate(`${Backend_URL}/ecommerce-categories`);
  };

  // delete

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(event.target.id);

    setIdsToDelete((prevIds) => {
      if (prevIds.includes(size)) {
        return prevIds.filter((item) => item !== size);
      } else {
        return [...prevIds, size];
      }
    });
  };

  const fetcher = async (url: string, { arg }: { arg: { ids: number[] } }) => {
    return deleteFetch(url, arg);
  };

  // single delete

  const singleDeleteFetcher = async (url: string) => {
    return deleteSingleFetch(url);
  };

  const { error: singleDeleteError, trigger: singleDrop } = useSWRMutation(
    `${Backend_URL}/ecommerce-categories/${deleteId}`,
    singleDeleteFetcher
  );

  const handleSingleDelete = async () => {
    const res = await singleDrop();
    if (res.status) setDeleteId(undefined);
    refetch();
  };

  const [editId, setEditId] = useState({
    status: false,
    id: "",
  });

  const handleEdit = (id: any): void => {
    setEditId({
      status: true,
      id,
    });
  };

  const resetValue = () => {
    setInputValue("");
    setEditId({
      status: false,
      id: "",
    });
  };

  return (
    <Container>
      <div className="space-y-4">
        <NavHeader
          parentPage="Category"
          path="E-commerce"
          currentPage="Category"
        />

        <CatListControlBar
          inputValue={inputValue}
          setInputValue={setInputValue}
          setSearchInputValue={setSearchInputValue}
          searchInputValue={searchInputValue}
          refetch={refetch}
          resetValue={resetValue}
          openSheetRef={openSheetRef}
          editId={editId}
          setImageToShow={setImageToShow}
          imageToShow={imageToShow}
          catId={catId}
          setCatId={setCatId}
        />

        {isLoading || isValidating ? (
          <TableSkeletonLoader />
        ) : (
          <div className="space-y-5">
            <CatListTable
              dropLevel={handleSingleDelete}
              data={data}
              setIdsToDelete={setIdsToDelete}
              handleCheckboxChange={handleCheckboxChange}
              openSheetRef={openSheetRef}
              setInputValue={setInputValue}
              editId={editId}
              handleEdit={handleEdit}
              filterTable={filterTable}
              refetch={refetch}
              setDeleteId={setDeleteId}
              setImageToShow={setImageToShow}
              setCatId={setCatId}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default CatPage;
