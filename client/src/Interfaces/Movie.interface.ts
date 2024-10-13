import MOVIE_TYPE from '@/Constants/Enums/MovieType.enum';
import { IPaginationFilter } from './Pagination.interface';
import { IGenre } from './Genre.interface';

export type TMovieType = 'movie' | 'tv';

export interface IPersonMovie {
    name: string;
    role: string;
    id?: string;
}

export interface IEpisodeMovie {
    name: string;
    path: [string];
    id: string;
}

export interface IMovie {
    id: string;
    movieType: MOVIE_TYPE;
    originalName: string;
    vietnameseName: string;
    overview: string;
    release: string;
    thumbnailPath: string;
    posterPath: string;
    averageRating: number;
    totalRating: number;
    genres: IGenre[];
    countries?: string[];
    persons: IPersonMovie[];
    episodes: IEpisodeMovie[];
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface IMovieSave {
    movieType: 'single' | 'tv';
    originalName: string;
    vietnameseName: string;
    overview: string;
    release: number;
    thumbnail: File | null;
    poster: File | null;
    countries: string[];
    genres: string[];
    episodes: { name: string; path: string }[];
    creators: string[];
    actors: string[];
}
