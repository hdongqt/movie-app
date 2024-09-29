import React, { useEffect } from 'react';

import { AuthModal } from '@/Components/LayoutPart';
import { Footer } from '@/Components/LayoutPart';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import { useTypedDispatch } from '@/Redux/Store';
import { getInfo } from '@/Redux/Features/Auth/AuthAction';
import Utils from '@/Utils';

type PORTAL_TYPE = 'USER' | 'ADMIN';
interface ILayout {
    children: JSX.Element;
    portalFor?: PORTAL_TYPE;
}

const DefaultLayout: React.FC<ILayout> = (props: ILayout) => {
    const { children, portalFor } = props;
    const __renderPortal = () => {
        switch (portalFor) {
            case 'ADMIN':
                return <AdminLayout children={children} />;
            default:
                return <UserLayout children={children} />;
        }
    };

    return <>{__renderPortal()}</>;
};

export default DefaultLayout;
