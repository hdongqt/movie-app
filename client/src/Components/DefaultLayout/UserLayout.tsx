import React from 'react';
import {
    AuthModal,
    Footer,
    SidebarUser,
    UserHeader
} from '@/Components/LayoutPart';
import ScrollToTop from '@/Components/Common/ScrollToTop';

interface IUserLayout {
    children: JSX.Element;
}

const UserLayout: React.FC<IUserLayout> = (props: IUserLayout) => {
    const { children } = props;
    return (
        <>
            <UserHeader />
            <SidebarUser />
            <AuthModal />
            <main className="min-h-dvh">{children}</main>
            <Footer />
            <ScrollToTop />
        </>
    );
};

export default UserLayout;
