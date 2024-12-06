import { SidebarAdmin } from '@/Components/LayoutPart';
import React, { ReactNode } from 'react';
import { AdminHeader } from '../LayoutPart/Header';

interface IAdminLayout {
    children: ReactNode;
}

const AdminLayout: React.FC<IAdminLayout> = (props: IAdminLayout) => {
    const { children } = props;
    return (
        <div className="">
            <div className="flex h-screen overflow-hidden">
                <SidebarAdmin />
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <AdminHeader />
                    <main>
                        <div className="mx-auto max-w-screen-2xl px-8 py-4">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
