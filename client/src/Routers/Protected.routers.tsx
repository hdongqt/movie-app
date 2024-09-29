import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

import { ROUTERS, ENUMS, USER_ROUTERS, ADMIN_ROUTERS } from '@/Constants';

import Utils from '@/Utils';
import { useTypedDispatch } from '@/Redux/Store';

interface ISectionProps {
    children: JSX.Element;
    location: string;
}

const { ROLES } = ENUMS;

// Declare actions
// const { checkRefreshToken } = AuthActions;

const ProtectedRoute: React.FC<ISectionProps> = ({ children, location }) => {
    // Constructors
    const dispatch = useTypedDispatch();
    const token = Utils.getSavedAccessToken();
    const pathname = useLocation().pathname;
    const savedRefreshToken = Utils.getSavedRefreshToken();
    const userRole = Utils.getRoleUser();

    const [isValidRoute, setIsValidRoute] = useState(true);

    const checkTokenLife = (t: string) => {
        const decodedToken: any = jwtDecode(t);
        const dateNow = new Date();
        if (decodedToken.exp < Math.floor(dateNow.getTime() / 1000))
            return false;
        return true;
    };

    useEffect(() => {
        if (!userRole || !savedRefreshToken) {
            Utils.clearAllSavedData();
            setIsValidRoute(false);
        }
    }, []);

    const checkPathPermission = () => {
        const isAdminPath = _.find(
            ADMIN_ROUTERS,
            (route: string) => route === location
        );

        const isUserPath = _.find(
            USER_ROUTERS,
            (route: string) => route === location
        );
        // console.log(isAdminPath, userRole);
        if (userRole !== ROLES.ADMIN && isAdminPath) return false;
        // if (userRole === ROLES.ADMIN && isUserPath) return false;
        return true;
    };

    if (!isValidRoute || !checkPathPermission())
        return <Navigate to={ROUTERS.HOME} replace />;

    return children;
};

export default ProtectedRoute;
