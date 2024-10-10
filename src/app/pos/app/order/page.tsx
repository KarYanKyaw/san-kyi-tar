"use client";
import Container from "@/components/Container.components";
import { PaginationComponent } from "@/components/pos/inventory";
import NavHeader from "@/components/pos/NavHeader";
import OrderTable from "@/components/pos/order/OrderTable";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { Backend_URL, getFetch } from "@/lib/fetch";
import React, { useState } from "react";
import useSWR from "swr";

const OrderPage = () => {
  const getData = (url: string) => {
    return getFetch(url);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, mutate } = useSWR(
    `${Backend_URL}/orders?page=${currentPage}`,
    getData
  );

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

  return (
    <Container>
      <div className="space-y-4">
        <NavHeader parentPage="Order" path="E-commerce" currentPage="Order" />
        {isLoading ? (
          <TableSkeletonLoader />
        ) : (
          <div className=" space-y-4">
            <OrderTable
              data={data?.data}
              refetch={() => mutate(`/orders?page=${currentPage}`)}
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

export default OrderPage;
