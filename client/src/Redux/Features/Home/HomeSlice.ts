import { createSlice } from '@reduxjs/toolkit';
import { fetchAllMediaHome, getTrending } from './HomeAction';
import { DEFAULT_LOADING_STATES } from '@/Constants/DefaultPagination';
export const HomeSlice = createSlice({
    name: 'Home',
    initialState: {
        ...DEFAULT_LOADING_STATES,
        isError: false,
        dataMovieRecommend: [],
        dataMovieSingle: [],
        dataMovieTV: [],
        dataMovieTrending: [],
        dataRatingMovie: []
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAllMediaHome.pending, (state) => {
                state.isFetchLoading = true;
                state.isError = false;
                state.dataMovieRecommend = [];
                state.dataMovieSingle = [];
                state.dataRatingMovie = [];
                state.dataMovieTV = [];
            })
            .addCase(fetchAllMediaHome.fulfilled, (state, action: any) => {
                state.isFetchLoading = false;
                state.dataMovieRecommend = action.payload.dataMovieRecommend;
                state.dataMovieSingle = action.payload.dataMovieSingle;
                state.dataRatingMovie = action.payload.dataRatingMovie;
                state.dataMovieTV = action.payload.dataMovieTV;
            })
            .addCase(fetchAllMediaHome.rejected, (state) => {
                state.isFetchLoading = false;
                state.isError = true;
                state.dataMovieRecommend = [];
                state.dataMovieSingle = [];
                state.dataRatingMovie = [];
                state.dataMovieTV = [];
            })
            .addCase(getTrending.pending, (state) => {
                state.isGetLoading = true;
                state.isError = false;
                state.dataMovieTrending = [];
            })
            .addCase(getTrending.fulfilled, (state, action: any) => {
                state.isGetLoading = false;
                state.isError = false;
                state.dataMovieTrending = action.payload;
            })
            .addCase(getTrending.rejected, (state) => {
                state.isGetLoading = false;
                state.isError = true;
                state.dataMovieTrending = [];
            });
    }
});

// export const {} = HomeSlice.actions;
export default HomeSlice.reducer;
