import { createSlice } from '@reduxjs/toolkit';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
import { getDetail, getMovieOfPerson } from './PersonsAction';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        ...DEFAULT_PAGINATION,
        id: '',
        status: 'active'
    },
    meta: null,
    personDetail: null,
    movieOfPerson: [],
    trendingMovies: []
};

const PersonSlice = createSlice({
    name: 'Search',
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
            .addCase(getMovieOfPerson.pending, (state) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false
                };
            })
            .addCase(getMovieOfPerson.fulfilled, (state, action) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: false,
                    movieOfPerson: action.payload
                };
            })
            .addCase(getMovieOfPerson.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true
                };
            })
            .addCase(getDetail.pending, (state) => {
                return {
                    ...state,
                    isGetLoading: true,
                    isError: false,
                    personDetail: null,
                    trendingMovies: []
                };
            })
            .addCase(getDetail.fulfilled, (state, action) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: false,
                    personDetail: action.payload.personDetail,
                    trendingMovies: action.payload.trendingMovies
                };
            })
            .addCase(getDetail.rejected, (state) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: true,
                    personDetail: null,
                    trendingMovies: []
                };
            });
    }
});

export const { setSearchMeta, setSearchPagination, resetSearchState } =
    PersonSlice.actions;
export default PersonSlice.reducer;
