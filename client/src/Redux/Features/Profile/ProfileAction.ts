import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserAPI } from '@/API';
import _ from 'lodash';
import Utils from '@/Utils';
import { IUpdatePassword, IUpdateProfile } from '@/Interfaces/User.interface';
import { getInfo } from '../Auth/AuthAction';

const updateProfile = createAsyncThunk(
    'Profile/updateProfile',
    async (payload: IUpdateProfile, thunkApi) => {
        try {
            const result = await UserAPI.updateProfile(payload);
            const data = _.get(result, 'payload');
            Utils.ToastMessage('Cập nhật thông tin thành công', 'success');
            thunkApi.dispatch(getInfo());
            return data;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const updatePassword = createAsyncThunk(
    'Profile/updatePassword',
    async (payload: IUpdatePassword, thunkApi) => {
        try {
            const result = await UserAPI.updatePassword(payload);
            const data = _.get(result, 'payload');
            Utils.ToastMessage('Thay đổi mật khẩu thành công', 'success');
            return data;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export { updateProfile, updatePassword };
