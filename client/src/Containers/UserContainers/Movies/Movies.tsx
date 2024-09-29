import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { CollapseMenu, NoDataFound } from '@/Components/Common';
import Select from 'react-select';
import DefaultLayout from '@/Components/DefaultLayout';
import { fetchAllMovies } from '@/Redux/Features/Movies/MoviesAction';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import { IMovie } from '@/Interfaces/Movie.interface';
import { IGenre } from '@/Interfaces/Genre.interface';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    IMoviePaginationFilter,
    IPaginationFilter
} from '@/Interfaces/Pagination.interface';
import _ from 'lodash';
import { InfiniteScroll } from '@/Components/Common';
import { MovieSaves } from '@/Redux/Features/Movies';
import { Popover } from 'react-tiny-popover';
import loadingImage from '@/Assets/Loading/loading.gif';
import Utils from '@/Utils';
import { ISelect } from '@/Interfaces/Select.interface';
import { YEAR_SELECT_LIST } from '@/Constants/Lists/Select.list';

const { resetMovieState } = MovieSaves;

const options: ISelect[] = [
    { value: 'createdAt', label: 'Mới nhất' },
    { value: 'averageRating', label: 'Đánh giá' }
];

const optionTypeMovie: ISelect[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'single', label: 'Phim lẻ' },
    { value: 'tv', label: 'Phim bộ' }
];

