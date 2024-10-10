import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface PaginationComponentProps {
  goToFirstPage: () => void;
  currentPage: number;
  decrementPage: () => void;
  incrementPage: () => void;
  goToLastPage: () => void;
  lastPage: number;
}

const PaginationComponent = ({
  goToFirstPage,
  currentPage,
  decrementPage,
  incrementPage,
  goToLastPage,
  lastPage,
}: PaginationComponentProps) => {
  return (
    <div className="flex justify-end items-start">
      <div className="flex items-center">
        <p className="text-sm text-primary/50">
          page ( {currentPage} ) of ( {lastPage} )
        </p>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  onClick={goToFirstPage}
                  isActive={currentPage !== 1}
                  className={`cursor-pointer ${
                    currentPage == 1 && "pointer-events-none"
                  } `}
                >
                  <DoubleArrowLeftIcon width={20} height={20} />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={decrementPage}
                  className={`cursor-pointer ${
                    currentPage == 1 && "pointer-events-none"
                  } `}
                  isActive={currentPage !== 1}
                >
                  <ChevronLeftIcon width={20} height={20} />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={incrementPage}
                  isActive={currentPage !== lastPage}
                  className={`cursor-pointer ${
                    currentPage == lastPage && "pointer-events-none"
                  } `}
                >
                  <ChevronRightIcon width={20} height={20} />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={goToLastPage}
                  isActive={currentPage !== lastPage}
                  className={`cursor-pointer ${
                    currentPage == lastPage && "pointer-events-none"
                  } `}
                >
                  <DoubleArrowRightIcon width={20} height={20} />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
