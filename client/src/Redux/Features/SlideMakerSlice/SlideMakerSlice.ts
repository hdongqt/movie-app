import { createSlice } from '@reduxjs/toolkit';
import { fetchAllSlides } from './SlideMakerAction';
import { DEFAULT_LOADING_STATES } from '@/Constants/DefaultPagination';
export const SlideMakerSlice = createSlice({
    name: 'SlideMaker',
    initialState: {
        ...DEFAULT_LOADING_STATES,
        isError: false,
        dataMedias: []
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAllSlides.pending, (state, action: any) => {
                state.isFetchLoading = true;
                state.isError = false;
                state.dataMedias = [];
            })
            .addCase(fetchAllSlides.fulfilled, (state, action: any) => {
                state.isFetchLoading = false;
                state.isError = false;
                state.dataMedias = action.payload;
            })
            .addCase(fetchAllSlides.rejected, (state) => {
                state.isFetchLoading = false;
                state.isError = true;
                state.dataMedias = [];
            });
    }
});

export default SlideMakerSlice.reducer;
