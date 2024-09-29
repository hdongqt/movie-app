import dayjs from 'dayjs';
import _ from 'lodash';
import { ITableColumn } from '@/Interfaces/Table.interface';
import Utils from '@/Utils';
import { ENUMS, ROUTERS } from '@/Constants';
import { Popover } from 'react-tiny-popover';

const { STATUS } = ENUMS;

const STATUS_COMMON: any = {
    [STATUS.ACTIVE]: {
        class: 'bg-green-500',
        content: 'Hoạt động'
    },
    [STATUS.INACTIVE]: {
        class: 'bg-red-500',
        content: 'Vô hiệu hoá'
    }
};

const USERS_MANAGEMENT_TABLE_HEADER: ITableColumn[] = [
    {
        key: 'displayName',
        header: 'Tên'
        // classRowFirst: 'text-sm'
    },
    {
        key: 'email',
        header: 'Email'
    },
    {
        key: 'role',
        header: 'Quyền',
        classRowFirst: 'uppercase'
    },
    {
        key: '',
        header: 'Trạng thái',
        classHeaderFirst: 'text-center',
        classRowFirst: 'text-center',
        // width: 150,
        render: (data: any) => (
            <span
                className={`text-sm inline-block min-w-32 md:min-w-24 lg:min-w-16 text-center font-medium text-white px-2 py-1 rounded-full first-letter:uppercase ${[
                    STATUS_COMMON?.[data?.status]?.class
                ]}`}
            >
                {STATUS_COMMON?.[data?.status]?.content}
            </span>
        )
    },
    {
        key: '',
        header: 'Thao tác',
        classHeaderFirst: 'text-center',
        classRowFirst: 'text-center',
        width: 120,
        render: (data: any, menuClick) => (
            <Popover
                isOpen={data?.isOpenMenu}
                positions={['bottom', 'left']}
                padding={0}
                reposition={true}
                transformMode="absolute"
                parentElement={
                    (document.querySelector('.custom-table') as HTMLElement) ||
                    undefined
                }
                onClickOutside={() => {
                    menuClick?.openMenuRow && menuClick.openMenuRow(data.id);
                }}
                content={() => (
                    <ul
                        onScroll={() =>
                            menuClick?.openMenuRow &&
                            menuClick.openMenuRow(data.id)
                        }
                        className="aaa bg-white rounded py-1 px-2 overflow-hidden border shadow min-w-52"
                    >
                        <li>
                            <button
                                onClick={() =>
                                    Utils.redirect(ROUTERS.USER_DETAIL, {
                                        id: data.id
                                    })
                                }
                                className="flex items-center mb-1 gap-5 hover:bg-gray-200 w-full py-1.5 rounded px-3"
                            >
                                <span className="text-lg w-4 text-blue-600">
                                    <i className="icon-eye-open" />
                                </span>
                                <span className="text-blue-600 font-medium">
                                    Xem chi tiết
                                </span>
                            </button>
                        </li>
                        <li>
                            {data?.role !== ENUMS.ROLES.ADMIN && (
                                <button
                                    className="flex items-center mb-1 gap-5 hover:bg-gray-200 w-full py-1.5 rounded px-3"
                                    onClick={() => {
                                        menuClick?.changeStatus &&
                                            menuClick.changeStatus({
                                                id: data.id,
                                                type:
                                                    data?.status !==
                                                    STATUS.INACTIVE
                                                        ? 'inactive'
                                                        : 'active'
                                            });
                                    }}
                                >
                                    <span
                                        className={`text-xl w-4 ${
                                            data?.status !== STATUS.INACTIVE
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        } `}
                                    >
                                        {data?.status !== STATUS.INACTIVE ? (
                                            <i className="icon-ban-circle" />
                                        ) : (
                                            <i className="icon-ok" />
                                        )}
                                    </span>
                                    <span
                                        className={`${
                                            data?.status !== STATUS.INACTIVE
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }   font-medium`}
                                    >
                                        {data?.status !== STATUS.INACTIVE
                                            ? 'Vô hiệu hoá'
                                            : 'Kích hoạt'}
                                    </span>
                                </button>
                            )}
                        </li>
                    </ul>
                )}
            >
                <button
                    onClick={() => {
                        menuClick?.openMenuRow &&
                            menuClick.openMenuRow(data.id);
                    }}
                    className="w-8 h-8 text-lg text-center mx-auto rounded-lg text-gray-600 flex items-center justify-center transition"
                >
                    <i className="icon-ellipsis-horizontal" />
                </button>
            </Popover>
        )
    }
];
export { USERS_MANAGEMENT_TABLE_HEADER };
