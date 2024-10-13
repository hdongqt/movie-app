import { createAsyncThunk } from '@reduxjs/toolkit';
import { MovieAPI } from '@/API';
import _ from 'lodash';
import Utils from '@/Utils';

export const fetchAllSlides = createAsyncThunk(
    'SliderMaker/fetchAllSlides',
    async (__, thunkApi) => {
        try {
            const response = await MovieAPI.fetchMovies({
                page: 1,
                limit: 10,
                sortBy: 'createdAt'
            });

            try {
                const res = _.get(response, 'payload.data') || [];
                if (res && _.isArray(res) && res.length > 0) {
                    const listMovieId = _.slice(res, 0, 6);
                    const s = listMovieId.map((movie) => {
                        return {
                            ...(movie as Object)
                        };
                    });
                    return s;
                }
            } catch (error) {
                return _.get(response, 'results');
            }
            return _.get(response, 'results');
        } catch (error: any) {
            const message = error.message;
            Utils.ToastMessage(message, 'error');
            return thunkApi.rejectWithValue(message);
        }
    }
);
