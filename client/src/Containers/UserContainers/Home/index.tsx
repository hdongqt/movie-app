import React, { useEffect, useState } from 'react';
import { MovieCarousel, Skeleton } from '@/Components/Common';
import { SlideMaker } from '@/Components/LayoutPart';
import { useSelector } from 'react-redux';
import { HomeActions } from '@/Redux/Features/Home';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import _ from 'lodash';
import DefaultLayout from '@/Components/DefaultLayout';
import { Link } from 'react-router-dom';
import { IMovie, TMovieType } from '@/Interfaces/Movie.interface';
import dayjs from 'dayjs';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const { fetchAllMediaHome, getTrending } = HomeActions;
const Home: React.FC = () => {
    const dispatch = useTypedDispatch();
    const homeSate: any = useSelector((state: RootState) => state.HOME);
    const recommendMovies: any = _.get(homeSate, 'dataMovieRecommend');
    const singleMovies: any = _.get(homeSate, 'dataMovieSingle');
    const tvSeriesMovies: any = _.get(homeSate, 'dataMovieTV');
    const dataRatingMovie: any = _.get(homeSate, 'dataRatingMovie');
    const trendingMovies: any = _.get(homeSate, 'dataMovieTrending');
    const isFetchLoading: boolean = _.get(homeSate, 'isFetchLoading');
    const isGetLoading: boolean = _.get(homeSate, 'isGetLoading');

    useEffect(() => {
        dispatch(fetchAllMediaHome());
        dispatch(getTrending());
    }, []);
    const __renderContent = () => {
        return (
            <div className="w-full flex mt-16">
                <div className="w-full lg:w-3/4 px-6 mt-3 pb-5">
                    <SlideMaker />
                    <div className="mt-5">
                        <MovieCarousel
                            movies={recommendMovies || []}
                            mediaHeading="Phim đề cử"
                            isLoading={isFetchLoading}
                        />
                    </div>
                    <div className="mt-5">
                        <MovieCarousel
                            movies={dataRatingMovie || []}
                            mediaHeading="Xếp hạng"
                            isLoading={isFetchLoading}
                        />
                    </div>
                    <div className="mt-5">
                        <MovieCarousel
                            movies={tvSeriesMovies || []}
                            mediaHeading="Phim bộ mới"
                            isLoading={isFetchLoading}
                        />
                    </div>
                    <div className="mt-5">
                        <MovieCarousel
                            movies={singleMovies || []}
                            mediaHeading="Phim lẻ mới"
                            isLoading={isFetchLoading}
                        />
                    </div>
                </div>
                <div className="hidden lg:block w-1/4 border-l px-6 border-stone-300">
                    <p className="mb-5 mt-3">
                        <span className="text-black relative text-xl font-bold">
                            Trending
                            <span className="w-2/3 h-[3px] bg-red-600 absolute left-0 -bottom-1"></span>
                        </span>
                    </p>
                    <div className="flex flex-col gap-6">
                        {isGetLoading && <Skeleton isMulti rowNumber={16} />}
                        {trendingMovies?.length > 0 &&
                            trendingMovies.map(
                                (movie: IMovie, index: number) => {
                                    return (
                                        <Link
                                            key={`movieHome${index}`}
                                            className="flex gap-4 group hover:opacity-90 transition"
                                            to={`/film/${movie?.id}`}
                                        >
                                            <div className="h-48 w-2/5 overflow-hidden rounded-xl group relative">
                                                <LazyLoadImage
                                                    src={movie?.thumbnailPath}
                                                    alt="loading..."
                                                    className="absolute w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="mt-1 flex-1">
                                                <h3 className="font-semibold text-lg line-clamp-1">
                                                    {movie?.vietnameseName}
                                                </h3>
                                                <h4 className="line-clamp-1 font-medium text-indigo-800">
                                                    {movie?.originalName}
                                                </h4>
                                                <p className="mb-2 text-stale-600 font-medium">
                                                    {movie?.release || 'N/A'}
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
                    </div>
                </div>
            </div>
        );
    };

    return <DefaultLayout portalFor="USER" children={__renderContent()} />;
};

export default Home;
