import { IPaginationFilter } from '@/Interfaces/Pagination.interface';

const DEFAULT_PAGINATION: IPaginationFilter = {
    page: 1,
    limit: 25,
    keyword: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt'
};

const DEFAULT_LOADING_STATES = {
    isFetchLoading: false,
    isGetLoading: false,
    isActionLoading: false
};

export { DEFAULT_PAGINATION, DEFAULT_LOADING_STATES };
