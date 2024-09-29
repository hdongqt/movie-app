import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import DefaultLayout from '@/Components/DefaultLayout';
import Table from '@/Components/Common/Table';
import Select from 'react-select';
import { useTypedDispatch } from '../../../Redux/Store';
import {
    IPaginationFilter,
    IPaginationMeta
} from '@/Interfaces/Pagination.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { DEFAULT_CONFIRM_DIALOG, ENUMS, TABLES } from '@/Constants';
import { IMenuTableClick } from '@/Interfaces/Table.interface';
import { Dialogs } from '@/Components/Common';
import { IConfirmDialog } from '@/Interfaces/ConfirmDialog.interface';
import { UsersManagementAction } from '@/Redux/Features/UsersManagement';
import ROLE from '@/Constants/Enums/Roles.enum';
import STATUS from '@/Constants/Enums/Status.enum';
const { fetchAllUsersManagement, changeStatusUser } = UsersManagementAction;
const { USERS_MANAGEMENT_TABLE_HEADER } = TABLES;
const options = [
    { value: '', label: 'Tất cả' },
    { value: ENUMS.STATUS.ACTIVE, label: 'Đang hoạt động' },
    { value: ENUMS.STATUS.INACTIVE, label: 'Vô hiệu hoá' }
];
interface IUsersTable {
    id: string;
    email: string;
    displayName: string;
    role: ROLE;
    status: STATUS;
    createdAt: string;
    updatedAt: string;
    isOpenMenu?: boolean;
}

const UsersManagement: React.FC = () => {
    const dispatch = useTypedDispatch();
    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.USERS_MANAGEMENT, 'isFetchLoading')
    );

    const pagination: IPaginationFilter = useSelector((state: RootState) =>
        _.get(state.USERS_MANAGEMENT, 'pagination')
    );

    const meta = useSelector((state: RootState): IPaginationMeta | null =>
        _.get(state.USERS_MANAGEMENT, 'meta', null)
    );
    const userTable: IUsersTable[] = useSelector((state: RootState) =>
        _.get(state.USERS_MANAGEMENT, 'userTable')
    );
    const [filters, setFilters] = useState(pagination);

    const [confirmChangeStatus, setConfirmChangeStatus] =
        useState<IConfirmDialog>(DEFAULT_CONFIRM_DIALOG);

    const [dataTable, setDataTable] = useState<IUsersTable[]>([]);

    const menuTableClick: IMenuTableClick = {
        openMenuRow: (id: string) =>
            setDataTable(
                dataTable.map((user) => {
                    return user?.id === id
                        ? { ...user, isOpenMenu: !user.isOpenMenu }
                        : { ...user, isOpenMenu: false };
                })
            ),
        changeStatus: ({ id, type }) => {
            setConfirmChangeStatus({
                isOpen: true,
                message:
                    type === ENUMS.STATUS.ACTIVE
                        ? 'Đồng ý kích hoạt người dùng này'
                        : 'Đồng ý vô hiệu hoá người dùng này',
                state: {
                    id: id,
                    status: type
                }
            });
        }
    };
    const submitChangeStatus = () => {
        const { id, status } = confirmChangeStatus.state;
        if (id && status) {
            dispatch(
                changeStatusUser({
                    id,
                    status,
                    onChangeStatusSuccess: () => {
                        dispatch(fetchAllUsersManagement(filters));
                    }
                })
            );
            setConfirmChangeStatus(DEFAULT_CONFIRM_DIALOG);
        }
    };
    useEffect(() => {
        dispatch(fetchAllUsersManagement(filters));
    }, [filters]);

    useEffect(() => {
        if (userTable) {
            setDataTable(
                userTable.map((user) => {
                    return {
                        ...user,
                        isOpenMenu: false
                    };
                })
            );
        } else setDataTable([]);
    }, [userTable]);

    const __renderContent = () => {
        return (
            <>
                <h2 className="text-3xl font-medium text-slate-800 border-b pb-2 border-gray-300">
                    Quản lý Người dùng
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
                    </div>
                    <Table
                        columns={USERS_MANAGEMENT_TABLE_HEADER}
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

export default UsersManagement;
