import { ROUTERS, ADMIN_ROUTERS } from '@/Constants';
import { IMenuSettings } from '@/Interfaces/Menu.interface';

const USER_SETTINGS: IMenuSettings[] = [
    {
        label: 'Yêu thích',
        value: ROUTERS.FAVORITES,
        icon: <i className="icon-heart text-red-600" />
    },
    {
        label: 'Đăng xuất',
        value: 'logout',
        icon: <i className="icon-signout" />
    }
];

const ADMIN_SETTINGS: IMenuSettings[] = [
    {
        label: 'Dashboard',
        value: ADMIN_ROUTERS.ADMIN_DASHBOARD,
        icon: <i className="icon-heart" />
    },
    {
        label: 'Đăng xuất',
        value: 'logout',
        icon: <i className="icon-signout" />
    }
];

export { USER_SETTINGS, ADMIN_SETTINGS };
