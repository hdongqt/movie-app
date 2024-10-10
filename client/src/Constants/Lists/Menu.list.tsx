import { ROUTERS } from '@/Constants';

const MENU_LIST = [
    {
        label: 'Trang chủ',
        value: ROUTERS.HOME,
        icon: <i className="icon-home text-2xl" />
    },
    {
        label: 'Phim',
        value: ROUTERS.FILM,
        isMultiple: true,
        icon: <i className="icon-film text-xl" />
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
