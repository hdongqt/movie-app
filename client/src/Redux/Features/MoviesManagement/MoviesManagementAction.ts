import _ from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CountryAPI, GenreAPI, MovieAPI } from '@/API';
import Utils from '@/Utils';
import { IMoviePaginationFilter } from '@/Interfaces/Pagination.interface';
import { ENUMS, ROUTERS } from '@/Constants';

const fetchAllMoviesManagement = createAsyncThunk(
    'MoviesManagement/fetchAllMoviesManagement',
    async (payload: IMoviePaginationFilter, thunkApi) => {
        try {
            const response = await MovieAPI.fetchMovies(payload);
            const meta = _.get(response, 'payload.meta', []);
            const movieTable = _.get(response, 'payload.data', []);
            return {
                movieTable: movieTable,
                meta,
                pagination: payload
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const changeStatusMovie = createAsyncThunk(
    'MoviesManagement/changeStatusMovie',
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
                    ? await MovieAPI.activateMovie(id)
                    : status === ENUMS.STATUS.INACTIVE
                    ? await MovieAPI.deactivateMovie(id)
                    : await MovieAPI.terminatedMovie(id);
            const message = _.get(response, 'message', '');
            Utils.ToastMessage(message, 'success');
            onChangeStatusSuccess();
            return message;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const getMovieMetaData = createAsyncThunk(
    'MoviesManagement/getMovieMetaData',
    async (payload: { isGetDetail: boolean; id: string }, thunkApi) => {
        try {
            const { isGetDetail, id } = payload;
            const [resGenres, resCountries, movieDetail] =
                await Promise.allSettled([
                    GenreAPI.fetchGenres({ page: 0, limit: 0 }),
                    CountryAPI.fetchCountries({ page: 0, limit: 0 }),
                    isGetDetail ? MovieAPI.getMovie(id) : null
                ]);
            return {
                genres: _.get(resGenres, 'value.payload.data', []),
                countries: _.get(resCountries, 'value.payload.data', []),
                movieDetail: _.get(movieDetail, 'value.payload', null)
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const createMovie = createAsyncThunk(
    'MoviesManagement/createMovie',
    async (payload: FormData, thunkApi) => {
        try {
            await MovieAPI.createMovie(payload);
            Utils.ToastMessage('Tạo mới phim thành công', 'success');
            Utils.redirect(ROUTERS.MOVIES_MANAGEMENT);
            return {};
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const updateMovie = createAsyncThunk(
    'MoviesManagement/updateMovie',
    async (payload: { id: string; form: FormData }, thunkApi) => {
        try {
            await MovieAPI.updateMovie(payload.id, payload.form);
            Utils.ToastMessage('Cập nhật phim thành công', 'success');
            return {};
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export {
    fetchAllMoviesManagement,
    changeStatusMovie,
    getMovieMetaData,
    createMovie,
    updateMovie
};
