import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import DefaultLayout from '@/Components/DefaultLayout';
import Table from '@/Components/Common/Table';
import { TABLES } from '@/Constants';
import Select from 'react-select';
import { useTypedDispatch } from '../../../Redux/Store';
import {
    IPaginationFilter,
    IPaginationMeta
} from '@/Interfaces/Pagination.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { DEFAULT_CONFIRM_DIALOG, ENUMS } from '@/Constants';
import { IMenuTableClick } from '@/Interfaces/Table.interface';
import { IMovie } from '@/Interfaces/Movie.interface';
import { Dialogs } from '@/Components/Common';
import { IConfirmDialog } from '@/Interfaces/ConfirmDialog.interface';
import { Link } from 'react-router-dom';
import { GenresManagementAction } from '@/Redux/Features/GenresManagement';

const { fetchAllGenresManagement, changeStatusGenre } = GenresManagementAction;
interface IMovieTable extends IMovie {
    isOpenMenu?: boolean;
}

const options = [
    { value: '', label: 'Tất cả' },
    { value: ENUMS.STATUS.ACTIVE, label: 'Hiển thị' },
    { value: ENUMS.STATUS.INACTIVE, label: 'Ẩn' }
];

const GenresManagement: React.FC = () => {
    const dispatch = useTypedDispatch();
    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.GENRES_MANAGEMENT, 'isFetchLoading')
    );

    const pagination: IPaginationFilter = useSelector((state: RootState) =>
        _.get(state.GENRES_MANAGEMENT, 'pagination')
    );

    const meta = useSelector((state: RootState): IPaginationMeta | null =>
        _.get(state.GENRES_MANAGEMENT, 'meta', null)
    );
    const genreTable: IMovie[] = useSelector((state: RootState) =>
        _.get(state.GENRES_MANAGEMENT, 'genreTable')
    );
    const [filters, setFilters] = useState(pagination);

    const [confirmChangeStatus, setConfirmChangeStatus] =
        useState<IConfirmDialog>(DEFAULT_CONFIRM_DIALOG);

    useEffect(() => {
        dispatch(fetchAllGenresManagement(filters));
    }, [filters]);

    const [dataTable, setDataTable] = useState<IMovieTable[]>([]);

    useEffect(() => {
        if (genreTable) {
            setDataTable(
                genreTable.map((movie) => {
                    return {
                        ...movie,
                        isOpenMenu: false
                    };
                })
            );
        } else setDataTable([]);
    }, [genreTable]);

    const submitChangeStatus = () => {
        const { id, status } = confirmChangeStatus.state;
        if (id && status) {
            dispatch(
                changeStatusGenre({
                    id,
                    status,
                    onChangeStatusSuccess: () => {
                        dispatch(fetchAllGenresManagement(filters));
                    }
                })
            );
            setConfirmChangeStatus(DEFAULT_CONFIRM_DIALOG);
        }
    };

    const menuTableClick: IMenuTableClick = {
        openMenuRow: (id: string) =>
            setDataTable(
                dataTable.map((genre) => {
                    return genre?.id === id
                        ? { ...genre, isOpenMenu: !genre.isOpenMenu }
                        : { ...genre, isOpenMenu: false };
                })
            ),
        changeStatus: ({ id, type }) => {
            setDataTable(
                dataTable.map((genre) => {
                    return genre?.id === id
                        ? { ...genre, isOpenMenu: !genre.isOpenMenu }
                        : { ...genre, isOpenMenu: false };
                })
            );
            setConfirmChangeStatus({
                isOpen: true,
                message:
                    type === ENUMS.STATUS.ACTIVE
                        ? 'Đồng ý hiển thị thể loại này'
                        : 'Đồng ý ẩn thể loại này',
                state: {
                    id: id,
                    status: type
                }
            });
        }
    };

    const __renderContent = () => {
        return (
            <>
                <h2 className="text-3xl font-medium text-slate-800 border-b pb-2 border-gray-300">
                    Quản lý Thể loại
                </h2>
                <div className="mt-3">
                    <div className="flex items-center gap-2 justify-between mb-3">
                        <Select
                            isSearchable={false}
                            closeMenuOnScroll
                            options={options}
                            components={{
                                IndicatorSeparator: () => null
                            }}
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
                            className="w-40 [&>div]:py-[3px]"
                        />
                        <div>
                            <Link
                                className="px-5 inline-block py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition"
                                to="create"
                            >
                                Tạo mới
                            </Link>
                        </div>
                    </div>
                    <Table
                        columns={TABLES.GENRES_MANAGEMENT_TABLE_HEADER}
                        data={dataTable}
                        pageCount={meta?.totalPages || 0}
                        currentPage={(meta?.currentPage || 1) - 1}
                        isLoading={isFetchLoading}
                        menuClick={menuTableClick}
                        showEntity={filters.limit}
                        onChangeShowEntity={(value: number) =>
                            setFilters({ ...filters, limit: value })
                        }
                        onChangePage={(page) =>
                            setFilters({ ...filters, page: page })
                        }
                    />
                    <Dialogs.Confirm
                        confirm={confirmChangeStatus}
                        onCancel={() =>
                            setConfirmChangeStatus(DEFAULT_CONFIRM_DIALOG)
                        }
                        callback={submitChangeStatus}
                    ></Dialogs.Confirm>
                </div>
            </>
        );
    };
    return <DefaultLayout portalFor="ADMIN" children={__renderContent()} />;
};

export default GenresManagement;
