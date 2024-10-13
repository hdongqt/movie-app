import { IPaginationFilter } from '@/Interfaces/Pagination.interface';
import APIClient from '../Client/APIClient';
import { API } from '@/Constants';
import { IUpdatePassword, IUpdateProfile } from '@/Interfaces/User.interface';
const { USER } = API;

const fetchUsers = async (payload: IPaginationFilter) => {
    return APIClient.get(USER.ROOT, { params: payload });
};

const getUser = async (payload: string) => {
    return APIClient.get(`${USER.ROOT}/${payload}`);
};

const updateProfile = async (payload: IUpdateProfile) => {
    return APIClient.put(`${USER.ROOT}/update-profile`, payload);
};

const updatePassword = async (payload: IUpdatePassword) => {
    return APIClient.put(`${USER.ROOT}/update-password`, payload);
};

const activateUser = async (payload: string) => {
    return APIClient.put(`${USER.ACTIVATE_USER}/${payload}`);
};

const deactivateUser = async (payload: string) => {
    return APIClient.put(`${USER.DEACTIVATE_USER}/${payload}`);
};

const fetchFavorites = async (payload: IPaginationFilter) => {
    return APIClient.get(USER.FAVORITES, { params: payload });
};

const addMovieToFavorites = async (payload: string) => {
    return APIClient.post(USER.FAVORITES, { movieId: payload });
};

const deleteMovieFromFavorites = async (payload: string) => {
    return APIClient.delete(`${USER.FAVORITES}/${payload}`);
};

export default {
    fetchUsers,
    getUser,
    updateProfile,
    updatePassword,
    activateUser,
    deactivateUser,
    fetchFavorites,
    addMovieToFavorites,
    deleteMovieFromFavorites
};
