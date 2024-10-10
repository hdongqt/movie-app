import _ from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserAPI } from '@/API';
import Utils from '@/Utils';
import { IPaginationFilter } from '@/Interfaces/Pagination.interface';
import { ENUMS, ROUTERS } from '@/Constants';

const fetchAllUsersManagement = createAsyncThunk(
    'usersManagement/fetchAllUsersManagement',
    async (payload: IPaginationFilter, thunkApi) => {
        try {
            const response = await UserAPI.fetchUsers(payload);
            const meta = _.get(response, 'payload.meta', []);
            const userTable = _.get(response, 'payload.data', []);
            return {
                userTable: userTable,
                meta,
                pagination: payload
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const getUserDetail = createAsyncThunk(
    'usersManagement/getUserDetail',
    async (payload: string, thunkApi) => {
        try {
            const result = await UserAPI.getUser(payload);
            return _.get(result, 'payload', null);
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const changeStatusUser = createAsyncThunk(
    'usersManagement/changeStatusUser',
    async (
        {
            id,
            status,
            onChangeStatusSuccess
        }: {
            id: string;
            status: string;
            onChangeStatusSuccess: () => void;
        },
        thunkApi
    ) => {
        try {
            const response =
                status === ENUMS.STATUS.ACTIVE
                    ? await UserAPI.activateUser(id)
                    : await UserAPI.deactivateUser(id);
            const message = _.get(response, 'message', '');
            Utils.ToastMessage(message, 'success');
            onChangeStatusSuccess();
            return response;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export { fetchAllUsersManagement, getUserDetail, changeStatusUser };
