import { Link } from 'react-router-dom';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import { RootState, useTypedDispatch } from '@/Redux/Store';
import { SlideMakerActions } from '@/Redux/Features/SlideMakerSlice';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import dayjs from 'dayjs';

import './SlideMaker.css';
import { IMovie } from '@/Interfaces/Movie.interface';
import { Skeleton } from '@/Components/Common';
import { ROUTERS } from '@/Constants';

const { fetchAllSlides } = SlideMakerActions;
interface CustomCSSProperties extends CSSProperties {
    '--bg-url'?: string;
}
const SlideMaker: React.FC = () => {
    const dispatch = useTypedDispatch();
    const dataSlides = useSelector(
        (state: RootState) => state.SLIDE_MAKER.dataMedias
    );
    const isFetchLoading: boolean = useSelector((state: RootState) =>
        _.get(state.SLIDE_MAKER, 'isFetchLoading')
    );
    const [mediaSlides, setMediaSlides] = useState<IMovie[]>([]);

    useEffect(() => {
        !dataSlides?.length && dispatch(fetchAllSlides());
    }, []);

    useEffect(() => {
        const dataGet =
            _.isArray(dataSlides) && dataSlides.length > 0
                ? _.slice(dataSlides, 0, 6)
                : [];
        if (dataGet.length > 0) setMediaSlides(dataGet);
    }, [dataSlides]);

    const handleClickBtn = (
        event: React.MouseEvent<HTMLButtonElement>,
        type: string
    ) => {
        event.preventDefault();
        let items = document.querySelectorAll('.item');
        if (type === 'next') {
            items?.length > 0 &&
                document.querySelector('.slide')?.appendChild(items[0]);
        } else {
            items?.length > 0 &&
                document
                    .querySelector('.slide')
                    ?.prepend(items[items.length - 1]);
        }
    };
    return (
        <>
            {isFetchLoading && <Skeleton heightRow={385} />}
            {!isFetchLoading && (
                <div className="w-full rounded-lg overflow-hidden h-[300px] lg:h-[400px] pt-1">
                    <div className="container-slide">
                        <div className="slide">
                            {mediaSlides &&
                                mediaSlides.map((item, index) => {
                                    const percentRating = item?.averageRating
                                        ? (
                                              (item?.averageRating / 10) *
                                              100
                                          ).toFixed()
                                        : 0;
                                    return (
                                        <div
                                            className="item"
                                            key={`mediaSlide${index}`}
                                            style={
                                                {
                                                    '--bg-poster': `url(${item.posterPath})`,
                                                    backgroundImage: `url(
                                            ${item.thumbnailPath})`
                                                } as CustomCSSProperties
                                            }
                                        >
                                            <div className="absolute w-full h-full top-0 left-0 backdrop-img"></div>
                                            <span
                                                className="inline-block md:hidden rating-mobile absolute rounded-lg rounded-r-none rounded-t-none right-0 top-0 
                                    text-lg text-white font-medium bg-yellow-500 w-16 text-center py-[2px]"
                                            >
                                                {item?.averageRating
                                                    ? item.averageRating.toFixed(
                                                          1
                                                      )
                                                    : 0}
                                                <i className="icon-star pl-2"></i>
                                            </span>
                                            <div className="content absolute top-1/4">
                                                <h3
                                                    className="name text-xl lg:text-4xl
                                            font-bold text-red-600 line-clamp-1 mt-2
                                        "
                                                >
                                                    {item?.vietnameseName}
                                                </h3>
                                                <h4
                                                    className="name text-lg lg:text-2xl capitalize
                                            font-bold line-clamp-2 text-zinc-200
                                        "
                                                >
                                                    {`${
                                                        item?.originalName
                                                    } (${dayjs(
                                                        item.createdAt
                                                    ).year()})`}
                                                </h4>
                                                <div className="des line-clamp-3 text-sm lg:text-base">
                                                    {item?.overview.substring(
                                                        0,
                                                        150
                                                    )}
                                                    ...
                                                </div>
                                                <div className="hidden md:block w-60 h-3 bg-gray-300 dark:bg-gray-400 rounded-lg relative rating mt-8">
                                                    <span className="z-10 text-yellow-400 absolute top-0 -translate-y-3 -left-2.5 text-3xl rotate-90">
                                                        <i className="icon-star"></i>
                                                    </span>
                                                    <span
                                                        style={{
                                                            width: `${percentRating}%`
                                                        }}
                                                        className="block h-3 absolute rounded-lg left-0 top-0 bottom-0 right-0 bg-red-600"
                                                    >
                                                        <span className="absolute bottom-full -right-4 z-1 mb-2 inline-block rounded-lg bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                                            <span className="absolute -bottom-1 left-1/2 -z-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-red-600"></span>
                                                            {item?.averageRating
                                                                ? item.averageRating.toFixed(
                                                                      1
                                                                  )
                                                                : 0}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="mt-4 lg:mt-10 btnGroup">
                                                    <Link
                                                        to={`${ROUTERS.FILM}/${item?.id}`}
                                                        className="inline-flex group gap-3 bg-red-600 border-2 border-transparent hover:border-white dark:hover:border-gray-200 transition duration-300 justify-center items-center px-3.5 md:px-4 py-2 rounded-full"
                                                    >
                                                        <span className="">
                                                            <i className="icon-play"></i>
                                                        </span>
                                                        <span className="text-lg">
                                                            Xem phim
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="flex justify-center absolute bottom-5 left-0 w-full gap-3">
                            <button
                                className="prev bg-stone-300 dark:bg-red-600 dark:text-gray-100 rounded-full w-10 h-10 text-xl text-gray-700 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white dark:hover:text-gray-200 transition"
                                onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>
                                ) => handleClickBtn(e, 'prev')}
                            >
                                <i className="icon-chevron-left"></i>
                            </button>
                            <button
                                className="next bg-stone-300 dark:bg-red-600 dark:text-gray-100 rounded-full w-10 h-10 text-xl text-gray-700 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white dark:hover:text-gray-200 transition"
                                onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>
                                ) => handleClickBtn(e, 'next')}
                            >
                                <i className="icon-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SlideMaker;
