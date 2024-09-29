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

const updateMovie = async (id: string, payload: FormData) => {
    return APIClient.put(`${COMMENT.ROOT}/${id}`, payload);
};

// const activateMovie = async (payload: string) => {
//     return APIClient.put(`${COMMENT.ACTIVATE_COMMENT}/${payload}`);
// };

// const terminatedMovie = async (payload: string) => {
//     return APIClient.delete(`${COMMENT.TERMINATED_MOVIE}/${payload}`);
// };

export default {
    fetchComments,
    createComment,
    updateMovie
};
