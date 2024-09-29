import { createAsyncThunk } from '@reduxjs/toolkit';
import { CrawlAPI, GenreAPI, MovieAPI } from '@/API';
import _ from 'lodash';
import Utils from '@/Utils';
import { IPaginationFilter } from '@/Interfaces/Pagination.interface';

const fetchAllCrawls = createAsyncThunk(
    'Crawl/fetchAllCrawls',
    async (payload: IPaginationFilter, thunkApi) => {
        try {
            const response = await CrawlAPI.fetchCrawls(payload);
            const meta = _.get(response, 'payload.meta', []);
            const crawlTable = _.get(response, 'payload.data', []);
            return {
                crawlTable: crawlTable,
                meta,
                pagination: payload
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const getCrawl = createAsyncThunk(
    'Crawl/getCrawl',
    async (payload: string, thunkApi) => {
        try {
            const response = await CrawlAPI.getCrawl(payload);
            return _.get(response, 'payload', null);
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const createCrawl = createAsyncThunk(
    'Crawl/createCrawl',
    async (
        { page, handleClose }: { page: number; handleClose: () => void },
        thunkApi
    ) => {
        try {
            const response = await CrawlAPI.createCrawl(page);
            const message = _.get(response, 'message', '');
            Utils.ToastMessage(message, 'success');
            handleClose();
            return message;
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error?.message);
        }
    }
);

export { fetchAllCrawls, getCrawl, createCrawl };
