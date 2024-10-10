import { UserAPI } from '@/API';
import { IFavoritePaginationFilter } from '@/Interfaces/Favorite.interface';
import { RootState } from '@/Redux/Store';
import Utils from '@/Utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';

const fetchAllFavorites = createAsyncThunk(
    'Favorites/fetchAllMovies',
    async (payload: IFavoritePaginationFilter, thunkApi) => {
        try {
            const { isFetchNew, ...payloadRequest } = payload;
            const response = await UserAPI.fetchFavorites(payloadRequest);
            const meta = _.get(response, 'payload.meta', []);
            const favorites = _.get(response, 'payload.data', []);
            return {
                favorites,
                meta,
                pagination: payload
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const deleteMovieFromFavorites = createAsyncThunk(
    'Favorites/deleteMovieFromFavorites',
    async (payload: string, thunkApi) => {
        try {
            await UserAPI.deleteMovieFromFavorites(payload);
            Utils.ToastMessage('Huỷ yêu thích thành công', 'success');
            return payload;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export { fetchAllFavorites, deleteMovieFromFavorites };
