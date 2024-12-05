import { ROUTERS } from '@/Constants';
import { IMenuItem } from '@/Interfaces/Menu.interface';

const MENU_LIST: IMenuItem[] = [
    {
        label: 'Trang chủ',
        value: ROUTERS.HOME,
        icon: <i className="icon-home text-xl" />
    },
    {
        label: 'Phim',
        value: ROUTERS.FILM,
        icon: <i className="icon-film text-xl" />
    },
    {
        label: 'Phim bộ',
        value: '@TV',
        state: 'tv',
        icon: <i className="icon-facetime-video text-xl" />
    },
    {
        label: 'Phim lẻ',
        value: '@Single',
        state: 'single',
        icon: <i className="icon-expand text-xl" />
    },
    {
        label: 'Thể loại',
        value: '@Genre',
        icon: <i className="icon-align-left text-xl" />
    },
    {
        label: 'Năm',
        value: '@Year',
        icon: <i className="icon-calendar text-xl" />
    }
];

const MENU_LIST_MOBILE = [
    ...MENU_LIST,
    {
        label: 'Tìm kiếm',
        value: ROUTERS.SEARCH,
        icon: <i className="icon-search text-xl" />
    }
];

export { MENU_LIST, MENU_LIST_MOBILE };
