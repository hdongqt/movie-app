import { createSlice } from '@reduxjs/toolkit';
import {
    DEFAULT_PAGINATION,
    DEFAULT_LOADING_STATES
} from '@/Constants/DefaultPagination';
import { fetchAllCommentOfMovie, createComment } from './CommentsAction';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false,
    pagination: {
        page: 1,
        limit: 5,
        movieId: ''
    },
    meta: null,
    comments: []
};

const CommentsManagementSlice = createSlice({
    name: 'CommentsManagement',
    initialState: initialState,
    reducers: {
        resetCommentsState: () => {
            return initialState;
        },
        setComments: (state, action) => {
            return { ...state, comments: action.payload };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAllCommentOfMovie.pending, (state, action) => {
                return {
                    ...state,
                    isFetchLoading: true,
                    isError: false,
                    comments: action.meta.arg.isFetchNew ? [] : state.comments
                };
            })
            .addCase(fetchAllCommentOfMovie.fulfilled, (state, action) => {
                const { comments, meta, pagination, isFetchNew } =
                    action.payload as any;
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: false,
                    comments: isFetchNew
                        ? comments
                        : [...state.comments, ...comments],
                    meta: meta,
                    pagination: pagination
                };
            })
            .addCase(fetchAllCommentOfMovie.rejected, (state) => {
                return {
                    ...state,
                    isFetchLoading: false,
                    isError: true,
                    comments: []
                };
            })
            .addCase(createComment.pending, (state, action) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(createComment.fulfilled, (state, action: any) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false,
                    comments: action.payload
                };
            })
            .addCase(createComment.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            });
    }
});

export const CommentsManagementAction = {
    fetchAllCommentOfMovie,
    createComment,
    ...CommentsManagementSlice.actions
};
export default CommentsManagementSlice.reducer;
