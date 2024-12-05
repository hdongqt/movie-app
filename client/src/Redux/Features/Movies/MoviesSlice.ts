import { createSlice } from '@reduxjs/toolkit';
import { fetchAllMovies, getMovie, addMovieToFavorites } from './MoviesAction';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
import _ from 'lodash';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        ...DEFAULT_PAGINATION,
        limit: 20,
        status: 'active',
        isFetchNew: true,
        movieType: 'all',
        genre: []
    },
    meta: null,
    movieLists: [],
    movieDetail: null,
    similarMovies: [],
    filtersSave: null
};

export const MoviesSlice = createSlice({
    name: 'Movies',
    initialState: initialState,
    reducers: {
        setMoviesMeta: (state, action) => {
            return { ...state, meta: action.payload };
        },
        setMoviesPagination: (state, action) => {
            return { ...state, pagination: action.payload };
        },
        resetMovieState: () => {
            return { ...initialState };
        },
        setFiltersSave: (state, action) => {
            return { ...state, filtersSave: action.payload };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAllMovies.pending, (state, action) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false,
                    movieLists: action.meta.arg.isFetchNew
                        ? []
                        : [...state.movieLists]
                };
            })
            .addCase(fetchAllMovies.fulfilled, (state, action) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: false,
                    movieLists: action.payload
                };
            })
            .addCase(fetchAllMovies.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true
                };
            })
            .addCase(getMovie.pending, (state) => {
                return {
                    ...state,
                    similarMovies: [],
                    movieDetail: null,
                    isGetLoading: true,
                    isError: false
                };
            })
            .addCase(getMovie.fulfilled, (state, action) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: false,
                    similarMovies: action.payload.similarMovies,
                    movieDetail: action.payload.movieDetail
                };
            })
            .addCase(getMovie.rejected, (state) => {
                return {
                    ...state,
                    similarMovies: [],
                    movieDetail: null,
                    isGetLoading: false,
                    isError: true
                };
            })
            .addCase(addMovieToFavorites.pending, (state, action) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(addMovieToFavorites.fulfilled, (state, action) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false
                };
            })
            .addCase(addMovieToFavorites.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            });
    }
});

export const {
    resetMovieState,
    setMoviesMeta,
    setMoviesPagination,
    setFiltersSave
} = MoviesSlice.actions;

export const MoviesAction = {
    fetchAllMovies,
    getMovie,
    addMovieToFavorites,
    ...MoviesSlice.actions
};

export default MoviesSlice.reducer;
