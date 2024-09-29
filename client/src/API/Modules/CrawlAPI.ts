import { IPaginationFilter } from '@/Interfaces/Pagination.interface';
import APIClient from '../Client/APIClient';
import { API, ENUMS } from '@/Constants';
const { CRAWL } = API;

const fetchCrawls = async (payload: IPaginationFilter) => {
    return APIClient.get(CRAWL.ROOT, { params: payload });
};

const getCrawl = async (id: string) => {
    return APIClient.get(`${CRAWL.ROOT}/${id}`);
};

const createCrawl = async (page: number) => {
    return APIClient.post(`${CRAWL.ROOT}`, { page: page });
};

export default {
    fetchCrawls,
    getCrawl,
    createCrawl
};
