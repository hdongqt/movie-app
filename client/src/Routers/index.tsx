import { Router, useRoutes } from 'react-router-dom';
import UserRouters, { ForbiddenRouter } from './User.routers';
import AdminRouters from './Admin.routers';
import { useLayoutEffect, useState } from 'react';
import ScrollToTop from '@/Components/Common/ScrollToTop';
import history from '@/Utils/Navigation';
import { Intro } from '@/Components/LayoutPart';

const CustomRouter = ({ history, ...props }: any) => {
    const [state, setState] = useState({
        action: history.action,
        location: history.location
    });

    useLayoutEffect(() => history.listen(setState), [history]);

    return (
        <Router
            {...props}
            location={state.location}
            navigationType={state.action}
            navigator={history}
        />
    );
};

const AppRoutes = () => {
    const routes = useRoutes([UserRouters, AdminRouters, ForbiddenRouter]);
    return (
        <>
            {routes}
            <Intro />
        </>
    );
};

const RootRouters = () => {
    return (
        <CustomRouter history={history}>
            <ScrollToTop />
            <AppRoutes />
        </CustomRouter>
    );
};

export default RootRouters;
