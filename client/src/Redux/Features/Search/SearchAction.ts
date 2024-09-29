import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { GenreAPI, MovieAPI } from '@/API';
import _ from 'lodash';
import Utils from '@/Utils';
import { setSearchPagination, setSearchMeta } from '../Search/SearchSlice';
import { IPaginationFilter } from '@/Interfaces/Pagination.interface';
const fetchSearchMovies = createAsyncThunk(
    'Movie/fetchSearchMovies',
    async (payload: IPaginationFilter, thunkApi) => {
        try {
            const movieLists = await MovieAPI.fetchMovies(payload);
            const meta = _.get(movieLists, 'payload.meta', []);
            const result = _.get(movieLists, 'payload.data', []);
            await thunkApi.dispatch(setSearchPagination(payload));
            await thunkApi.dispatch(setSearchMeta(meta));
            return result;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const getRecommendMovies = createAsyncThunk(
    'Movie/getRecommendMovies',
    async (__, thunkApi) => {
        try {
            const movieLists = await MovieAPI.getRecommendMovies();
            const result = _.get(movieLists, 'payload', []);
            return result;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export { fetchSearchMovies, getRecommendMovies };
