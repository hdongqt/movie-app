import { createSlice } from '@reduxjs/toolkit';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
import {
    fetchAllMoviesManagement,
    changeStatusMovie,
    getMovieMetaData,
    createMovie,
    updateMovie
} from './MoviesManagementAction';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        ...DEFAULT_PAGINATION,
        status: ''
    },
    meta: null,
    movieTable: [],
    movieDetail: null,
    genres: [],
    countries: []
};

const MoviesManagementSlice = createSlice({
    name: 'MoviesManagement',
    initialState: initialState,
    reducers: {
        setSearchMeta: (state, action) => {
            return { ...state, meta: action.payload };
        },
        setSearchPagination: (state, action) => {
            return { ...state, pagination: action.payload };
        },
        resetSearchState: () => {
            return initialState;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAllMoviesManagement.pending, (state) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false,
                    movieTable: [],
                    movieDetail: null
                };
            })
            .addCase(
                fetchAllMoviesManagement.fulfilled,
                (state, action: any) => {
                    const { movieTable, meta, pagination } = action.payload;
                    return {
                        ...state,
                        isFetchLoading: false,
                        isError: false,
                        movieTable: movieTable,
                        meta: meta,
                        pagination: pagination
                    };
                }
            )
            .addCase(fetchAllMoviesManagement.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true,
                    movieTable: []
                };
            })
            .addCase(changeStatusMovie.pending, (state) => {
                return {
                    ...state,
                    isError: false
                };
            })
            .addCase(changeStatusMovie.fulfilled, (state) => {
                return {
                    ...state,
                    isError: false
                };
            })
            .addCase(changeStatusMovie.rejected, (state) => {
                return {
                    ...state,
                    isError: true
                };
            })
            .addCase(getMovieMetaData.pending, (state) => {
                return {
                    ...state,
                    isGetLoading: true,
                    isError: false,
                    genres: [],
                    countries: [],
                    movieDetail: null
                };
            })
            .addCase(getMovieMetaData.fulfilled, (state, action) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: false,
                    genres: action.payload.genres,
                    countries: action.payload.countries,
                    movieDetail: action.payload.movieDetail
                };
            })
            .addCase(getMovieMetaData.rejected, (state) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: true,
                    genres: [],
                    countries: [],
                    movieDetail: null
                };
            })
            .addCase(createMovie.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(createMovie.fulfilled, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false
                };
            })
            .addCase(createMovie.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            })
            .addCase(updateMovie.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(updateMovie.fulfilled, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false
                };
            })
            .addCase(updateMovie.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            });
    }
});

export const MoviesManagementAction = {
    fetchAllMoviesManagement,
    changeStatusMovie,
    getMovieMetaData,
    createMovie,
    updateMovie,
    ...MoviesManagementSlice.actions
};
export default MoviesManagementSlice.reducer;
