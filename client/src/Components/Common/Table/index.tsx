import { Pagination } from '@/Components/Common';
import { IMenuTableClick, ITableColumn } from '@/Interfaces/Table.interface';
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface TableProps {
    isLoading: boolean;
    pageCount: number;
    currentPage: number;
    columns: ITableColumn[];
    data: any[];
    menuClick?: IMenuTableClick;
    showEntity: number;
    onChangeShowEntity: (value: number) => void;
    onChangePage: (page: number) => void;
}

const options = [
    { value: 25, label: '25/page' },
    { value: 50, label: '50/page' }
];

const Table: React.FC<TableProps> = ({
    columns,
    pageCount,
    currentPage,
    menuClick,
    onChangePage,
    onChangeShowEntity,
    showEntity,
    data,
    isLoading
}) => {
    return (
        <div className="rounded shadow border overflow-hidden">
            <div className="custom-table max-h-96 overflow-auto overflow-x-auto">
                <table className="w-full relative bg-white rounded">
                    <thead className="sticky top-0 border-b">
                        <tr>
                            <th className="max-w-12 border-b border-gray-200 bg-gray-50 text-center text-sm font-bold text-gray-900">
                                STT
                            </th>
                            {columns &&
                                columns.map((column, index) => (
                                    <th
                                        key={`header${column.key}${index}`}
                                        style={{
                                            width: column?.width
                                                ? `${column.width}px`
                                                : 'auto'
                                        }}
                                        className={`${
                                            column?.classHeaderFirst
                                                ? column.classHeaderFirst + ' '
                                                : ''
                                        }py-4 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-bold text-gray-900 tracking-wider`}
                                    >
                                        {column.header}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody className="max-h-80 overflow-y-auto ">
                        {isLoading && (
                            <tr className="bg-white border-b border-gray-200 w-full">
                                <td
                                    className="py-10 px-4 text-center w-full"
                                    colSpan={100}
                                >
                                    <span className="inline-block border-gray-300 h-12 w-12 animate-spin rounded-full border-[5px] border-t-blue-600" />
                                </td>
                            </tr>
                        )}
                        {!isLoading &&
                            data?.length > 0 &&
                            data.map((row, rowIndex) => (
                                <tr
                                    key={`rowTable${rowIndex}`}
                                    className="bg-white border-b border-gray-200"
                                >
                                    <td className="text-center w-12">
                                        {rowIndex + 1}
                                    </td>
                                    {columns &&
                                        columns.map((column, colIndex) => (
                                            <td
                                                key={`table${column.key}${colIndex}`}
                                                className={`${
                                                    column?.classRowFirst
                                                        ? column.classRowFirst +
                                                          ' '
                                                        : ''
                                                }py-4 px-4`}
                                            >
                                                {column.render
                                                    ? column.render(
                                                          row,
                                                          menuClick
                                                      )
                                                    : row[column.key]}
                                            </td>
                                        ))}
                                </tr>
                            ))}
                        {!isLoading && data?.length < 1 && (
                            <tr className="bg-white border-b border-gray-200 w-full">
                                <td
                                    className="py-5 px-4 text-center w-full"
                                    colSpan={100}
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="py-2 flex flex-col sm:flex-row justify-between px-3 items-center">
                <div className="flex items-center gap-2">
                    <Select
                        isSearchable={false}
                        closeMenuOnScroll
                        options={options}
                        value={
                            options.find((op) => op.value === showEntity) ||
                            options[0]
                        }
                        onChange={(newValue) => {
                            newValue &&
                                newValue?.value !== showEntity &&
                                onChangeShowEntity(newValue.value);
                        }}
                        className="mb-3 mt-3"
                        menuPosition="fixed"
                    />
                </div>
                <div className="bg-slate-100 px-2 py-1 rounded-full border border-gray-100 shadow">
                    <Pagination
                        pageCount={pageCount}
                        currentPage={currentPage}
                        handlePageClick={({ selected }) =>
                            onChangePage(selected)
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Table;
