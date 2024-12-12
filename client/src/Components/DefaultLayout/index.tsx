import React from 'react';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import { IHelmet } from '@/Interfaces/Helmet.interface';
import { Helmet } from 'react-helmet';

import OgImage from '@/Assets/OgImage/og-image.png';

type PORTAL_TYPE = 'USER' | 'ADMIN';
interface ILayout {
    helmet?: IHelmet;
    children: JSX.Element;
    portalFor?: PORTAL_TYPE;
}

const DefaultLayout: React.FC<ILayout> = (props: ILayout) => {
    const { children, portalFor, helmet } = props;
    const __renderPortal = () => {
        switch (portalFor) {
            case 'ADMIN':
                return (
                    <>
                        <Helmet>
                            <title>
                                {helmet?.title || 'Bronze Film: Admin'}
                            </title>
                            <meta
                                name="description"
                                content={`${
                                    helmet?.description ||
                                    'Bronze Film, Xem phim hay, phim hot, miễn phí, không thương mại, phim không quảng cáo, xem phim Bronze phim'
                                }`}
                            />
                        </Helmet>
                        <AdminLayout children={children} />
                    </>
                );
            default:
                return (
                    <>
                        <Helmet>
                            <title>
                                {helmet?.title ||
                                    'Bronze Film: Xem phim không giới hạn'}
                            </title>
                            <meta
                                name="description"
                                content={`${
                                    helmet?.description ||
                                    'Bronze Film, Xem phim hay, phim hot, miễn phí, không thương mại, phim không quảng cáo, xem phim Bronze phim'
                                }`}
                            />
                            <meta property="og:image" content={OgImage} />
                        </Helmet>
                        <UserLayout children={children} />
                    </>
                );
        }
    };

    return <>{__renderPortal()}</>;
};

export default DefaultLayout;
