import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
import {
    fetchAllUsersManagement,
    getUserDetail,
    changeStatusUser
} from './UsersManagementAction';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        ...DEFAULT_PAGINATION,
        status: ''
    },
    meta: null,
    userTable: [],
    userDetail: null,
    users: []
};

const UsersManagementSlice = createSlice({
    name: 'UsersManagement',
    initialState: initialState,
    reducers: {
        setSearchMeta: (state, action) => {
            return { ...state, meta: action.payload };
        },
        setSearchPagination: (state, action) => {
            return { ...state, pagination: action.payload };
        },
        resetSearchState: () => {
            return initialState;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAllUsersManagement.pending, (state) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false,
                    userTable: [],
                    userDetail: null
                };
            })
            .addCase(fetchAllUsersManagement.fulfilled, (state, action) => {
                const { userTable, meta, pagination } = action.payload as any;
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: false,
                    userTable: userTable,
                    meta: meta,
                    pagination: pagination
                };
            })
            .addCase(fetchAllUsersManagement.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true,
                    userTable: []
                };
            })
            .addCase(getUserDetail.pending, (state) => {
                return {
                    ...state,
                    isGetLoading: true,
                    isError: false,
                    userDetail: null
                };
            })
            .addCase(getUserDetail.fulfilled, (state, action: any) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: false,
                    userDetail: action?.payload
                };
            })
            .addCase(getUserDetail.rejected, (state) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: true,
                    userDetail: null
                };
            });
    }
});

export const UsersManagementAction = {
    fetchAllUsersManagement,
    getUserDetail,
    changeStatusUser,
    ...UsersManagementSlice.actions
};
export default UsersManagementSlice.reducer;
