"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import Container from "@/components/Container.components";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { Backend_URL } from "@/lib/api";
import { deleteFetch, deleteSingleFetch, getFetch } from "@/lib/fetch";
import ErrorComponent from "@/components/ErrorComponent";
import {
  ProductControlBar,
  ProductDetailBox,
  ProductTable,
} from "@/components/pos/products";
import SweetAlert2 from "react-sweetalert2";
import { useRouter } from "next/navigation";
import { useProductProvider } from "@/app/pos/app/products/Provider/ProductProvider";
import NavHeader from "@/components/pos/NavHeader";
import { PaginationComponent } from "@/components/pos/inventory";

export default function ProductPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const router = useRouter();
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [singleId, setSingleId] = useState<number | undefined>();
  const { editProductFormData, setEditProductFormData } = useProductProvider();

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  // for fetching
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("createdAt");
  const [sortBy, setSortBy] = useState("desc");

  const startIndex = (currentPage - 1) * 10;

  const filterTable = (value: string) => {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
    setFilterType(value);
  };

  const getProducts = (url: string) => {
    return getFetch(url);
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `${Backend_URL}/products?page=${currentPage}&search=${searchInputValue}&orderDirection=${sortBy}&orderBy=${filterType}`,
    getProducts,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      errorRetryInterval: 5000,
      revalidateOnMount: true,
      refreshWhenHidden: true,
    }
  );

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

  const refetch = () => {
    mutate(
      `${Backend_URL}/products?page=${currentPage}&search=${searchInputValue}&orderDirection=${sortBy}&orderBy=${filterType}`
    );
  };

  // delete
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const product = parseInt(event.target.id);

    setIdsToDelete((prevIds) => {
      if (prevIds.includes(product)) {
        return prevIds.filter((item) => item !== product);
      } else {
        return [...prevIds, product];
      }
    });
  };

  const fetcher = async (url: string, { arg }: { arg: { ids: number[] } }) => {
    return deleteFetch(url, arg);
  };

  const { error: deleteError, trigger: drop } = useSWRMutation(
    `${Backend_URL}/products`,
    fetcher,
    {
      onSuccess: () => setEditId({ ...editId, status: false }),
    }
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
    `${Backend_URL}/products/${deleteId}`,
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

  const handleOpenDetailBox = (id: number) => {
    setSwalProps({
      ...swalProps,
      show: true,
    });
    setSingleId(id);
  };

  const closeDetailBox = () => {
    setSwalProps({
      ...swalProps,
      show: false,
    });
  };

  const { data: singleData, isLoading: singleLoading } = useSWR(
    singleId ? `${Backend_URL}/products/${singleId}` : null,
    getFetch,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
    }
  );

  const handleEdit = async (id: any) => {
    setEditId({
      status: true,
      id,
    });
    setSingleId(id);
  };

  useEffect(() => {
    if (editId.status && singleData) {
      setEditProductFormData({
        id: singleId as number,
        addTo: {
          eCommerce: singleData.isEcommerce,
          pos: singleData.isPos,
        },
        name: singleData.name,
        description: singleData.description,
        gender: singleData.gender,
        brand: singleData.productBrand.id,
        productCode: singleData.productCode,
        productTypeId: singleData.productType.id,
        productCategoryId: singleData.productCategory.id,
        productFittingId: singleData.productFitting.id,
        medias: singleData.medias,
        stockPrice: singleData.stockPrice,
        salePrice: singleData.salePrice,
        discount: singleData.discountPrice,
        profitInPercent: singleData.percentage,
        profitInDigit: singleData.profitValue,
        productVariants: singleData.productVariants,
      });
      router.push("/pos/app/products/edit-product-step/1");
    }
  }, [editId, singleData]);

  return (
    <Container>
      <NavHeader
        parentPage="Product"
        path="Products"
        currentPage="Product Lists"
      />
      <div className="space-y-5">
        <ProductControlBar
          isSelected={idsToDelete.length > 0}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
          drop={handleDelete}
        />

        {error ? (
          <ErrorComponent refetch={refetch} />
        ) : (
          <>
            {isLoading || isValidating ? (
              <TableSkeletonLoader />
            ) : (
              <div className=" space-y-4">
                <ProductTable
                  data={data?.data}
                  openDetail={handleOpenDetailBox}
                  setIdsToDelete={setIdsToDelete}
                  handleCheckboxChange={handleCheckboxChange}
                  editId={editId}
                  handleEdit={handleEdit}
                  filterTable={filterTable}
                  refetch={refetch}
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
                  lastPage={data?.totalPages}
                />
              </div>
            )}
          </>
        )}
      </div>
      {isClient && (
        <SweetAlert2
          customClass={{
            popup: " !w-screen !h-screen ",
          }}
          {...swalProps}
          didClose={() => closeDetailBox()}
        >
          <ProductDetailBox
            isLoading={singleLoading}
            data={singleData}
            handleClose={closeDetailBox}
          />
        </SweetAlert2>
      )}
    </Container>
  );
}
