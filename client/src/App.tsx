import _ from 'lodash';
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { RootState, useTypedDispatch } from './Redux/Store';
import Utils from './Utils';
import { getInfo } from './Redux/Features/Auth/AuthAction';
import { AuthAction } from './Redux/Features/Auth';
import RootRouters from './Routers';
import { AppStateAction } from '@/Redux/Features/AppState';
const { resetAuthState } = AuthAction;
const App: React.FC = () => {
    const dispatch = useTypedDispatch();

    useEffect(() => {
        if (Utils.getSavedRefreshToken() || Utils.getSavedAccessToken()) {
            dispatch(getInfo());
        } else {
            Utils.clearAllSavedData();
            dispatch(resetAuthState());
        }
        if (!Utils.getSavedGenres() || Utils.getSavedGenres()?.length < 1)
            dispatch(AppStateAction.fetchGenres());
    }, []);

    return (
        <div className="App">
            <RootRouters />
            <ToastContainer
                position="top-right"
                autoClose={2300}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover
                theme={'light'}
            />
            <div className="hidden bg-gray-500"></div>
        </div>
    );
};

export default App;
