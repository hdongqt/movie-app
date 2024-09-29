import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
import {
    getInfo,
    logOut,
    signIn,
    signUp
} from '@/Redux/Features/Auth/AuthAction';
import { AsyncThunkRejectedActionCreator } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { ISignUpPayload } from '@/Interfaces/Auth.interface';
import Utils from '@/Utils';

const profile = Utils.getUserData();

const initialState = {
    ...DEFAULT_LOADING_STATES,
    isShowModalAuth: false,
    isError: false,
    message: '',
    pagination: {
        ...DEFAULT_PAGINATION,
        id: '',
        status: 'active'
    },
    meta: null,
    selfProfile: profile
};
export const AuthSlice = createSlice({
    name: 'Auth',
    initialState: initialState,
    reducers: {
        setSearchMeta: (state, action) => {
            return { ...state, meta: action.payload };
        },
        setSearchPagination: (state, action) => {
            return { ...state, pagination: action.payload };
        },
        setIsShowModalAuth: (state, action) => {
            return {
                ...state,
                isError: false,
                message: '',
                isShowModalAuth: action.payload
            };
        },
        resetAuthErrorState: (state) => {
            return { ...state, isError: false, message: '' };
        },
        resetAuthState: () => {
            return { ...initialState, selfProfile: null };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(signUp.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false,
                    message: ''
                };
            })
            .addCase(signUp.fulfilled, (state, action) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false,
                    message: action.payload
                };
            })
            .addCase(signUp.rejected, (state, action) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true,
                    message: `${action.payload}`
                };
            })
            .addCase(signIn.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false,
                    message: '',
                    selfProfile: null
                };
            })
            .addCase(signIn.fulfilled, (state, action) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false,
                    selfProfile: action.payload,
                    isShowModalAuth: false
                };
            })
            .addCase(signIn.rejected, (state, action) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true,
                    message: `${action.payload}`,
                    selfProfile: null
                };
            })
            .addCase(getInfo.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false,
                    message: ''
                };
            })
            .addCase(getInfo.fulfilled, (state, action) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false,
                    selfProfile: action.payload
                };
            })
            .addCase(getInfo.rejected, (state, action) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true,
                    message: `${action.payload}`,
                    selfProfile: null
                };
            })
            .addCase(logOut.fulfilled, (state) => {
                return {
                    ...state,
                    selfProfile: null
                };
            })
            .addCase(logOut.rejected, (state) => {
                return {
                    ...state,
                    selfProfile: null
                };
            });
    }
});

export const AuthAction = {
    signUp,
    signIn,
    getInfo,
    logOut,
    ...AuthSlice.actions
};
export default AuthSlice.reducer;
