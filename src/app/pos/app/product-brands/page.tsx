"use client";

import Container from "@/components/Container.components";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import NavHeader from "@/components/pos/NavHeader";
import { BrandControlBar, BrandTable } from "@/components/pos/brand";
import { PaginationComponent } from "@/components/pos/inventory";
import { Backend_URL } from "@/lib/api";
import { deleteFetch, deleteSingleFetch, getFetch } from "@/lib/fetch";
import { useRef, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export default function ProductBrandsPage() {
  // const [isLoading, setIsLoading] = useState(true);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [brandImageToShow, setBrandImageToShow] = useState<string | File>("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [deleteId, setDeleteId] = useState<number | undefined>();

  const closeSheetRef = useRef();
  const openSheetRef = useRef<HTMLDivElement>(null);

  // for fetching
  const [currentPage, setCurrentPage] = useState(1);

  const [filterType, setFilterType] = useState("createdAt");
  const [sortBy, setSortBy] = useState("desc");

  const filterTable = (value: string) => {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
    setFilterType(value);
  };

  const getBrands = (url: string) => {
    return getFetch(url);
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

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${Backend_URL}/product-brands?page=${currentPage}&search=${searchInputValue}&orderDirection=${sortBy}&orderBy=${filterType}`,
    getBrands,
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
      `${Backend_URL}/product-brands?page=${currentPage}&search=${searchInputValue}&orderDirection=${sortBy}&orderBy=${filterType}`
    );
  };
  // delete

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = parseInt(event.target.id);

    setIdsToDelete((prevIds) => {
      if (prevIds.includes(type)) {
        return prevIds.filter((item) => item !== type);
      } else {
        return [...prevIds, type];
      }
    });
  };

  const fetcher = async (url: string, { arg }: { arg: { ids: number[] } }) => {
    return deleteFetch(url, arg);
  };

  const { error: deleteError, trigger: drop } = useSWRMutation(
    `${Backend_URL}/product-brands`,
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
    `${Backend_URL}/product-brands/${deleteId}`,
    singleDeleteFetcher
  );

  const handleSingleDelete = async () => {
    const data = await singleDrop();
    if (data.status) setDeleteId(undefined);
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
    setInputValue("");
  };

  const startIndex = (currentPage - 1) * 10;

  return (
    <Container>
      <div className="space-y-3">
        <NavHeader parentPage="Brand" path="Product" currentPage="Brand" />
        <div className=" space-y-3">
          <BrandControlBar
            isSelected={idsToDelete.length > 0}
            closeRef={closeSheetRef}
            dropType={handleDelete}
            openSheetRef={openSheetRef}
            editId={editId}
            setEditId={setEditId}
            inputValue={inputValue}
            setInputValue={setInputValue}
            resetValue={resetValue}
            searchInputValue={searchInputValue}
            setSearchInputValue={setSearchInputValue}
            refetch={refetch}
            brandImageToShow={brandImageToShow}
            setBrandImageToShow={setBrandImageToShow}
          />

          {isLoading || isValidating ? (
            <TableSkeletonLoader />
          ) : (
            <div className="space-y-5">
              <BrandTable
                dropType={handleDelete}
                data={data?.data}
                setIdsToDelete={setIdsToDelete}
                handleCheckboxChange={handleCheckboxChange}
                openSheetRef={openSheetRef}
                setInputValue={setInputValue}
                editId={editId}
                handleEdit={handleEdit}
                filterTable={filterTable}
                refetch={refetch}
                setBrandImageToShow={setBrandImageToShow}
                handleSingleDelete={handleSingleDelete}
                setDeleteId={setDeleteId}
                startIndex={startIndex}
              />
              <PaginationComponent
                goToFirstPage={goToFirstPage}
                currentPage={currentPage}
                decrementPage={decrementPage}
                incrementPage={incrementPage}
                goToLastPage={goToLastPage}
                lastPage={currentPage}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
