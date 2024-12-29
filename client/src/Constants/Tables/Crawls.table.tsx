import dayjs from 'dayjs';
import { ITableColumn } from '@/Interfaces/Table.interface';
import Utils from '@/Utils';
import { ROUTERS } from '..';
const CRAWL_TABLE_HEADER: ITableColumn[] = [
    {
        key: '',
        header: 'Bắt đầu',
        width: 150,
        render: (data: any) => (
            <span className="inline-block min-w-32">
                {data?.createdAt && Utils.formatDateTime(data.createdAt)}
            </span>
        )
    },
    {
        key: '',
        header: 'Kết thúc',
        width: 150,
        render: (data: any) => (
            <span className="inline-block min-w-32">
                {data?.finishedAt && Utils.formatDateTime(data.finishedAt)}
            </span>
        )
    },
    {
        key: '',
        header: 'Trạng thái',
        classHeaderFirst: 'text-center',
        classRowFirst: 'text-center',
        width: 150,
        render: (data: any) => (
            <span
                className={`text-sm inline-block min-w-32 md:min-w-24 lg:min-w-16 text-center font-medium text-white px-2 py-1 rounded-full first-letter:uppercase ${
                    data?.status === 'complete'
                        ? 'bg-green-500'
                        : data?.status === 'crawling'
                        ? 'bg-sky-500'
                        : 'bg-red-600'
                }`}
            >
                {data?.status && data.status === 'complete'
                    ? 'Hoàn thành'
                    : data.status === 'crawling'
                    ? 'Đang hoạt động'
                    : 'Lỗi'}
            </span>
        )
    },
    {
        key: '',
        header: 'Chi tiết',
        width: 90,
        render: (data: any) => (
            <button
                onClick={() => {
                    Utils.redirect(ROUTERS.CRAWL_DETAIL, { id: data?.id });
                }}
                className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-sky-200 text-sm text-blue-600 flex items-center justify-center transition"
            >
                <i className="icon-arrow-right" />
            </button>
        )
    }
];
export { CRAWL_TABLE_HEADER };
