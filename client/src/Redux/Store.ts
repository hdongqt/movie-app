import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { ThunkDispatch, thunk } from 'redux-thunk';
import { useDispatch } from 'react-redux';

import AppStateSlice from './Features/AppState/AppStateSlice';
import HomeSlice from './Features/Home';
import MoviesSlice from './Features/Movies';
import SlideMakerSlice from './Features/SlideMakerSlice';
import SearchSlice from './Features/Search';
import PersonSlice from './Features/Persons/PersonsSlice';
import AuthSlice from './Features/Auth/AuthSlice';
import { CommentsSlice } from './Features/Comments';
import { CrawlSlice } from './Features/Crawl';
import { MoviesManagementSlice } from './Features/MoviesManagement';
import { GenresManagementSlice } from './Features/GenresManagement';
import { UsersManagementSlice } from './Features/UsersManagement';
const store = configureStore({
    reducer: {
        APP_STATE: AppStateSlice,
        HOME: HomeSlice,
        MOVIES: MoviesSlice,
        SLIDE_MAKER: SlideMakerSlice,
        SEARCH: SearchSlice,
        PERSON: PersonSlice,
        AUTH: AuthSlice,
        CRAWL: CrawlSlice,
        MOVIES_MANAGEMENT: MoviesManagementSlice,
        GENRES_MANAGEMENT: GenresManagementSlice,
        USERS_MANAGEMENT: UsersManagementSlice,
        COMMENTS: CommentsSlice
    },
    middleware: (getDefaultMiddleware) => {
        return [...getDefaultMiddleware(), thunk] as any;
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type TypedDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useTypedDispatch = () => useDispatch<TypedDispatch>();
export default store;
