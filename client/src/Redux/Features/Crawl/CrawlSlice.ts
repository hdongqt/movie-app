import { createSlice, current } from '@reduxjs/toolkit';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
import { createCrawl, fetchAllCrawls, getCrawl } from './CrawlAction';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        ...DEFAULT_PAGINATION,
        status: ''
    },
    meta: null,
    crawlTable: [],
    crawlDetail: null
};

const CrawlSlice = createSlice({
    name: 'Crawl',
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
            .addCase(fetchAllCrawls.pending, (state) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false,
                    crawlTable: []
                };
            })
            .addCase(fetchAllCrawls.fulfilled, (state, action: any) => {
                const { crawlTable, meta, pagination } = action.payload;
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: false,
                    crawlTable: crawlTable,
                    meta: meta,
                    pagination: pagination
                };
            })
            .addCase(fetchAllCrawls.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true,
                    crawlTable: []
                };
            })
            .addCase(getCrawl.pending, (state) => {
                return {
                    ...state,
                    crawlDetail: null,
                    isGetLoading: true,
                    isError: false
                };
            })
            .addCase(getCrawl.fulfilled, (state, action) => {
                return {
                    ...state,
                    isGetLoading: false,
                    isError: false,
                    crawlDetail: action.payload
                };
            })
            .addCase(getCrawl.rejected, (state) => {
                return {
                    ...state,
                    crawlDetail: null,
                    isGetLoading: false,
                    isError: true
                };
            })
            .addCase(createCrawl.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(createCrawl.fulfilled, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false
                };
            })
            .addCase(createCrawl.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            });
    }
});

export const { setSearchMeta, setSearchPagination, resetSearchState } =
    CrawlSlice.actions;
export const CrawlAction = {
    ...CrawlSlice.actions,
    createCrawl,
    fetchAllCrawls,
    getCrawl
};
export default CrawlSlice.reducer;
