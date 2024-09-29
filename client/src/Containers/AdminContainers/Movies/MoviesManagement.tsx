import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import DefaultLayout from '@/Components/DefaultLayout';
import Table from '@/Components/Common/Table';
import Select from 'react-select';
import { useTypedDispatch } from '../../../Redux/Store';
import { MoviesManagementAction } from '@/Redux/Features/MoviesManagement';
import {
    IPaginationFilter,
    IPaginationMeta
} from '@/Interfaces/Pagination.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { MOVIES_MANAGEMENT_TABLE_HEADER } from '@/Constants/Tables/MoviesManagement.table';
import { DEFAULT_CONFIRM_DIALOG, ENUMS } from '@/Constants';
import { IMenuTableClick } from '@/Interfaces/Table.interface';
import { IMovie } from '@/Interfaces/Movie.interface';
import { Dialogs } from '@/Components/Common';
import { IConfirmDialog } from '@/Interfaces/ConfirmDialog.interface';
import { Link } from 'react-router-dom';

const { fetchAllMoviesManagement, changeStatusMovie } = MoviesManagementAction;

interface IMovieTable extends IMovie {
    isOpenMenu?: boolean;
}

const options = [
    { value: '', label: 'Tất cả' },
    { value: ENUMS.STATUS.ACTIVE, label: 'Đã phê duyệt' },
    { value: ENUMS.STATUS.INACTIVE, label: 'Ẩn' },
    { value: ENUMS.STATUS.REVIEWING, label: 'Chờ phê duyệt' }
];

const MoviesManagement: React.FC = () => {
    const dispatch = useTypedDispatch();
    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.MOVIES_MANAGEMENT, 'isFetchLoading')
    );

    const pagination: IPaginationFilter = useSelector((state: RootState) =>
        _.get(state.MOVIES_MANAGEMENT, 'pagination')
    );

    const meta = useSelector((state: RootState): IPaginationMeta | null =>
        _.get(state.MOVIES_MANAGEMENT, 'meta', null)
    );
    const movieTable: IMovie[] = useSelector((state: RootState) =>
        _.get(state.MOVIES_MANAGEMENT, 'movieTable')
    );
    const [filters, setFilters] = useState(pagination);

    const [confirmChangeStatus, setConfirmChangeStatus] =
        useState<IConfirmDialog>(DEFAULT_CONFIRM_DIALOG);

    useEffect(() => {
        dispatch(fetchAllMoviesManagement(filters));
    }, [filters]);

    const [dataTable, setDataTable] = useState<IMovieTable[]>([]);

    useEffect(() => {
        if (movieTable) {
            setDataTable(
                movieTable.map((movie) => {
                    return {
                        ...movie,
                        isOpenMenu: false
                    };
                })
            );
        } else setDataTable([]);
    }, [movieTable]);

    const submitChangeStatus = () => {
        const { id, status } = confirmChangeStatus.state;
        if (id && status) {
            dispatch(
                changeStatusMovie({
                    id,
                    status,
                    onChangeStatusSuccess: () => {
                        dispatch(fetchAllMoviesManagement(filters));
                    }
                })
            );
            setConfirmChangeStatus(DEFAULT_CONFIRM_DIALOG);
        }
    };

    const menuTableClick: IMenuTableClick = {
        openMenuRow: (id: string) =>
            setDataTable(
                dataTable.map((movie) => {
                    return movie?.id === id
                        ? { ...movie, isOpenMenu: !movie.isOpenMenu }
                        : { ...movie, isOpenMenu: false };
                })
            ),
        changeStatus: ({ id, type }) => {
            setDataTable(
                dataTable.map((movie) => {
                    return movie?.id === id
                        ? { ...movie, isOpenMenu: !movie.isOpenMenu }
                        : { ...movie, isOpenMenu: false };
                })
            );
            setConfirmChangeStatus({
                isOpen: true,
                message:
                    type === ENUMS.STATUS.ACTIVE
                        ? 'Đồng ý phê duyệt phim này'
                        : type === ENUMS.STATUS.INACTIVE
                        ? 'Đồng ý ẩn phim này'
                        : 'Đồng ý xoá phim này',
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
                    Quản lý Phim
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
                        columns={MOVIES_MANAGEMENT_TABLE_HEADER}
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

export default MoviesManagement;
