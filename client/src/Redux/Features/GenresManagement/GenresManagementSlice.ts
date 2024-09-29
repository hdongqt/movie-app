import { createSlice } from '@reduxjs/toolkit';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
import {
    fetchAllGenresManagement,
    createGenre,
    getGenreData,
    updateGenre,
    changeStatusGenre
} from './GenresManagementAction';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        ...DEFAULT_PAGINATION,
        status: ''
    },
    meta: null,
    genreTable: [],
    genreDetail: null
};

const GenresManagementSlice = createSlice({
    name: 'GenresManagement',
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
            .addCase(fetchAllGenresManagement.pending, (state) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false,
                    genreTable: [],
                    genreDetail: null
                };
            })
            .addCase(fetchAllGenresManagement.fulfilled, (state, action) => {
                const { genreTable, meta, pagination } = action.payload as any;
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: false,
                    genreTable: genreTable,
                    meta: meta,
                    pagination: pagination
                };
            })
            .addCase(fetchAllGenresManagement.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true,
                    genreTable: []
                };
            })
            .addCase(createGenre.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(createGenre.fulfilled, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false
                };
            })
            .addCase(createGenre.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            })
            .addCase(getGenreData.pending, (state) => {
                return {
                    ...state,
                    isGetLoading: true,
                    isError: false,
                    genreDetail: null
                };
            })
            .addCase(getGenreData.fulfilled, (state, action: any) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: false,
                    genreDetail: action?.payload
                };
            })
            .addCase(getGenreData.rejected, (state) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: true,
                    genreDetail: null
                };
            });
    }
});

export const GenresManagementAction = {
    fetchAllGenresManagement,
    createGenre,
    getGenreData,
    updateGenre,
    changeStatusGenre,
    ...GenresManagementSlice.actions
};
export default GenresManagementSlice.reducer;
