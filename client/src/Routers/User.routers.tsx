import { Outlet } from 'react-router-dom';

import { UserContainer } from '@/Containers';
import { ROUTERS } from '@/Constants';
import ProtectedRoute from './Protected.routers';

const UserRouters = {
    path: ROUTERS.HOME,
    element: <Outlet />,
    children: [
        {
            path: ROUTERS.HOME,
            element: <UserContainer.Home />
        },
        {
            path: ROUTERS.FILM,
            element: <UserContainer.Movies />
        },
        {
            path: ROUTERS.FILM_DETAIL,
            element: <UserContainer.MovieDetail />
        },
        {
            path: '/film/:id/watch',
            element: <UserContainer.MovieDetail />
        },
        {
            path: '/genre',
            element: <UserContainer.Movies />
        },
        {
            path: '/person/:id',
            element: <UserContainer.Persons />
        },
        {
            path: '/search',
            element: <UserContainer.Search />
        },
        {
            path: '/favorites',
            element: <UserContainer.Favorites />
        },
        {
            path: '/profile',
            element: (
                <ProtectedRoute location={ROUTERS.PROFILE}>
                    <UserContainer.Profile />
                </ProtectedRoute>
            )
        }
    ]
};

const ForbiddenRouter = {
    path: '*',
    element: <UserContainer.PageNotFound />
};

export default UserRouters;

export { ForbiddenRouter };
