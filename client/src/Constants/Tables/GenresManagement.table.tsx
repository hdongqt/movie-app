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
        class: 'bg-gray-500',
        content: 'Ẩn'
    }
};

const GENRES_MANAGEMENT_TABLE_HEADER: ITableColumn[] = [
    {
        key: 'name',
        header: 'Tên thể loại',
        // classRowFirst: 'text-sm'
        width: 150
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
                                    Utils.redirect(ROUTERS.UPDATE_GENRE, {
                                        id: data.id
                                    })
                                }
                                className="flex items-center mb-1 gap-5 hover:bg-gray-200 w-full py-1.5 rounded px-3"
                            >
                                <span className="text-lg w-4 text-blue-600">
                                    <i className="icon-edit" />
                                </span>
                                <span className="text-blue-600 font-medium">
                                    Chỉnh sửa
                                </span>
                            </button>
                        </li>
                        {data?.status !== STATUS.ACTIVE && (
                            <li>
                                <button
                                    className="flex items-center mb-1 gap-5 hover:bg-gray-200 w-full py-1.5 rounded px-3"
                                    onClick={() => {
                                        menuClick?.changeStatus &&
                                            menuClick.changeStatus({
                                                id: data.id,
                                                type: 'active'
                                            });
                                    }}
                                >
                                    <span className="text-xl w-4 text-green-600">
                                        <i className="icon-ok" />
                                    </span>
                                    <span className="text-green-600 font-medium">
                                        Hiển thị
                                    </span>
                                </button>
                            </li>
                        )}
                        {data?.status !== STATUS.INACTIVE && (
                            <li>
                                <button
                                    className="flex items-center mb-1 gap-5 hover:bg-gray-200 w-full py-1.5 rounded px-3"
                                    onClick={() => {
                                        menuClick?.changeStatus &&
                                            menuClick.changeStatus({
                                                id: data.id,
                                                type: 'inactive'
                                            });
                                    }}
                                >
                                    <span className="text-lg w-4 text-sky-950">
                                        <i className="icon-eye-close" />
                                    </span>
                                    <span className="text-sky-950 font-medium">
                                        Ẩn
                                    </span>
                                </button>
                            </li>
                        )}
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
export { GENRES_MANAGEMENT_TABLE_HEADER };
