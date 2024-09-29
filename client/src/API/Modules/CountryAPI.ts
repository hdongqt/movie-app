import { IPaginationFilter } from '@/Interfaces/Pagination.interface';
import APIClient from '../Client/APIClient';
import { API } from '@/Constants';
const { COUNTRY } = API;

const fetchCountries = async (payload: IPaginationFilter) => {
    return APIClient.get(COUNTRY.ROOT, { params: payload });
};

export default {
    fetchCountries
};
