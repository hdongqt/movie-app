import { createAsyncThunk } from '@reduxjs/toolkit';
import { GenreAPI, MovieAPI, UserAPI } from '@/API';
import _ from 'lodash';
import Utils from '@/Utils';
import { IMoviePaginationFilter } from '@/Interfaces/Pagination.interface';
import { setMoviesMeta, setMoviesPagination } from './MoviesSlice';
import { RootState } from '../../Store';

const fetchAllMovies = createAsyncThunk(
    'Movies/fetchAllMovies',
    async (payload: IMoviePaginationFilter, thunkApi) => {
        try {
            const { isFetchNew = true, ...restPayload } = payload;
            const movieLists = await MovieAPI.fetchMoviesForUser(restPayload);
            const meta = _.get(movieLists, 'payload.meta', []);
            const currentState = thunkApi.getState() as RootState;
            const result = isFetchNew
                ? _.get(movieLists, 'payload.data', [])
                : [
                      ..._.get(currentState.MOVIES, 'movieLists'),
                      ..._.get(movieLists, 'payload.data', [])
                  ];
            await thunkApi.dispatch(setMoviesPagination(restPayload));
            await thunkApi.dispatch(setMoviesMeta(meta));
            return result;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const getMovie = createAsyncThunk(
    'Movies/getMovie',
    async (payload: string, thunkApi) => {
        try {
            const [resultDetail, resultSimilar] = await Promise.all([
                MovieAPI.getMovie(payload),
                MovieAPI.getSimilarMovies(payload)
            ]);
            return {
                movieDetail: _.get(resultDetail, 'payload', null),
                similarMovies: _.get(resultSimilar, 'payload', [])
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const addMovieToFavorites = createAsyncThunk(
    'Movies/addMovieToFavorites',
    async (payload: string, thunkApi) => {
        try {
            await UserAPI.addMovieToFavorites(payload);
            Utils.ToastMessage('Yêu thích phim thành công', 'success');
            return {};
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export { fetchAllMovies, getMovie, addMovieToFavorites };
