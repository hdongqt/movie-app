import { IMoviePaginationFilter } from '@/Interfaces/Pagination.interface';
import APIClient from '../Client/APIClient';
import { API, ENUMS } from '@/Constants';
import { IPersonPaginationFilter } from '@/Interfaces/Pagination.interface';
const { MOVIE } = API;

const fetchMovies = async (payload: IMoviePaginationFilter) => {
    return APIClient.get(MOVIE.ROOT, { params: payload });
};

const fetchMoviesForAdmin = async (payload: IMoviePaginationFilter) => {
    return APIClient.get(MOVIE.FOR_ADMIN, { params: payload });
};

const getMovie = async (id: string) => {
    return APIClient.get(`${MOVIE.ROOT}/${id}`);
};

const getMovieForAdmin = async (id: string) => {
    return APIClient.get(`${MOVIE.FOR_ADMIN}/${id}`);
};

const createMovie = async (payload: FormData) => {
    return APIClient.post(MOVIE.ROOT, payload);
};

const updateMovie = async (id: string, payload: FormData) => {
    return APIClient.put(`${MOVIE.ROOT}/${id}`, payload);
};

const activateMovie = async (payload: string) => {
    return APIClient.put(`${MOVIE.ACTIVATE_MOVIE}/${payload}`);
};

const deactivateMovie = async (payload: string) => {
    return APIClient.put(`${MOVIE.DEACTIVATE_MOVIE}/${payload}`);
};

const terminatedMovie = async (payload: string) => {
    return APIClient.delete(`${MOVIE.TERMINATED_MOVIE}/${payload}`);
};

const getRecommendMovies = async () => {
    return APIClient.get(MOVIE.RECOMMEND);
};

const getTrendingMovies = async ({ page, limit }: any) => {
    return APIClient.get(MOVIE.TRENDING_MOVIE, { params: { page, limit } });
};

const getSimilarMovies = async (id: string) => {
    return APIClient.get(`${MOVIE.SIMILAR}/${id}`);
};

const getMovieOfPerson = async (payload: any) => {
    const { id, ...pagination } = payload;
    return APIClient.get(`${MOVIE.MOVIE_PERSON}/${id}`, {
        params: pagination
    });
};

export default {
    fetchMovies,
    fetchMoviesForAdmin,
    getMovie,
    getMovieForAdmin,
    createMovie,
    updateMovie,
    activateMovie,
    deactivateMovie,
    terminatedMovie,
    getRecommendMovies,
    getTrendingMovies,
    getSimilarMovies,
    getMovieOfPerson
};