const Movies: React.FC = () => {
    const dispatch = useTypedDispatch();

    const { pathname, state } = useLocation();
    const genreId = state?.genreId;

    const movieList: any = useSelector(
        (state: RootState) => state.MOVIES.movieLists
    );
    const pagination: IPaginationFilter = useSelector((state: RootState) =>
        _.get(state.MOVIES, 'pagination')
    );
    const meta: any = useSelector((state: RootState) =>
        _.get(state.MOVIES, 'meta')
    );
    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.MOVIES, 'isFetchLoading')
    );

    const genreLists: IGenre[] = useSelector(
        (state: RootState) => state.APP_STATE.genreLists
    );

    const [filters, setFilters] = useState<IMoviePaginationFilter>(pagination);
    const [isShowMenu, setIsShowMenu] = useState(false);

    const handleOptionSortChange = (option: ISelect | null) => {
        if (option?.value && option.value !== _.get(pagination, 'sortBy'))
            setFilters({
                ...filters,
                page: 1,
                isFetchNew: true,
                sortBy: option.value.toString()
            });
    };

    useEffect(() => {
        if (filters.isFetchNew)
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        dispatch(fetchAllMovies(filters));
    }, [filters]);

    useEffect(() => {
        if (genreId)
            setFilters({
                ...filters,
                searchBy: 'all',
                isFetchNew: true,
                genre: genreId ? [genreId] : []
            });
    }, [genreId]);

    useEffect(() => {
        return () => {
            dispatch(resetMovieState());
        };
    }, [pathname]);

    const handleGenreChange = (id: string) => {
        let genreList = filters?.genre ? [...filters.genre] : [];
        if (genreList.includes(id)) {
            genreList = _.without(genreList, id);
        } else genreList = [...genreList, id];
        setFilters({
            ...filters,
            isFetchNew: true,
            page: 1,
            genre: genreList
        });
    };

    const fetchMore = () => {
        if (meta)
            setFilters({
                ...filters,
                isFetchNew: false,
                page: meta.currentPage + 1
            });
    };
    const handleOptionYearChange = (option: ISelect | null) => {
        if (option && option.value !== _.get(pagination, 'year'))
            setFilters({
                ...filters,
                isFetchNew: true,
                page: 1,
                year: option.value
            });
    };
    const __renderContent = () => {
        return (
            <div className="w-full flex lg:flex-row flex-col-reverse mt-16">
                <div className="w-full lg:w-3/4 px-6 mt-6 lg:mt-2 pb-5">
                    <div className="flex justify-between">
                        <p className="text-lg uppercase relative py-1.5 bg-red-700 text-white pl-2 rounded-md rounded-r-none w-48">
                            Danh sách phim{' '}
                            {filters.searchBy === 'all'
                                ? ''
                                : filters.searchBy === 'tv'
                                ? 'bộ'
                                : 'lẻ'}
                            <span className="absolute left-full top-0 border-red-700 w-0 h-0 border-b-[2.5rem] border-solid border-r-[2.5rem] border-r-transparent"></span>
                        </p>
                        <div className="border-b flex-1 border-red-300 flex justify-end items-center">
                            <Popover
                                isOpen={isShowMenu}
                                positions={['bottom', 'left']}
                                containerStyle={{
                                    zIndex: '99999',
                                    marginTop: '4px'
                                }}
                                padding={0}
                                onClickOutside={() => setIsShowMenu(false)}
                                content={
                                    <div className="mt-2 bg-white z-50 w-48 gap-1 flex flex-col rounded border border-gray-200 shadow-lg">
                                        {optionTypeMovie.map((item) => (
                                            <button
                                                key={item.value}
                                                className="px-4 py-1.5 hover:bg-indigo-200 font-medium"
                                                onClick={() => {
                                                    if (
                                                        item.value !==
                                                        filters.searchBy
                                                    )
                                                        setFilters({
                                                            ...filters,
                                                            searchBy:
                                                                item.value + ''
                                                        });
                                                    setIsShowMenu(false);
                                                }}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                }
                            >
                                <div onClick={() => setIsShowMenu(!isShowMenu)}>
                                    <span className="flex items-center gap-2 min-w-24 px-3 py-1 bg-sky-700 text-white font-medium rounded-full cursor-pointer group-hover:bg-sky-600">
                                        {
                                            optionTypeMovie.find(
                                                (item) =>
                                                    item.value ===
                                                    filters.searchBy
                                            )?.label
                                        }
                                        <span className="text-xl relative -top-1">
                                            <i className="icon-sort-down"></i>
                                        </span>
                                    </span>
                                </div>
                            </Popover>
                        </div>
                    </div>
                    <div className="mt-5">
                        <InfiniteScroll
                            fetchMore={fetchMore}
                            hasMore={meta && meta.currentPage < meta.totalPages}
                            endMessage={
                                movieList?.length > 0
                                    ? 'Bạn đã xem hết rồi.'
                                    : ''
                            }
                            loadingComponent={
                                <>
                                    {filters.isFetchNew && isFetchLoading ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-4">
                                            {Array(8)
                                                .fill(0)
                                                .map((_, index) => (
                                                    <div
                                                        key={`${index}loading`}
                                                        className="overflow-hidden h-96 rounded-lg animate-pulse bg-zinc-200 dark:bg-gray-700"
                                                    />
                                                ))}
                                        </div>
                                    ) : (
                                        <div
                                            className={`flex items-center justify-center ${
                                                movieList?.length > 0
                                                    ? 'mt-0'
                                                    : 'mt-24'
                                            }`}
                                        >
                                            <img
                                                src={loadingImage}
                                                alt="Loading..."
                                                className="w-52"
                                            />
                                        </div>
                                    )}
                                </>
                            }
                            isLoading={isFetchLoading}
                        >
                            {!isFetchLoading && movieList?.length < 1 && (
                                <NoDataFound firstClassImg={'h-64'} />
                            )}
                            {movieList?.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-4">
                                    {movieList.map(
                                        (movie: IMovie, index: number) => {
                                            return (
                                                <Link
                                                    key={movie?.id + index}
                                                    to={`/film/${movie?.id}`}
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
                                                                    ? movie?.averageRating.toFixed(
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
                                                            alt="Poster film"
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
                            )}
                        </InfiniteScroll>
                    </div>
                </div>
                <div className="w-full lg:w-1/4 pt-4 border-l px-6 border-stone-300">
                    <>
                        <CollapseMenu heading="Sắp xếp theo">
                            <>
                                <Select
                                    options={options}
                                    value={options.find(
                                        (item) => item.value === filters?.sortBy
                                    )}
                                    onChange={(option: ISelect | null) =>
                                        handleOptionSortChange(option)
                                    }
                                    className="mb-3 mt-3"
                                    menuPosition="fixed"
                                />
                            </>
                        </CollapseMenu>
                        <div className="mt-3">
                            <CollapseMenu heading="Lọc">
                                <>
                                    <span className="font-semibold text-lg py-2 block ">
                                        Thể loại
                                    </span>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                                        {genreLists &&
                                            genreLists.map((genre: IGenre) => (
                                                <button
                                                    key={`genreFilter${genre?.id}`}
                                                    className={`outline-none px-3 py-1 border border-gray-300 rounded-full font-medium text-[15px] transition duration-200 ${
                                                        filters?.genre?.includes(
                                                            genre.id
                                                        )
                                                            ? 'bg-gradient-to-r border-transparent from-blue-600 to-sky-600 text-white hover:opacity-85'
                                                            : 'md:hover:bg-indigo-200 border-stone-400'
                                                    }`}
                                                    onClick={() =>
                                                        handleGenreChange(
                                                            genre?.id
                                                        )
                                                    }
                                                >
                                                    {genre?.name}
                                                </button>
                                            ))}
                                    </div>
                                    <div className="mt-2 mb-3 px-2">
                                        <span className="font-semibold text-lg py-2 block ">
                                            Năm phát hành
                                        </span>
                                        <Select
                                            options={YEAR_SELECT_LIST}
                                            value={
                                                YEAR_SELECT_LIST.find(
                                                    (item) =>
                                                        item.value ===
                                                        filters?.year
                                                ) || YEAR_SELECT_LIST[0]
                                            }
                                            onChange={(
                                                option: ISelect | null
                                            ) => handleOptionYearChange(option)}
                                            className="mb-3 z-20"
                                            menuPosition="fixed"
                                        />
                                    </div>
                                </>
                            </CollapseMenu>
                        </div>
                    </>
                </div>
            </div>
        );
    };

    return <DefaultLayout portalFor="USER" children={__renderContent()} />;
};
export default Movies;
