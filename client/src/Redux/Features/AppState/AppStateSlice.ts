import { GenreAPI } from '@/API';
import Utils from '@/Utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export const fetchGenres = createAsyncThunk(
    'AppState/fetchGenres',
    async (__, thunkApi) => {
        try {
            const genres = await GenreAPI.fetchGenres({
                page: 0,
                limit: 0
            });
            const result = _.get(genres, 'payload.data', []);
            return result;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export const AppStateSlice = createSlice({
    name: 'AppState',
    initialState: {
        themeMode: 'dark',
        isAppLoading: false,
        genreLists: Utils.getSavedGenres(),
        sidebarAdminOpen: false,
        sidebarUserOpen: false
    },
    reducers: {
        setThemeMode: (state, action) => {
            state.themeMode = action.payload;
        },
        setSidebarAdminOpen: (state, action) => {
            state.sidebarAdminOpen = action.payload;
        },
        setSidebarUserOpen: (state, action) => {
            state.sidebarUserOpen = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchGenres.pending, (state) => {
                return {
                    ...state,
                    isAppLoading: true,
                    isError: false,
                    genreLists: []
                };
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                return {
                    ...state,
                    isAppLoading: false,
                    isError: false,
                    genreLists: action.payload
                };
            })
            .addCase(fetchGenres.rejected, (state) => {
                return {
                    ...state,
                    isAppLoading: false,
                    isError: true,
                    genreLists: []
                };
            });
    }
});

export const { setThemeMode, setSidebarAdminOpen, setSidebarUserOpen } =
    AppStateSlice.actions;

export default AppStateSlice.reducer;
