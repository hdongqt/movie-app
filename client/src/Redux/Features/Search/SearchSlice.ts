import _ from 'lodash';
import { createSlice, current } from '@reduxjs/toolkit';
import { fetchSearchMovies, getRecommendMovies } from './SearchAction';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        ...DEFAULT_PAGINATION,
        status: 'active',
        movieType: 'all'
    },
    meta: null,
    movieSearchLists: [],
    recommendMovies: [],
    historySearch: null
};

export const SearchSlice = createSlice({
    name: 'Search',
    initialState: initialState,
    reducers: {
        setSearchMeta: (state, action) => {
            return { ...state, meta: action.payload };
        },
        setSearchPagination: (state, action) => {
            return { ...state, pagination: action.payload };
        },
        resetSearchState: (state) => {
            if (!state.historySearch) return initialState;
        },
        setHistorySearch: (state, action) => {
            return { ...state, historySearch: action.payload };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchSearchMovies.pending, (state) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false,
                    recommendMovies: [],
                    movieSearchLists: []
                };
            })
            .addCase(fetchSearchMovies.fulfilled, (state, action) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: false,
                    recommendMovies: [],
                    movieSearchLists: action.payload
                };
            })
            .addCase(fetchSearchMovies.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true,
                    recommendMovies: [],
                    movieSearchLists: []
                };
            })
            .addCase(getRecommendMovies.pending, (state) => {
                return {
                    ...state,
                    isGetLoading: true,
                    isError: false,
                    recommendMovies: []
                };
            })
            .addCase(getRecommendMovies.fulfilled, (state, action) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: false,
                    recommendMovies: action.payload
                };
            })
            .addCase(getRecommendMovies.rejected, (state) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: true,
                    recommendMovies: []
                };
            });
    }
});

export const {
    setSearchMeta,
    setSearchPagination,
    resetSearchState,
    setHistorySearch
} = SearchSlice.actions;
export default SearchSlice.reducer;
