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
import { useSelector } from 'react-redux';
const { resetAuthState } = AuthAction;
const App: React.FC = () => {
    const dispatch = useTypedDispatch();
    const { themeMode } = useSelector((state: RootState) => state.APP_STATE);

    useEffect(() => {
        if (Utils.getSavedRefreshToken() || Utils.getSavedAccessToken()) {
            dispatch(getInfo());
        } else {
            Utils.clearAllSavedData();
            dispatch(resetAuthState());
        }
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
                theme={themeMode === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
};

export default App;
