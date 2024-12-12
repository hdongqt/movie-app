import React from 'react';
import UserLayout from './UserLayout';
import AdminLayout from './AdminLayout';
import { IHelmet } from '@/Interfaces/Helmet.interface';
import { Helmet } from 'react-helmet';

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
                            <meta
                                property="og:image"
                                content="https://i.ibb.co/9tXCC1D/Gemini-Generated-Image-b7z5hpb7z5hpb7z5.png"
                            />
                            <meta
                                property="og:url"
                                content="https://bronzefilm.vercel.app/"
                            />
                            <meta
                                property="og:image:type"
                                content="image/png"
                            />
                            <meta property="og:image:width" content="300" />
                            <meta property="og:image:height" content="300" />
                            <meta
                                property="og:image:alt"
                                content="Bronze Film"
                            ></meta>
                        </Helmet>
                        <UserLayout children={children} />
                    </>
                );
        }
    };

    return <>{__renderPortal()}</>;
};

export default DefaultLayout;
