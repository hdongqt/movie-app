import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
    Link,
    useLocation,
    useMatch,
    useNavigate,
    useParams
} from 'react-router-dom';

import { CollapseMenu } from '@/Components/Common';
import Select, { MultiValue } from 'react-select';
import DefaultLayout from '@/Components/DefaultLayout';
import { fetchAllMovies } from '@/Redux/Features/Movies/MoviesAction';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import { IMovie } from '@/Interfaces/Movie.interface';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import dayjs from 'dayjs';
import {
    IPaginationFilter,
    IPersonPaginationFilter
} from '@/Interfaces/Pagination.interface';
import _ from 'lodash';
import { InfiniteScroll } from '@/Components/Common';

import { GenreAPI } from '@/API';
import { DEFAULT_PAGINATION } from '@/Constants/DefaultPagination';
import axios from 'axios';
import {
    getDetail,
    getMovieOfPerson
} from '@/Redux/Features/Persons/PersonsAction';
import Urls from '@/Constants/Urls';
import { MoviesAction } from '@/Redux/Features/Movies';
import { ROUTERS } from '@/Constants';
const { resetMovieState } = MoviesAction;

const Persons: React.FC = () => {
    const dispatch = useTypedDispatch();
    const { id } = useParams();

    const movieOfPerson: any = useSelector(
        (state: RootState) => state.PERSON.movieOfPerson
    );
    const trendingMovies: any = useSelector(
        (state: RootState) => state.PERSON.trendingMovies
    );
    const pagination: IPersonPaginationFilter = useSelector(
        (state: RootState) => _.get(state.PERSON, 'pagination')
    );
    const meta: any = useSelector((state: RootState) =>
        _.get(state.PERSON, 'meta')
    );

    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.PERSON, 'isFetchLoading')
    );
    const isGetLoading: boolean = useSelector((state: RootState) =>
        _.get(state.PERSON, 'isGetLoading')
    );

    const personDetail: any = useSelector(
        (state: RootState) => state.PERSON.personDetail
    );

    useEffect(() => {
        if (id) {
            dispatch(
                getMovieOfPerson({
                    ...pagination,
                    id: id,
                    isFetchNew: true
                })
            );
            dispatch(getDetail(id));
        }
        return () => {
            dispatch(resetMovieState());
        };
    }, [id]);

    const fetchMore = () => {
        if (meta)
            dispatch(
                getMovieOfPerson({
                    ...pagination,
                    page: meta.currentPage + 1,
                    isFetchNew: false
                })
            );
    };

    const __renderContent = () => {
        return (
            <div className="w-full flex pt-16 dark:bg-slate-900">
                <div className="w-full lg:w-3/4 px-6 mt-3 pb-5">
                    <div className="flex items-center gap-3">
                        {!isGetLoading && (
                            <>
                                <p className="flex-1 dark:text-white font-semibold text-lg md:text-xl border-l-4 text-gray-800 border-red-600 pl-2 line-clamp-1 w-full">
                                    Phim{' '}
                                    <span className="text-red-600">
                                        {personDetail?.name}
                                    </span>{' '}
                                    đã tham gia
                                </p>
                            </>
                        )}
                        {isGetLoading && (
                            <>
                                <div className="h-8 animate-pulse flex-1 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </>
                        )}
                    </div>
                    <div className="mt-8">
                        <InfiniteScroll
                            fetchMore={fetchMore}
                            hasMore={meta && meta.currentPage < meta.totalPages}
                            loadingComponent={
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-4">
                                    {Array(4)
                                        .fill(0)
                                        .map((_, index) => (
                                            <div
                                                key={`${index}loading`}
                                                className="overflow-hidden h-96 rounded-lg animate-pulse bg-zinc-200 dark:bg-gray-700"
                                            />
                                        ))}
                                </div>
                            }
                            isLoading={isFetchLoading}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-4">
                                {!isFetchLoading &&
                                    movieOfPerson &&
                                    movieOfPerson.length > 0 &&
                                    movieOfPerson.map(
                                        (movie: IMovie, index: number) => {
                                            return (
                                                <Link
                                                    key={movie?.id + index}
                                                    to={`${ROUTERS.FILM}/${movie?.id}`}
                                                    className="rounded-lg overflow-hidden relative group shadow-inner"
                                                >
                                                    <div className="overflow-hidden h-80">
                                                        <span
                                                            className="text-3xl pl-1 w-12 items-center justify-center h-12 text-white absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                                        bg-gray-600 group-hover:bg-red-600 rounded-full transition duration-150 z-10 flex
                                    "
                                                        >
                                                            <i className="icon-play"></i>
                                                        </span>
                                                        <span
                                                            className="z-10 w-16 absolute top-2 left-0 flex gap-1 bg-gradient-to-r from-rose-600 to-red-700 py-1 pl-3 pr-4 
                                            rounded-md rounded-l-none text-white text-sm"
                                                        >
                                                            <span className="font-semibold">
                                                                {movie?.averageRating
                                                                    ? movie.averageRating.toFixed(
                                                                          1
                                                                      )
                                                                    : 0}
                                                            </span>
                                                            <span>
                                                                <i className="icon-star"></i>
                                                            </span>
                                                        </span>
                                                        <span className="absolute w-16 z-10 top-2 right-0 flex gap-1 bg-gradient-to-r from-blue-700 font-semibold to-sky-600 py-1 pl-4 pr-3 rounded-md rounded-r-none text-white text-sm">
                                                            <span>
                                                                {movie?.release ||
                                                                    'N/A'}
                                                            </span>
                                                        </span>
                                                        <LazyLoadImage
                                                            src={
                                                                movie?.thumbnailPath
                                                            }
                                                            alt="ThumbMovie"
                                                            width={'100%'}
                                                            height={'100%'}
                                                            effect="blur"
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                        />
                                                    </div>
                                                    <div className="px-2 py-3 bg-gradient-to-r from-slate-800 to-slate-600">
                                                        <h3 className="px-2 text-center text-white font-medium text-lg line-clamp-1">
                                                            {
                                                                movie?.vietnameseName
                                                            }
                                                        </h3>
                                                    </div>
                                                </Link>
                                            );
                                        }
                                    )}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
                <div className="hidden lg:block w-1/4 border-l px-6 border-stone-300 dark:border-slate-600">
                    <div className="">
                        <p className="mb-5 mt-3">
                            <span className="text-black dark:text-white relative text-xl font-bold">
                                Trending
                                <span className="w-2/3 h-[3px] bg-red-600 absolute left-0 -bottom-1" />
                            </span>
                        </p>
                        <div className="flex flex-col gap-6">
                            {!isGetLoading &&
                                trendingMovies &&
                                trendingMovies.map(
                                    (movie: IMovie, index: number) => {
                                        return (
                                            <Link
                                                key={`trendMovies${index}`}
                                                className="flex gap-4 group hover:opacity-90 transition"
                                                to={`${ROUTERS.FILM}/${movie.id}`}
                                            >
                                                <div className="h-48 w-2/5 overflow-hidden rounded-xl group relative">
                                                    <LazyLoadImage
                                                        src={
                                                            movie?.thumbnailPath
                                                        }
                                                        effect="blur"
                                                        width={'100%'}
                                                        height={'100%'}
                                                        alt="ThumbMovie"
                                                        className="absolute w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="mt-1 flex-1">
                                                    <h3 className="font-semibold text-lg line-clamp-1 dark:text-white">
                                                        {movie?.vietnameseName}
                                                    </h3>
                                                    <h4 className="line-clamp-1 font-medium text-indigo-800">
                                                        {movie?.originalName}
                                                    </h4>
                                                    <p className="mb-2 text-stale-600 font-medium dark:text-white">
                                                        {movie?.release ||
                                                            'N/A'}
                                                    </p>
                                                    <span className="items-baseline text-white bg-yellow-500 px-1 py-[2px] rounded-md">
                                                        <span className="text-base">
                                                            <i className="icon-star" />
                                                        </span>
                                                        <span className="font-medium pl-1">
                                                            {movie?.averageRating.toFixed(
                                                                1
                                                            ) || 0}
                                                        </span>
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    }
                                )}
                            {isGetLoading && (
                                <>
                                    {[1, 2, 3, 4, 5].map((item) => {
                                        return (
                                            <div
                                                key={`LoadingTrending${item}`}
                                                className="flex gap-4 animate-pulse"
                                            >
                                                <div className="h-48 w-2/5 overflow-hidden rounded-xl group relative">
                                                    <div className="absolute w-full h-full bg-gray-200 dark:bg-gray-700" />
                                                </div>
                                                <div className="mt-1 flex-1">
                                                    <span className="h-6 rounded-md inline-block w-full bg-gray-200 dark:bg-gray-700"></span>
                                                    <span className="h-6 rounded-md inline-block w-full bg-gray-200 dark:bg-gray-700"></span>
                                                    <span className="h-6 rounded-md inline-block w-full bg-gray-200 dark:bg-gray-700"></span>
                                                    <span className="bg-gray-200 dark:bg-gray-700 rounded-md w-12 inline-block h-6"></span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return <DefaultLayout portalFor="USER" children={__renderContent()} />;
};
export default Persons;
