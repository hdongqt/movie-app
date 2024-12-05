import { createAsyncThunk } from '@reduxjs/toolkit';
import { GenreAPI, MovieAPI } from '@/API';
import _ from 'lodash';
import Utils from '@/Utils';

const fetchAllMediaHome = createAsyncThunk(
    'Home/fetchAllMediaHome',
    async (__, thunkApi) => {
        try {
            const [resRecommend, resSingleMovies, resTVSeries, resRatingMovie] =
                await Promise.all([
                    MovieAPI.getRecommendMovies(),
                    MovieAPI.fetchMovies({
                        page: 1,
                        limit: 15,
                        sortBy: 'createdAt',
                        movieType: 'single'
                    }),
                    MovieAPI.fetchMovies({
                        page: 1,
                        limit: 15,
                        sortBy: 'createdAt',
                        movieType: 'tv'
                    }),
                    MovieAPI.fetchMovies({
                        page: 1,
                        limit: 15,
                        sortBy: 'averageRating'
                    })
                ]);
            return {
                dataMovieRecommend: _.get(resRecommend, 'payload', []),
                dataMovieSingle: _.get(resSingleMovies, 'payload.data', []),
                dataMovieTV: _.get(resTVSeries, 'payload.data', []),
                dataRatingMovie: _.get(resRatingMovie, 'payload.data', [])
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const getTrending = createAsyncThunk(
    'Home/getTrending',
    async (__, thunkApi) => {
        try {
            const response = await MovieAPI.getTrendingMovies({
                page: 1,
                limit: 5
            });
            return _.get(response, 'payload.data', []);
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);
export { fetchAllMediaHome, getTrending };
