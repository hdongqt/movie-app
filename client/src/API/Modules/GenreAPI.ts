import { IPaginationFilter } from '@/Interfaces/Pagination.interface';
import APIClient from '../Client/APIClient';
import { API } from '@/Constants';
import { IGenreSave } from '@/Interfaces/Genre.interface';
const { GENRE } = API;

const fetchGenres = async (payload: IPaginationFilter) => {
    return APIClient.get(GENRE.ROOT, { params: payload });
};

const createGenre = async (payload: IGenreSave) => {
    return APIClient.post(GENRE.ROOT, payload);
};

const getGenre = async (payload: string) => {
    return APIClient.get(`${GENRE.ROOT}/${payload}`);
};

const updateGenre = async (id: string, payload: IGenreSave) => {
    return APIClient.put(`${GENRE.ROOT}/${id}`, payload);
};

const activateGenre = async (payload: string) => {
    return APIClient.put(`${GENRE.ACTIVATE_GENRE}/${payload}`);
};

const deactivateGenre = async (payload: string) => {
    return APIClient.put(`${GENRE.DEACTIVATE_GENRE}/${payload}`);
};

export default {
    fetchGenres,
    createGenre,
    getGenre,
    updateGenre,
    activateGenre,
    deactivateGenre
};
