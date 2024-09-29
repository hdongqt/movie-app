import _ from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CommentAPI } from '@/API';
import Utils from '@/Utils';
import { ENUMS, ROUTERS } from '@/Constants';
import {
    ICommentPaginationFilter,
    ICommentPayload
} from '@/Interfaces/Comment.interface';
import { RootState } from '@/Redux/Store';
interface ICommentFetchPayload extends ICommentPaginationFilter {
    isFetchNew: boolean;
}

const fetchAllCommentOfMovie = createAsyncThunk(
    'CommentsManagement/fetchAllCommentOfMovie',
    async (payload: ICommentFetchPayload, thunkApi) => {
        try {
            const { isFetchNew, ...payloadRequest } = payload;
            const response = await CommentAPI.fetchComments(payloadRequest);
            const meta = _.get(response, 'payload.meta', []);
            const comments = _.get(response, 'payload.data', []);
            return {
                isFetchNew: isFetchNew,
                comments,
                meta,
                pagination: payloadRequest
            };
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

const createComment = createAsyncThunk(
    'CommentsManagement/createComment',
    async (payload: ICommentPayload, thunkApi) => {
        try {
            const result = await CommentAPI.createComment(payload);
            const data = _.get(result, 'payload', {});
            const currentState = thunkApi.getState() as RootState;
            const commentsState = _.get(currentState.COMMENTS, 'comments');
            if (!_.get(data, 'parent_id')) return [data, ...commentsState];
            else
                return commentsState.map((comment: any) =>
                    _.get(comment, 'id') === _.get(data, 'parent_id')
                        ? {
                              ...comment,
                              replies: [...comment.replies, data]
                          }
                        : comment
                );
        } catch (error: any) {
            Utils.ToastMessage(error.message, 'error');
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export { fetchAllCommentOfMovie, createComment };
