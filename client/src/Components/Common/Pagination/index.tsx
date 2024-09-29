import _ from 'lodash';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
interface PaginationProps {
    currentPage?: number;
    pageCount: number;
    marginPagesDisplayed?: number;
    pageRangeDisplayed?: number;
    size?: 'Normal' | 'Large';
    handlePageClick: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage = 0,
    handlePageClick,
    marginPagesDisplayed = 1,
    size = 'Normal',
    pageRangeDisplayed = 1,
    pageCount
}: PaginationProps) => {
    return (
        <ReactPaginate
            forcePage={currentPage}
            pageCount={pageCount || 1}
            marginPagesDisplayed={marginPagesDisplayed}
            pageRangeDisplayed={pageRangeDisplayed}
            onPageChange={handlePageClick}
            breakLabel={
                <span className="font-medium text-lg text-blue-600">...</span>
            }
            activeClassName="pointer-events-none text-white overflow-hidden"
            activeLinkClassName="!text-white bg-blue-600"
            pageClassName="transition border border-solid border-gray-300 hover:bg-gray-300 rounded-full text-base"
            pageLinkClassName="w-8 h-8 flex items-center justify-center text-blue-600"
            nextLabel={
                <span
                    className={`transition ${
                        currentPage + 1 < pageCount
                            ? 'text-blue-500 px-1 hover:text-blue-700 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <i className="icon-chevron-right"></i>
                </span>
            }
            previousLabel={
                <span
                    className={`transition ${
                        currentPage + 1 > 1
                            ? 'text-blue-600 px-1 hover:text-blue-700 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <i className="icon-chevron-left"></i>
                </span>
            }
            containerClassName="flex items-center gap-3 justify-center"
        />
    );
};

export default Pagination;
