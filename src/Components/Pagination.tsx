import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  items: any[];
  onChangePage: (newPageNumber: number) => void;
}

interface PaginationButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <a
      href="#"
      className={`relative inline-flex items-center ${className} px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
      onClick={onClick}
    >
      {children}
    </a>
  );
};
interface PaginationLinkProps {
  pageNumber: number;
  currentPage: number;
  onClick: (pageNumber: number) => void;
}
const PaginationLink: React.FC<PaginationLinkProps> = ({
  pageNumber,
  currentPage,
  onClick,
}) => {
  const className =
    pageNumber === currentPage
      ? "bg-indigo-600 text-white"
      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50";
  return (
    <PaginationButton onClick={() => onClick(pageNumber)} className={className}>
      {pageNumber}
    </PaginationButton>
  );
};
const Pagination: React.FC<PaginationProps> = ({ items, onChangePage }) => {
  const limit = 10; // 10 items per page
  const totalPages = Math.ceil(items.length / limit);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPageNumber: number) => {
    setCurrentPage(newPageNumber);
    onChangePage(newPageNumber);
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <PaginationButton onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </PaginationButton>
        <PaginationButton onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </PaginationButton>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{(currentPage - 1) * limit + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * limit, items.length)}
            </span>{" "}
            of <span className="font-medium">{items.length}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <PaginationButton onClick={() => handlePageChange(currentPage - 1)}>
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </PaginationButton>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationLink
                key={index + 1}
                pageNumber={index + 1}
                currentPage={currentPage}
                onClick={handlePageChange}
              />
            ))}
            <PaginationButton onClick={() => handlePageChange(currentPage + 1)}>
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </PaginationButton>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
