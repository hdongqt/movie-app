import _ from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CountryAPI, GenreAPI, MovieAPI } from '@/API';
import Utils from '@/Utils';
import { IPaginationFilter } from '@/Interfaces/Pagination.interface';
import { ENUMS, ROUTERS } from '@/Constants';
import { IGenreSave } from '@/Interfaces/Genre.interface';

const fetchAllGenresManagement = createAsyncThunk(
    'GenresManagement/fetchAllGenresManagement',
    async (payload: IPaginationFilter, thunkApi) => {
        try {
            const response = await GenreAPI.fetchGenres(payload);
            const meta = _.get(response, 'payload.meta', []);
            const genreTable = _.get(response, 'payload.data', []);
            return {
                genreTable: genreTable,
                meta,
                pagination: payload
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const createGenre = createAsyncThunk(
    'GenresManagement/createGenre',
    async (payload: IGenreSave, thunkApi) => {
        try {
            const result = await GenreAPI.createGenre(payload);
            Utils.ToastMessage('Tạo mới thể loại thành công', 'success');
            Utils.redirect(ROUTERS.GENRES_MANAGEMENT);
            return result;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const getGenreData = createAsyncThunk(
    'GenresManagement/getGenreData',
    async (payload: string, thunkApi) => {
        try {
            const result = await GenreAPI.getGenre(payload);
            return _.get(result, 'payload', null);
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const updateGenre = createAsyncThunk(
    'GenresManagement/updateGenre',
    async (payload: { id: string; name: string }, thunkApi) => {
        try {
            const response = await GenreAPI.updateGenre(payload.id, {
                name: payload.name
            });
            Utils.ToastMessage('Cập nhật thể loại thành công', 'success');
            return _.get(response, 'payload', null);
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const changeStatusGenre = createAsyncThunk(
    'GenresManagement/changeStatusGenre',
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
                    ? await GenreAPI.activateGenre(id)
                    : await GenreAPI.deactivateGenre(id);
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
export {
    fetchAllGenresManagement,
    createGenre,
    getGenreData,
    updateGenre,
    changeStatusGenre
};
