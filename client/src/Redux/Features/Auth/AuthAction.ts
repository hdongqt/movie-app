import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import Utils from '@/Utils';
import AuthAPI from '@/API/Modules/AuthAPI';
import { ISignInPayload, ISignUpPayload } from '@/Interfaces/Auth.interface';
import ROLE from '@/Constants/Enums/Roles.enum';
import { ROUTERS } from '@/Constants';

const signUp = createAsyncThunk(
    'Auth/signUp',
    async (payload: ISignUpPayload, thunkApi) => {
        try {
            const response = await AuthAPI.signUp(payload);
            const message = _.get(response, 'message', '');
            Utils.ToastMessage(message, 'success');
            return message;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error?.message);
        }
    }
);

const signIn = createAsyncThunk(
    'Auth/signIn',
    async (payload: ISignInPayload, thunkApi) => {
        try {
            const response = await AuthAPI.signIn(payload);
            const result = _.get(response, 'payload', null);
            const token = _.get(result, 'tokens.accessToken', '');
            const refreshToken = _.get(result, 'tokens.refreshToken', '');
            const userData = _.get(result, 'user', null);
            Utils.saveAccessToken(token);
            Utils.saveRefreshToken(refreshToken);
            Utils.saveUserData(userData);
            // const role = _.get(userData, 'role');
            // if (role === ROLE.ADMIN) Utils.redirect(ROUTERS.ADMIN_DASHBOARD);
            Utils.ToastMessage('Đăng nhập thành công !', 'success');
            return userData;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error?.message);
        }
    }
);

const getInfo = createAsyncThunk('Auth/getInfo', async (__, thunkApi) => {
    try {
        const response = await AuthAPI.getInfo();
        const result = _.get(response, 'payload', null);
        if (result) Utils.saveUserData(result);
        return result;
    } catch (error: any) {
        return thunkApi.rejectWithValue(error?.message);
    }
});

const logOut = createAsyncThunk('Auth/logout', async (__, thunkApi) => {
    try {
        await AuthAPI.logOut(Utils.getSavedRefreshToken());
        Utils.clearAllSavedData();
    } catch (error: any) {
        Utils.ToastMessage(error.message, 'error');
        Utils.clearAllSavedData();
        return thunkApi.rejectWithValue(error?.message);
    }
});

export { signUp, signIn, getInfo, logOut };
