import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { IMovie } from '@/Interfaces/Movie.interface';
import { ENUMS, ROUTERS } from '@/Constants';
import DefaultLayout from '@/Components/DefaultLayout';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { FavoritesAction } from '@/Redux/Features/Favorites';
import { useSelector } from 'react-redux';
import { IFavoritePaginationFilter } from '@/Interfaces/Favorite.interface';
import { InfiniteScroll, NoDataFound } from '@/Components/Common';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import loadingImage from '@/Assets/Loading/loading.gif';
import { Link } from 'react-router-dom';

const { fetchAllFavorites, resetFavoritesState, deleteMovieFromFavorites } =
    FavoritesAction;

const Favorites: React.FC = () => {
    const dispatch = useTypedDispatch();

    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.FAVORITES, 'isFetchLoading')
    );

    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.FAVORITES, 'isActionLoading')
    );

    const pagination: IFavoritePaginationFilter = useSelector(
        (state: RootState) => _.get(state.FAVORITES, 'pagination')
    );
    const meta: any = useSelector((state: RootState) =>
        _.get(state.FAVORITES, 'meta')
    );

    const favoritesMovie = useSelector<RootState, IMovie[]>(
        (state: RootState) => _.get(state.FAVORITES, 'favorites')
    );

    const [deleteMovieId, setDeleteMovieId] = useState('');

    const fetchMore = () => {
        if (meta)
            dispatch(
                fetchAllFavorites({
                    ...pagination,
                    isFetchNew: false,
                    page: meta.currentPage + 1
                })
            );
    };

    const handleDeleteMovieFromFavorites = async (id: string) => {
        setDeleteMovieId(id);
        await dispatch(deleteMovieFromFavorites(id));
        setDeleteMovieId('');
    };

    useEffect(() => {
        dispatch(fetchAllFavorites({ ...pagination, isFetchNew: true }));
        return () => {
            dispatch(resetFavoritesState());
        };
    }, []);

    const __renderContent = () => {
        return (
            <div className="w-full mt-16 px-6 pb-5">
                <div className="flex justify-between pt-5">
                    <p className="text-lg uppercase relative py-1.5 bg-red-700 text-white pl-2 rounded-md rounded-r-none w-max">
                        Danh sách phim yêu thích
                        <span className="absolute left-full top-0 border-red-700 w-0 h-0 border-b-[2.5rem] border-solid border-r-[2.5rem] border-r-transparent"></span>
                    </p>
                    <div className="border-b flex-1 border-red-300 flex justify-end items-center"></div>
                </div>
                <InfiniteScroll
                    fetchMore={fetchMore}
                    hasMore={meta && meta.currentPage < meta.totalPages}
                    loadingComponent={
                        <>
                            {pagination.isFetchNew && isFetchLoading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
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
                                        favoritesMovie?.length > 0
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
                    {!isFetchLoading && favoritesMovie?.length < 1 && (
                        <NoDataFound />
                    )}
                    {favoritesMovie?.length > 0 && (
                        <div className="cursor-pointer grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {favoritesMovie.map((movie: IMovie) => {
                                return (
                                    <div key={`favorites${movie.id}`}>
                                        <Link
                                            to={`${ROUTERS.FILM}/${movie.id}`}
                                            className="block rounded-lg overflow-hidden relative group shadow-inner"
                                        >
                                            <div className="overflow-hidden h-96">
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
                                                    src={movie?.thumbnailPath}
                                                    alt="Poster film"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                />
                                            </div>
                                            <div className="px-2 py-3 bg-gradient-to-r from-slate-800 to-slate-600">
                                                <h3 className="px-2 text-center text-white font-medium text-lg line-clamp-1">
                                                    {movie?.vietnameseName}
                                                </h3>
                                            </div>
                                        </Link>
                                        <div className="mt-2">
                                            <button
                                                disabled={
                                                    isActionLoading &&
                                                    deleteMovieId === movie.id
                                                }
                                                onClick={() => {
                                                    handleDeleteMovieFromFavorites(
                                                        movie.id
                                                    );
                                                }}
                                                className={`transition py-1 flex gap-2 items-center justify-center rounded text-white w-full
                                                    ${
                                                        isActionLoading &&
                                                        deleteMovieId ===
                                                            movie.id
                                                            ? 'bg-gray-400'
                                                            : 'bg-red-600 hover:bg-red-700'
                                                    }
                                                    `}
                                            >
                                                {isActionLoading &&
                                                deleteMovieId === movie.id ? (
                                                    <svg
                                                        aria-hidden="true"
                                                        className="inline w-8 h-8 text-gray-300 animate-spin dark:text-gray-600 fill-gray-500"
                                                        viewBox="0 0 100 101"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentFill"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <span className="text-2xl">
                                                        <i className="icon-trash" />
                                                    </span>
                                                )}

                                                <span className="pl-1 font-medium">
                                                    Xoá
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </InfiniteScroll>
            </div>
        );
    };

    return <DefaultLayout portalFor="USER" children={__renderContent()} />;
};

export default Favorites;
