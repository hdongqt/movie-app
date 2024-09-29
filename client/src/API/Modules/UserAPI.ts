import { IPaginationFilter } from '@/Interfaces/Pagination.interface';
import APIClient from '../Client/APIClient';
import { API } from '@/Constants';
import { IUserSave } from '@/Interfaces/Usser.interface';
const { USER } = API;

const fetchUsers = async (payload: IPaginationFilter) => {
    return APIClient.get(USER.ROOT, { params: payload });
};

const getUser = async (payload: string) => {
    return APIClient.get(`${USER.ROOT}/${payload}`);
};

const updateUser = async (id: string, payload: IUserSave) => {
    return APIClient.put(`${USER.ROOT}/${id}`, payload);
};
const activateUser = async (payload: string) => {
    return APIClient.put(`${USER.ACTIVATE_USER}/${payload}`);
};

const deactivateUser = async (payload: string) => {
    return APIClient.put(`${USER.DEACTIVATE_USER}/${payload}`);
};

export default {
    fetchUsers,
    getUser,
    updateUser,
    activateUser,
    deactivateUser
};
