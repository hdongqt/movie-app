import _ from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CollapseMenu } from '@/Components/Common';
import DefaultLayout from '@/Components/DefaultLayout';
import {
    fetchSearchMovies,
    getRecommendMovies
} from '@/Redux/Features/Search/SearchAction';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import { IMovie } from '@/Interfaces/Movie.interface';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    IMoviePaginationFilter,
    IPaginationFilter
} from '@/Interfaces/Pagination.interface';

import { SearchActions } from '@/Redux/Features/Search';
import { Pagination, Skeleton } from '@/Components/Common';
import { ROUTERS } from '@/Constants';

const { resetSearchState, setHistorySearch } = SearchActions;

interface ISelect {
    value: string;
    label: string;
}

const options: ISelect[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'single', label: 'Phim lẻ' },
    { value: 'tv', label: 'Phim bộ' }
];

const SearchMovies: React.FC = () => {
    const dispatch = useTypedDispatch();

    const movieSearchLists: any = useSelector(
        (state: RootState) => state.SEARCH.movieSearchLists
    );
    const recommendMovies: IMovie[] = useSelector(
        (state: RootState) => state.SEARCH.recommendMovies
    );
    const pagination: IPaginationFilter = useSelector((state: RootState) =>
        _.get(state.SEARCH, 'pagination')
    );
    const meta: any = useSelector((state: RootState) =>
        _.get(state.SEARCH, 'meta')
    );

    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.SEARCH, 'isFetchLoading')
    );
    const isGetLoading: boolean = useSelector((state: RootState) =>
        _.get(state.SEARCH, 'isGetLoading')
    );

    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState<string>('');

    const historySearch: IMoviePaginationFilter | null = useSelector(
        (state: RootState) => state.SEARCH.historySearch
    );

    const [filters, setFilters] = useState<IMoviePaginationFilter>(pagination);

    useEffect(() => {
        if (filters.keyword) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            dispatch(fetchSearchMovies(filters));
        }
    }, [filters]);

    useEffect(() => {
        if (historySearch) {
            const { keyword } = historySearch;
            setFilters(historySearch);
            setSearchValue(keyword);
            dispatch(setHistorySearch(null));
        }
        dispatch(getRecommendMovies());
        return () => {
            dispatch(resetSearchState());
        };
    }, []);

    const handleSearchPress = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            event &&
            event.key === 'Enter' &&
            searchValue &&
            searchValue !== _.get(pagination, 'keyword')
        ) {
            setFilters({
                ...filters,
                keyword: searchValue,
                isFetchNew: true,
                page: 1
            });
        }
    };

    const handleChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handlePageClick = ({ selected }: { selected: number }) => {
        setFilters({
            ...filters,
            page: selected + 1
        });
    };

    const handleClickMovie = (id: string) => {
        navigate(`${ROUTERS.FILM}/${id}`);
        dispatch(setHistorySearch(filters));
    };

    const __renderContent = () => {
        return (
            <div className="w-full flex flex-col-reverse lg:flex-row pt-16 min-h-screen justify-end lg:justify-normal dark:bg-slate-900">
                <div className="w-full lg:w-3/4 px-6 mt-4 pb-5">
                    <div className="border-b pb-2 border-gray-200 dark:border-slate-600 flex flex-col-reverse md:flex-row justify-between items-center">
                        {filters.keyword && (
                            <p className="font-medium text-lg line-clamp-1 mr-5 mt-2 md:mt-0 dark:text-white">
                                Kết quả tìm kiếm cho "{filters.keyword}
                            </p>
                        )}
                        <div className="flex items-center py-1 relative w-full md:w-96 h-11 ml-auto">
                            <input
                                type="search"
                                className="block w-full outline-none h-full ps-4 bg-gray-50 border border-gray-400 rounded-full absolute top-0 left-0 dark:border-slate-600 dark:bg-gray-600 dark:text-white"
                                value={searchValue}
                                placeholder="Tìm kiếm phim..."
                                onChange={handleChangeSearchValue}
                                onKeyDown={handleSearchPress}
                            />
                            <span
                                className="text-xl text-white absolute top-1/2 right-0 cursor-pointer hover:bg-blue-700 -translate-y-1/2 bg-blue-500 px-4 h-full rounded-full rounded-l-none flex items-center"
                                onClick={() => {
                                    if (
                                        searchValue &&
                                        searchValue !==
                                            _.get(pagination, 'keyword')
                                    ) {
                                        setFilters({
                                            ...filters,
                                            keyword: searchValue,
                                            isFetchNew: true,
                                            page: 1
                                        });
                                    }
                                }}
                            >
                                <i className="icon-search"></i>
                            </span>
                        </div>
                    </div>
                    <div className="mt-5">
                        {(isFetchLoading || isGetLoading) && (
                            <Skeleton rowNumber={10} isMulti />
                        )}
                        {!isFetchLoading &&
                            !isGetLoading &&
                            movieSearchLists && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-4">
                                    {movieSearchLists.map(
                                        (movie: IMovie, index: number) => {
                                            return (
                                                <div
                                                    key={movie?.id + index}
                                                    onClick={() =>
                                                        handleClickMovie(
                                                            movie?.id
                                                        )
                                                    }
                                                    className="cursor-pointer rounded-lg overflow-hidden relative group shadow-inner"
                                                >
                                                    <div className="overflow-hidden h-80">
                                                        <span
                                                            className="text-4xl w-12 items-center justify-center h-12 text-white absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
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
                                                            effect="blur"
                                                            alt="Poster film"
                                                            width={'100%'}
                                                            height={'100%'}
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
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        {movieSearchLists.length < 1 &&
                            recommendMovies &&
                            recommendMovies.length > 0 && (
                                <>
                                    <p className="text-[22px] font-medium border-l-4 border-red-600 pl-2 mb-5 dark:text-white">
                                        Có thể bạn muốn xem
                                    </p>
                                    <div className="flex flex-col gap-5 mt-4">
                                        {recommendMovies.map(
                                            (movie: IMovie) => {
                                                return (
                                                    <Link
                                                        to={`${ROUTERS.FILM}/${movie.id}`}
                                                        className="search-recommend-item items-center md:items-start py-2 pl-2 pr-3 flex 
                                                        gap-6 rounded-lg bg-no-repeat bg-cover hover:opacity-85 
                                                        transition relative overflow-hidden"
                                                        style={{
                                                            backgroundImage: `url(${movie?.posterPath})`
                                                        }}
                                                    >
                                                        <div className="block absolute inset-0 bg-gradient-to-r from-[#000] to-[#0000004d]"></div>
                                                        <LazyLoadImage
                                                            src={
                                                                movie?.thumbnailPath
                                                            }
                                                            alt="loading"
                                                            width={'100%'}
                                                            height={'100%'}
                                                            className="hidden z-10 md:block h-60 w-40 min-w-40 object-cover rounded md:border md:border-teal-200"
                                                        />
                                                        <div className="md:mt-2 z-10 w-full">
                                                            <div className="flex justify-between flex-col-reverse sm:flex-row relative">
                                                                <h3 className="text-xl text-red-600 md:text-2xl pr-36 md:pr-2 font-semibold line-clamp-1 flex-1 uppercase">
                                                                    {
                                                                        movie?.vietnameseName
                                                                    }
                                                                </h3>
                                                                <div className="absolute right-1 top-1 md:static md:right-auto md:top-auto">
                                                                    <span className="flex gap-2 items-center justify-end md:justify-normal">
                                                                        <span className="text-sm md:text-base font-medium md:font-normal text-white bg-red-600 py-1 px-2 rounded-md ml-2">
                                                                            {movie?.release ||
                                                                                'N/A'}
                                                                        </span>
                                                                        <span className="text-sm font-medium md:font-normal md:text-base inline-block w-14 py-1 text-center bg-yellow-500 rounded-md text-white">
                                                                            {movie?.averageRating
                                                                                ? movie?.averageRating.toFixed(
                                                                                      1
                                                                                  )
                                                                                : 0}
                                                                            <i className="icon-star pl-1" />
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <h4 className="font-medium text-white line-clamp-1 text-sm mt-2 md:text-base">
                                                                {
                                                                    movie?.originalName
                                                                }
                                                            </h4>
                                                            <p className="line-clamp-2 md:line-clamp-3 text-sm md:text-base text-white pt-5">
                                                                {
                                                                    movie?.overview
                                                                }
                                                            </p>
                                                        </div>
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            )}
                    </div>

                    {movieSearchLists && movieSearchLists.length > 0 && (
                        <div className="mt-10">
                            <Pagination
                                pageCount={meta?.totalPages || 0}
                                currentPage={(meta?.currentPage || 1) - 1}
                                handlePageClick={handlePageClick}
                            />
                        </div>
                    )}
                </div>
                <div className="w-full lg:w-1/4 pt-4 border-l px-6 border-stone-300 dark:border-slate-600">
                    <>
                        <CollapseMenu heading="Tìm kiếm theo">
                            <div className="flex lg:flex-col gap-3 my-3 justify-center">
                                {options.map((op) => (
                                    <button
                                        className={`p-2 w-28 lg:w-auto outline-none border rounded-md dark:border-slate-500 font-medium transition ${
                                            op.value === filters.movieType
                                                ? 'bg-red-600 text-white pointer-events-none'
                                                : 'hover:bg-red-600 hover:text-white duration-200 dark:text-white'
                                        }`}
                                        key={`type${op.value}`}
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                movieType: op.value,
                                                page: 1
                                            })
                                        }
                                    >
                                        {op.label}
                                    </button>
                                ))}
                            </div>
                        </CollapseMenu>
                    </>
                </div>
            </div>
        );
    };

    return <DefaultLayout portalFor="USER" children={__renderContent()} />;
};
export default SearchMovies;
