import APIClient from '../Client/APIClient';
import { API, ENUMS } from '@/Constants';
import {
    ICommentPaginationFilter,
    ICommentPayload
} from '@/Interfaces/Comment.interface';
const { COMMENT } = API;

const fetchComments = async (payload: ICommentPaginationFilter) => {
    const { movieId, ...data } = payload;
    return APIClient.get(`${COMMENT.ROOT}/movie/${movieId}`, {
        params: data
    });
};

const createComment = async (payload: ICommentPayload) => {
    return APIClient.post(COMMENT.ROOT, payload);
};

const terminatedComment = async (payload: string) => {
    return APIClient.delete(`${COMMENT.TERMINATED_COMMENT}/${payload}`);
};

export default {
    fetchComments,
    createComment,
    terminatedComment
};
