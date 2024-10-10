"use client";

import Container from "@/components/Container.components";
import { PaginationComponent } from "@/components/pos/inventory";
import LevelListTable from "@/components/pos/level-list/LeveListTable";
import LevelListControlBar from "@/components/pos/level-list/LevelListControlBar";
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

const LevelList = () => {
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [inputValue, setInputValue] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [promotionId, setPromotionId] = useState("");

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

  const getSizes = (url: string) => {
    return getFetch(url);
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${Backend_URL}/specials?page=${currentPage}&search=${searchInputValue}&orderDirection=${sortBy}&orderBy=${filterType}`,
    getSizes,
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
      revalidateOnMount: true,
    }
  );

  const refetch = () => {
    return mutate(
      `${Backend_URL}/specials?page=${currentPage}&search=${searchInputValue}&orderDirection=${sortBy}&orderBy=${filterType}`
    );
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

  const { error: deleteError, trigger: drop } = useSWRMutation(
    `${Backend_URL}/specials`,
    fetcher
  );

  const handleDelete = async () => {
    const data = await drop({ ids: idsToDelete });
    if (data.status) setIdsToDelete([]);
    refetch();
  };

  // single delete

  const singleDeleteFetcher = async (url: string) => {
    return deleteSingleFetch(url);
  };

  const { error: singleDeleteError, trigger: singleDrop } = useSWRMutation(
    `${Backend_URL}/specials/${deleteId}`,
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
    setEditId({
      status: false,
      id: "",
    });
  };

  return (
    <Container>
      <div className="space-y-4">
        <NavHeader
          parentPage="Level List"
          path="CRM"
          currentPage="Level List"
        />

        <LevelListControlBar
          inputValue={inputValue}
          setInputValue={setInputValue}
          setSearchInputValue={setSearchInputValue}
          searchInputValue={searchInputValue}
          refetch={refetch}
          resetValue={resetValue}
          openSheetRef={openSheetRef}
          promotionId={promotionId}
          setPromotionId={setPromotionId}
          editId={editId}
        />

        {isLoading || isValidating ? (
          <TableSkeletonLoader />
        ) : (
          <div className="space-y-5">
            <LevelListTable
              dropLevel={handleSingleDelete}
              data={data?.data}
              setIdsToDelete={setIdsToDelete}
              handleCheckboxChange={handleCheckboxChange}
              openSheetRef={openSheetRef}
              setInputValue={setInputValue}
              editId={editId}
              handleEdit={handleEdit}
              filterTable={filterTable}
              refetch={refetch}
              setDeleteId={setDeleteId}
              setPromotionId={setPromotionId}
            />
            <PaginationComponent
              goToFirstPage={goToFirstPage}
              currentPage={currentPage}
              decrementPage={decrementPage}
              incrementPage={incrementPage}
              goToLastPage={goToLastPage}
              lastPage={data?.totalPages}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default LevelList;
