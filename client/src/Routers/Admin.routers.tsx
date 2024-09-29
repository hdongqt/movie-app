import { Outlet } from 'react-router-dom';

import { AdminContainer } from '@/Containers';
import { ROUTERS } from '@/Constants';
import ProtectedRoute from './Protected.routers';

const AdminRouters = {
    path: ROUTERS.ADMIN_DASHBOARD,
    element: <Outlet />,
    children: [
        {
            path: ROUTERS.ADMIN_DASHBOARD,
            element: (
                <ProtectedRoute location={ROUTERS.ADMIN_DASHBOARD}>
                    <AdminContainer.AdminDashboard />
                </ProtectedRoute>
            )
        },
        {
            path: ROUTERS.CRAWL_MANAGEMENT,
            element: (
                <ProtectedRoute location={ROUTERS.CRAWL_MANAGEMENT}>
                    <AdminContainer.Crawls />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.CRAWL_DETAIL}`,
            element: (
                <ProtectedRoute location={ROUTERS.CRAWL_DETAIL}>
                    <AdminContainer.CrawlDetail />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.MOVIES_MANAGEMENT}`,
            element: (
                <ProtectedRoute location={ROUTERS.MOVIES_MANAGEMENT}>
                    <AdminContainer.MoviesManagement />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.CREATE_MOVIE}`,
            element: (
                <ProtectedRoute location={ROUTERS.CREATE_MOVIE}>
                    <AdminContainer.MovieSave />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.UPDATE_MOVIE}`,
            element: (
                <ProtectedRoute location={ROUTERS.UPDATE_MOVIE}>
                    <AdminContainer.MovieSave />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.GENRES_MANAGEMENT}`,
            element: (
                <ProtectedRoute location={ROUTERS.GENRES_MANAGEMENT}>
                    <AdminContainer.GenresManagement />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.CREATE_GENRE}`,
            element: (
                <ProtectedRoute location={ROUTERS.CREATE_GENRE}>
                    <AdminContainer.GenreSave />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.UPDATE_GENRE}`,
            element: (
                <ProtectedRoute location={ROUTERS.UPDATE_GENRE}>
                    <AdminContainer.GenreSave />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.USERS_MANAGEMENT}`,
            element: (
                <ProtectedRoute location={ROUTERS.USERS_MANAGEMENT}>
                    <AdminContainer.UsersManagement />
                </ProtectedRoute>
            )
        },
        {
            path: `${ROUTERS.USER_DETAIL}`,
            element: (
                <ProtectedRoute location={ROUTERS.USER_DETAIL}>
                    <AdminContainer.UserDetail />
                </ProtectedRoute>
            )
        }
    ]
};

export default AdminRouters;
