import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import DefaultLayout from '@/Components/DefaultLayout';
import Table from '@/Components/Common/Table';
import Select from 'react-select';
import { CustomModal } from '@/Components/Common';
import { useTypedDispatch } from '../../../Redux/Store';
import { CrawlAction } from '@/Redux/Features/Crawl';
import {
    IPaginationFilter,
    IPaginationMeta
} from '@/Interfaces/Pagination.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { TABLES } from '@/Constants';

const { createCrawl, fetchAllCrawls } = CrawlAction;

const options = [
    { value: '', label: 'Tất cả' },
    { value: 'complete', label: 'Hoàn thành' },
    { value: 'crawling', label: 'Đang hoạt động' },
    { value: 'error', label: 'Lỗi' }
];

const Crawls: React.FC = () => {
    const dispatch = useTypedDispatch();
    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.CRAWL, 'isFetchLoading')
    );
    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.CRAWL, 'isActionLoading')
    );
    const pagination: IPaginationFilter = useSelector((state: RootState) =>
        _.get(state.CRAWL, 'pagination')
    );

    const meta = useSelector((state: RootState): IPaginationMeta | null =>
        _.get(state.CRAWL, 'meta', null)
    );
    const crawlTable: any = useSelector((state: RootState) =>
        _.get(state.CRAWL, 'crawlTable')
    );
    const [filters, setFilters] = useState(pagination);
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [pageCrawl, setPageCrawl] = useState(1);

    useEffect(() => {
        dispatch(fetchAllCrawls(filters));
    }, [filters]);

    const handleCreateCrawl = () => {
        dispatch(
            createCrawl({
                page: pageCrawl,
                handleClose: () => {
                    dispatch(fetchAllCrawls(filters));
                    setIsOpenCreate(false);
                }
            })
        );
    };

    const __renderContent = () => {
        return (
            <>
                <h2 className="text-3xl font-medium text-slate-800 border-b pb-2 border-gray-300">
                    Crawl
                </h2>
                <div className="mt-3">
                    <div className="flex items-center gap-2 justify-between mb-3">
                        <Select
                            isSearchable={false}
                            closeMenuOnScroll
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            options={options}
                            value={
                                options.find(
                                    (op) => op.value === filters.status
                                ) || options[0]
                            }
                            onChange={(newValue) => {
                                newValue?.value !== filters.status &&
                                    setFilters({
                                        ...filters,
                                        status: newValue?.value
                                    });
                            }}
                            menuPosition="fixed"
                            className="w-44 [&>div]:py-[3px]"
                        />
                        <button
                            onClick={() => setIsOpenCreate(true)}
                            className="px-5 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Tạo mới
                        </button>
                    </div>
                    <Table
                        columns={TABLES.CRAWL_TABLE_HEADER}
                        data={crawlTable}
                        pageCount={meta?.totalPages || 0}
                        currentPage={(meta?.currentPage || 1) - 1}
                        isLoading={isFetchLoading}
                        showEntity={filters.limit}
                        onChangeShowEntity={(value: number) =>
                            setFilters({ ...filters, limit: value })
                        }
                        onChangePage={(page) =>
                            setFilters({ ...filters, page: page })
                        }
                    />
                    <CustomModal
                        isOpen={isOpenCreate}
                        isLoading={isActionLoading}
                        onClose={() => setIsOpenCreate(false)}
                        title="Tạo Crawl"
                        actionButton={[
                            {
                                name: 'Lưu',
                                classFirst: 'bg-green-600 hover:bg-green-700',
                                onClickAction: handleCreateCrawl
                            }
                        ]}
                    >
                        <div className="sm:min-w-96 pb-4">
                            <label className="text-base font-medium text-black block">
                                Trang:
                            </label>
                            <input
                                type="number"
                                value={pageCrawl}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setPageCrawl(+e.target.value)}
                                placeholder="Trang cần lấy dữ liệu phim"
                                className="w-full inline-block mt-2 border py-2.5 px-2 outline-none border-gray-400 rounded"
                            />
                        </div>
                    </CustomModal>
                </div>
            </>
        );
    };
    return <DefaultLayout portalFor="ADMIN" children={__renderContent()} />;
};

export default Crawls;
