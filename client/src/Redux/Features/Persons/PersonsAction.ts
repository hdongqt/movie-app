import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { MovieAPI } from '@/API';
import _ from 'lodash';
import Utils from '@/Utils';
import { setSearchPagination, setSearchMeta } from './PersonsSlice';
import { IPersonPaginationFilter } from '@/Interfaces/Pagination.interface';
import PersonAPI from '@/API/Modules/PersonAPI';
import { RootState } from '@/Redux/Store';

const getMovieOfPerson = createAsyncThunk(
    'Movie/getMovieOfPerson',
    async (payload: IPersonPaginationFilter, thunkApi) => {
        try {
            const { isFetchNew = true, ...pagination } = payload;
            const response = await MovieAPI.getMovieOfPerson(pagination);
            const meta = _.get(response, 'payload.meta', []);
            await thunkApi.dispatch(setSearchPagination(pagination));
            await thunkApi.dispatch(setSearchMeta(meta));
            const currentState = thunkApi.getState() as RootState;
            const result = isFetchNew
                ? _.get(response, 'payload.data', [])
                : [
                      ..._.get(currentState.PERSON, 'movieOfPerson'),
                      ..._.get(response, 'payload.data', [])
                  ];
            return result;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const getDetail = createAsyncThunk(
    'Movie/getDetail',
    async (payload: string, thunkApi) => {
        try {
            const [resDetail, resTrending] = await Promise.all([
                PersonAPI.getPerson(payload),
                MovieAPI.getTrendingMovies({ page: 1, limit: 5 })
            ]);
            return {
                personDetail: _.get(resDetail, 'payload', null),
                trendingMovies: _.get(resTrending, 'payload.data', [])
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);
export { getMovieOfPerson, getDetail };
