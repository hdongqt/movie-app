import { createSlice } from '@reduxjs/toolkit';
import { fetchAllFavorites, deleteMovieFromFavorites } from './FavoritesAction';
import { DEFAULT_LOADING_STATES } from '@/Constants/DefaultPagination';
import _ from 'lodash';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        page: 1,
        limit: 20,
        isFetchNew: true
    },
    meta: null,
    favorites: []
};

export const FavoritesSlice = createSlice({
    name: 'Favorites',
    initialState: initialState,
    reducers: {
        resetFavoritesState: () => {
            return initialState;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAllFavorites.pending, (state, action) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false,
                    favorites: action.meta.arg.isFetchNew ? [] : state.favorites
                };
            })
            .addCase(fetchAllFavorites.fulfilled, (state, action) => {
                const { favorites, meta, pagination, isFetchNew } =
                    action.payload as any;
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: false,
                    favorites: isFetchNew
                        ? favorites
                        : [...state.favorites, ...favorites],
                    meta: meta,
                    pagination: pagination
                };
            })
            .addCase(fetchAllFavorites.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true,
                    favorites: []
                };
            })
            .addCase(deleteMovieFromFavorites.pending, (state, action) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(deleteMovieFromFavorites.fulfilled, (state, action) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false,
                    favorites: state.favorites.filter(
                        (movie: any) => movie.id !== action.payload
                    )
                };
            })
            .addCase(deleteMovieFromFavorites.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            });
    }
});

export const FavoritesAction = {
    fetchAllFavorites,
    deleteMovieFromFavorites,
    ...FavoritesSlice.actions
};

export default FavoritesSlice.reducer;
