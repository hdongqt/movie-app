import _ from 'lodash';
import React, { ReactNode } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { NoDataFound, Skeleton } from '@/Components/Common';
import { IMovie } from '@/Interfaces/Movie.interface';
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ROUTERS } from '@/Constants';
interface IMovieSwipper {
    movies: IMovie[];
    mediaHeading?: string;
    isLoading?: boolean;
}

const MovieCarousel: React.FC<IMovieSwipper> = ({
    movies,
    mediaHeading,
    isLoading
}: IMovieSwipper) => {
    const items: ReactNode =
        movies &&
        movies.length > 0 &&
        movies.map((movie: IMovie, index: number) => (
            <SwiperSlide key={`${index}${movie.id}`}>
                <Link
                    className="flex group cursor-pointer h-[350px]"
                    key={`${movie?.id}${index}`}
                    to={`${ROUTERS.FILM}/${movie?.url}`}
                >
                    <div className="rounded-lg overflow-hidden w-full h-full relative">
                        <div
                            className="group-hover:opacity-0 transition absolute top-2 left-0 flex gap-1
                            bg-red-600 py-1 px-3 rounded-md text-white text-sm rounded-l-none"
                        >
                            <span>
                                {movie?.averageRating
                                    ? movie?.averageRating.toFixed(1)
                                    : 0}
                            </span>
                            <span>
                                <i className="icon-star"></i>
                            </span>
                        </div>
                        <div className="group-hover:opacity-0 transition rounded-r-none absolute top-2 right-0 flex gap-1 bg-blue-600 py-1 px-3 rounded-md text-white text-sm">
                            <span>{movie?.release || 'N/A'}</span>
                        </div>
                        <div className="group-hover:blur-sm transition w-full h-full group-hover:scale-110 duration-200">
                            <LazyLoadImage
                                src={movie?.thumbnailPath}
                                alt="ThumbMovie"
                                effect="blur"
                                width={'100%'}
                                height={'100%'}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <span
                            className="text-3xl pl-1 w-12 flex items-center justify-center h-12 text-white absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
                                            bg-gray-600 border-white group-hover:bg-red-600 rounded-full transition
                                       duration-150"
                        >
                            <i className="icon-play"></i>
                        </span>
                        <div
                            className="w-full absolute bottom-0 left-0 z-10 group-hover:opacity-0 transition 
                  bg-[#232323d3] h-14"
                        >
                            <h5 className="text-white text-lg font-medium z-10 absolute top-1/2 px-2 -translate-y-1/2 left-0 text-center w-full line-clamp-1">
                                {movie?.vietnameseName}
                            </h5>
                        </div>
                    </div>
                </Link>
            </SwiperSlide>
        ));

    return (
        <>
            {mediaHeading && (
                <h2 className="text-2xl font-semibold border-l-4 border-red-600 pl-2 mb-5 dark:text-white">
                    {mediaHeading}
                </h2>
            )}
            {isLoading && <Skeleton heightRow={250} />}
            {!isLoading && _.isArray(movies) && movies.length > 0 && (
                <Swiper
                    modules={[Navigation]}
                    slidesPerView="auto"
                    className="relative"
                    navigation={{
                        nextEl: '.next-button',
                        prevEl: '.prev-button',
                        disabledClass: 'invisible'
                    }}
                    spaceBetween={10}
                    breakpoints={{
                        0: {
                            slidesPerView: 2
                        },
                        768: {
                            slidesPerView: 4
                        },
                        1024: {
                            slidesPerView: 5
                        }
                    }}
                >
                    {items}
                    <button
                        className="prev-button text-xl text-gray-700 hover:text-white dark:bg-red-600 cursor-pointer dark:text-gray-100 bg-stone-300 hover:bg-red-600 dark:hover:bg-red-700 transition w-10 h-10 flex items-center justify-center rounded-full
                    absolute left-0 top-1/2 z-50 -translate-y-1/2
                    "
                    >
                        <i className="icon-chevron-left" />
                    </button>
                    <button
                        className="next-button text-xl bg-stone-300 dark:bg-red-600 dark:text-gray-100 rounded-full w-10 h-10 text-gray-700 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white 
                        dark:hover:text-gray-200 transition flex items-center justify-center
                    absolute right-0 top-1/2 z-20 -translate-y-1/2
                    "
                    >
                        <i className="icon-chevron-right" />
                    </button>
                </Swiper>
            )}
            {!isLoading && (!_.isArray(movies) || movies.length < 1) && (
                <NoDataFound firstClassImg="h-56" />
            )}
        </>
    );
};

export default MovieCarousel;
