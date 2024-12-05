import MOVIE_TYPE from '@/Constants/Enums/MovieType.enum';
import { Dayjs } from 'dayjs';

export interface IPaginationFilter {
    limit: number;
    page: number;
    sortBy?: string;
    orderBy?: string;
    keyword?: string;
    dateFrom?: string | Dayjs | null;
    dateTo?: string | Dayjs | null;
    status?: string;
    roleCode?: string;
    countryId?: string;
    year?: string | number;
    searchBy?: string;
}

export interface IPaginationMeta {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export interface IMoviePaginationFilter extends IPaginationFilter {
    isFetchNew?: boolean;
    genre?: string[];
    country?: string;
    movieType?: string;
}

export interface IPersonPaginationFilter extends IPaginationFilter {
    isFetchNew?: boolean;
    id: string;
}
