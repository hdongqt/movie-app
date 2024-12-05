import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MovieCarousel, Skeleton, Tab, Tabs } from '@/Components/Common';
import DefaultLayout from '@/Components/DefaultLayout';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';

import MOVIE_TYPE from '@/Constants/Enums/MovieType.enum';
import MovieWatch from './MovieWatch';
import _ from 'lodash';
import { IMovie } from '@/Interfaces/Movie.interface';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MoviesAction } from '@/Redux/Features/Movies';
import { useCurrentViewportView } from '@/Hooks';
import { CommentsManagementAction } from '@/Redux/Features/Comments';
import { ICommentPaginationFilter } from '@/Interfaces/Comment.interface';
import Utils from '@/Utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthAction } from '@/Redux/Features/Auth';
import Confirm from '@/Components/Common/Dialogs/Confirms';
import { DEFAULT_CONFIRM_DIALOG, ROUTERS } from '@/Constants';
import { IConfirmDialog } from '@/Interfaces/ConfirmDialog.interface';
import ROLE from '@/Constants/Enums/Roles.enum';

const {
    fetchAllCommentOfMovie,
    createComment,
    resetCommentsState,
    terminatedComment
} = CommentsManagementAction;
const { setIsShowModalAuth } = AuthAction;
const { getMovie, setFiltersSave, addMovieToFavorites } = MoviesAction;

interface VideoPlayState {
    name: string;
    path: [string];
    // status: string;
}

const MediaDetail: React.FC = () => {
    const dispatch = useTypedDispatch();
    const { id } = useParams();
    const { isMobile } = useCurrentViewportView();
    const { state } = useLocation();
    const isGetLoading: boolean = useSelector((state: RootState) =>
        _.get(state.MOVIES, 'isGetLoading')
    );
    const mySelf: any = useSelector((state: RootState) =>
        _.get(state.AUTH, 'selfProfile')
    );
    const movieDetail = useSelector<RootState, IMovie | null>(
        (state) => state.MOVIES.movieDetail
    );
    const similarMovies: any = useSelector(
        (state: RootState) => state.MOVIES.similarMovies
    );

    const isFetchCommentLoading: boolean = useSelector((state: RootState) =>
        _.get(state.COMMENTS, 'isFetchLoading')
    );

    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.MOVIES, 'isActionLoading')
    );

    const paginationComment: ICommentPaginationFilter = useSelector(
        (state: RootState) => _.get(state.COMMENTS, 'pagination')
    );
    const metaComment: any = useSelector((state: RootState) =>
        _.get(state.COMMENTS, 'meta')
    );
    const comments: any = useSelector((state: RootState) =>
        _.get(state.COMMENTS, 'comments')
    );

    const isActionCommentLoading: boolean = useSelector((state: RootState) =>
        _.get(state.COMMENTS, 'isActionLoading')
    );

    const isWatch = useMatch({ path: '/film/:id/watch' });

    const history = useNavigate();

    const formComment = useFormik({
        initialValues: {
            comment: ''
        },
        validationSchema: Yup.object({
            comment: Yup.string()
                .trim()
                .required('Hãy nhập nội dung bình luận')
                .max(250, 'Nội dung bình luận không được vượt quá 250 kí tự')
        }),
        onSubmit: async (values, { resetForm }) => {
            setIsCommentClick(true);
            if (id) {
                const resultAction = await dispatch(
                    createComment({
                        movieId: id,
                        content: values.comment
                    })
                );
                if (resultAction.meta.requestStatus === 'fulfilled') {
                    resetForm();
                }
                setIsCommentClick(false);
            }
        }
    });

    const formReplyComment = useFormik<{
        parentId?: string;
        replyComment: string;
    }>({
        initialValues: {
            parentId: undefined,
            replyComment: ''
        },
        validationSchema: Yup.object({
            replyComment: Yup.string()
                .trim()
                .required('Hãy nhập nội dung bình luận')
                .max(250, 'Nội dung bình luận không được vượt quá 250 kí tự')
        }),
        onSubmit: async (values, { resetForm }) => {
            if (id) {
                const resultAction = await dispatch(
                    createComment({
                        parentId: values.parentId || undefined,
                        movieId: id,
                        content: values.replyComment
                    })
                );
                if (resultAction.meta.requestStatus === 'fulfilled') {
                    resetForm();
                }
            }
        }
    });

    const [videoPlay, setVideoPlay] = useState<VideoPlayState | null>(null);
    const [urlPlaying, setUrlPlaying] = useState<string>('');

    const [commentsMovie, setCommentMovie] = useState<any>([]);
    const [isCommentClick, setIsCommentClick] = useState<boolean>(false);
    const [confirmDeleteComment, setConfirmDeleteComment] =
        useState<IConfirmDialog>(DEFAULT_CONFIRM_DIALOG);

    const handlePlayMovie = (video: VideoPlayState) => {
        setVideoPlay(video);
        setUrlPlaying(video?.path?.[0]);
        !isWatch && history('/film/' + movieDetail?.id + '/watch');
    };

    const handleClickFavorite = (id?: string) => {
        if (!mySelf) dispatch(setIsShowModalAuth(true));
        else if (id) dispatch(addMovieToFavorites(id));
    };

    const onClickReply = (id: string) => {
        setCommentMovie(
            commentsMovie.map((comment: any) =>
                comment.id === id
                    ? { ...comment, isShowBoxReply: true }
                    : { ...comment, isShowBoxReply: false }
            )
        );
    };

    const cancelReply = () => {
        formReplyComment.resetForm();
        setCommentMovie(
            commentsMovie.map((comment: any) => ({
                ...comment,
                isShowBoxReply: false
            }))
        );
    };

    const handleDeleteComment = (id: string, parentId: string) => {
        dispatch(terminatedComment({ id, parentId }));
        setConfirmDeleteComment(DEFAULT_CONFIRM_DIALOG);
    };

    useEffect(() => {
        if (id) {
            dispatch(getMovie(id));
            dispatch(
                fetchAllCommentOfMovie({
                    ...paginationComment,
                    movieId: id,
                    isFetchNew: true
                })
            );
        }
        if (state) {
            dispatch(setFiltersSave(state.filters));
        }
        return () => {
            dispatch(resetCommentsState());
        };
    }, [id, state]);

    useEffect(() => {
        if (isWatch && movieDetail && !videoPlay) {
            const videoFirstUrl = _.get(movieDetail, 'episodes[0]');
            setVideoPlay(videoFirstUrl);
            setUrlPlaying(videoFirstUrl?.path?.[0] || '');
        }
        if (!isWatch && movieDetail) {
            setVideoPlay(null);
            setUrlPlaying('');
        }
    }, [movieDetail, isWatch]);

    useEffect(() => {
        const handleComments =
            comments?.length > 0
                ? comments.map((comment: any) => ({
                      ...comment,
                      isShowBoxReply: false
                  }))
                : [];
        setCommentMovie(handleComments);
    }, [comments]);

    const _renderComment = (comments: any, parentId?: string) => {
        return (
            <div
                className={`pt-5 flex flex-col gap-3 ${
                    parentId && 'border-l-2 pt-5 pl-6 dark:border-gray-700'
                }`}
            >
                {comments?.length > 0 &&
                    comments.map((comment: any) => (
                        <React.Fragment key={`comment${comment.id}`}>
                            <div className="flex gap-5 w-full" key={comment.id}>
                                <div className="font-bold text-2xl w-11 h-11 min-w-11 bg-red-500 rounded-full text-white flex items-center justify-center">
                                    <span className="uppercase">
                                        {comment?.user?.displayName &&
                                            Utils.getLastChar(
                                                comment.user.displayName
                                            )}
                                    </span>
                                </div>
                                <div className="w-full">
                                    <div className="flex items-end gap-2">
                                        <h4 className="text-sky-700 font-semibold cursor-default">
                                            {comment?.user?.displayName}
                                        </h4>
                                        {comment?.updatedAt && (
                                            <span className="group cursor-default text-gray-600 dark:text-gray-500 font-medium relative">
                                                {Utils.formatDateAgo(
                                                    comment.updatedAt
                                                )}
                                                <span className="invisible opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:visible absolute bg-slate-900 dark:bg-slate-700 text-white px-1 py-0.5 rounded-md block w-max -bottom-8 left-1/2 -translate-x-1/2">
                                                    {Utils.formatDateTime(
                                                        comment.updatedAt
                                                    )}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 break-words whitespace-pre-line break-all max-w-full dark:text-white/80 w-full">
                                        {comment?.content}
                                    </p>
                                    <div>
                                        <button
                                            className="text-blue-700 hover:underline font-medium"
                                            onClick={() => {
                                                if (mySelf)
                                                    onClickReply(
                                                        parentId || comment.id
                                                    );
                                                else
                                                    dispatch(
                                                        setIsShowModalAuth(true)
                                                    );
                                            }}
                                        >
                                            Trả lời
                                        </button>
                                        {((mySelf &&
                                            comment?.user?.id === mySelf?.id) ||
                                            mySelf?.role === ROLE.ADMIN) && (
                                            <button
                                                className="text-red-600 hover:underline ml-3 font-medium"
                                                onClick={() =>
                                                    setConfirmDeleteComment({
                                                        isOpen: true,
                                                        state: {
                                                            id: comment.id,
                                                            status:
                                                                parentId || ''
                                                        },
                                                        message:
                                                            'Bạn có chắc chắn muốn xóa bình luận này không?'
                                                    })
                                                }
                                            >
                                                Xoá
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {comment?.replies?.length > 0 && (
                                <div className="ml-5">
                                    {_renderComment(
                                        comment?.replies,
                                        comment.id
                                    )}
                                </div>
                            )}
                            {comment.isShowBoxReply && (
                                <div className="mt-2 ml-11">
                                    <div className="flex gap-5 w-full">
                                        <div className="font-bold text-2xl w-11 h-11 min-w-11 bg-red-500 rounded-full text-white flex items-center justify-center">
                                            <span className="uppercase">
                                                {mySelf?.displayName &&
                                                    Utils.getLastChar(
                                                        mySelf.displayName
                                                    )}
                                            </span>
                                        </div>
                                        <form
                                            onSubmit={
                                                formReplyComment.handleSubmit
                                            }
                                            className="w-full"
                                        >
                                            <h4 className="text-sky-700 font-semibold cursor-default">
                                                {mySelf?.displayName}
                                            </h4>
                                            <textarea
                                                name="replyComment"
                                                rows={4}
                                                value={
                                                    formReplyComment.values
                                                        .replyComment
                                                }
                                                onChange={
                                                    formReplyComment.handleChange
                                                }
                                                className="resize-none block mt-2 w-full border-2 py-3 px-4 rounded outline-none focus:border-2 dark:border-slate-600 dark:text-white/80 dark:bg-gray-700 focus:border-blue-500"
                                                placeholder="Viết bình luận của bạn..."
                                            />
                                            {formReplyComment.touched
                                                .replyComment &&
                                                formReplyComment.errors
                                                    .replyComment !==
                                                    undefined && (
                                                    <p className="mt-0.5 font-semibold text-red-600 pl-2">
                                                        {
                                                            formReplyComment
                                                                .errors
                                                                .replyComment
                                                        }
                                                    </p>
                                                )}
                                            <div className="flex ">
                                                <button
                                                    className="mt-2.5 mr-2 py-2 px-3 rounded bg-gray-500 text-white hover:bg-gray-600"
                                                    onClick={() =>
                                                        cancelReply()
                                                    }
                                                    disabled={
                                                        isActionCommentLoading
                                                    }
                                                >
                                                    Huỷ
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={
                                                        isActionCommentLoading
                                                    }
                                                    className={`flex gap-2 mt-2.5 py-2 px-3 rounded text-white
                                                     ${
                                                         isActionCommentLoading
                                                             ? 'bg-blue-300'
                                                             : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-700'
                                                     }
                                                    `}
                                                    onClick={() => {
                                                        formReplyComment.setValues(
                                                            {
                                                                ...formReplyComment.values,
                                                                parentId:
                                                                    comment.id
                                                            }
                                                        );
                                                        formReplyComment.handleSubmit();
                                                    }}
                                                >
                                                    {isActionCommentLoading && (
                                                        <svg
                                                            aria-hidden="true"
                                                            className="w-6 h-6 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-400"
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
                                                    )}
                                                    Trả lời
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
            </div>
        );
    };

    const __renderContent = () => {
        const [creators, actors] = _.partition(movieDetail?.persons, {
            role: 'creator'
        });
        return (
            <div className="w-full flex flex-col lg:flex-row mt-16 dark:bg-slate-900">
                <div className="w-full lg:w-3/4 px-6 pb-5">
                    {isGetLoading && (
                        <div className="relative -translate-y-2">
                            <Skeleton heightRow={isMobile ? 290 : 330} />
                            <div className="animate-pulse absolute px-3 md:px-0 left-2 h-48 bg-zinc-200 dark:bg-gray-700 md:left-16 -bottom-16 right-2 md:right-16 rounded shadow-2xl flex gap-8 border dark:border-slate-600"></div>
                        </div>
                    )}
                    {!isGetLoading && (
                        <>
                            {isWatch && videoPlay && (
                                <div className="h-52 md:h-72 lg:h-96 relative">
                                    <MovieWatch urlVideo={urlPlaying} />
                                </div>
                            )}
                            {!isWatch && (
                                <div className="relative rounded">
                                    <LazyLoadImage
                                        src={movieDetail?.posterPath}
                                        alt="Poster"
                                        effect="blur"
                                        width="100%"
                                        height="100%"
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src =
                                                'https://images.pexels.com/photos/255464/pexels-photo-255464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                                        }}
                                        className="w-full md:aspect-[16/9] object-cover h-72 md:h-80 overflow-hidden"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#000000ad] to-[#0000004d]"></div>
                                    <div className="flex gap-2.5 absolute right-2 md:left-7 top-14 md:top-4">
                                        {movieDetail?.countries &&
                                            movieDetail.countries.map(
                                                (
                                                    country: any,
                                                    index: number
                                                ) => {
                                                    return (
                                                        <span
                                                            key={`ctMedia${index}`}
                                                            className="cursor-pointer bg-gradient-to-r from-teal-600 to-cyan-700 text-white inline-block px-2.5 md:px-3.5 py-1 md:py-2 rounded-full font-medium"
                                                            onClick={() => {
                                                                dispatch(
                                                                    setFiltersSave(
                                                                        null
                                                                    )
                                                                );
                                                                Utils.redirect(
                                                                    ROUTERS.FILM,
                                                                    {
                                                                        country:
                                                                            {
                                                                                id: country.id,
                                                                                name: country.name
                                                                            }
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            {country?.name}
                                                        </span>
                                                    );
                                                }
                                            )}
                                    </div>
                                    <div className="absolute right-2 md:right-7 top-4 flex items-center gap-2.5">
                                        <span
                                            className="bg-sky-600 text-white inline-block px-2.5 md:px-3.5 py-1 md:py-2 rounded-full font-medium
                                    "
                                        >
                                            {movieDetail?.movieType ===
                                            MOVIE_TYPE.SINGLE
                                                ? 'Phim Lẻ'
                                                : 'Phim Bộ'}
                                        </span>
                                        <span
                                            className="bg-yellow-500 text-white inline-block px-2.5 md:px-3.5 py-1 md:py-2 rounded-full font-medium
                                    "
                                        >
                                            {movieDetail?.averageRating
                                                ? movieDetail.averageRating.toFixed(
                                                      1
                                                  )
                                                : 0}
                                            <i className="icon-star pl-2"></i>
                                        </span>
                                    </div>
                                    <div className="absolute px-3 md:px-0 left-2 md:left-16 -bottom-16 right-2 md:right-16 rounded bg-white dark:bg-slate-900/90 shadow-2xl flex items-center gap-8 border dark:border-slate-600">
                                        <LazyLoadImage
                                            src={movieDetail?.thumbnailPath}
                                            alt="loading"
                                            effect="blur"
                                            className="hidden md:block ml-4 self-center w-40 h-48 object-fill rounded-lg shadow-md border border-gray-300 dark:border-gray-400 shadow-gray-700"
                                        />
                                        <div className="text-white flex-1">
                                            <h3 className="name text-2xl md:text-3xl font-bold text-[#ff0000] line-clamp-1 pr-12 md:pr-0 mt-2.5">
                                                {movieDetail?.vietnameseName}
                                            </h3>
                                            <h4 className="name text-lg text-gray-700 dark:text-gray-100/80 capitalize font-bold line-clamp-1">
                                                {movieDetail?.originalName}
                                                {movieDetail?.release
                                                    ? ` (${movieDetail.release})`
                                                    : ''}
                                            </h4>
                                            <div className="flex gap-2 mt-2 md:mt-5 flex-wrap gap-y-2">
                                                {movieDetail?.genres &&
                                                    movieDetail?.genres.map(
                                                        (genre: any) => {
                                                            return (
                                                                <button
                                                                    onClick={() =>
                                                                        Utils.redirect(
                                                                            ROUTERS.FILM,
                                                                            {
                                                                                genreId:
                                                                                    genre.id,
                                                                                isReset:
                                                                                    true
                                                                            }
                                                                        )
                                                                    }
                                                                    key={`genreDetail${genre?.id}`}
                                                                    className="py-1 px-3 bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl hover:from-blue-700 hover:to-indigo-800 transition duration-200
                        min-w-20 block text-center max-w-40 text-nowrap line-clamp-1 text-base"
                                                                >
                                                                    {
                                                                        genre?.name
                                                                    }
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                            </div>
                                            <div className="flex justify-center md:justify-end gap-3 mt-4 md:mt-8 py-3 pr-3">
                                                <Link
                                                    to={'watch'}
                                                    className="outline-none flex px-3 py-6 items-center gap-3 rounded-full bg-red-600 hover:bg-red-700 transition h-10 relative"
                                                >
                                                    <span className="text-2xl">
                                                        <i className="icon-play"></i>
                                                    </span>
                                                    Xem phim
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleClickFavorite(id)
                                                    }
                                                    className={`outline-none flex px-3 py-6 items-center gap-3 rounded-full transition h-10 relative 
                                                    ${
                                                        isActionLoading
                                                            ? 'bg-gray-400'
                                                            : 'bg-sky-600 hover:bg-sky-700'
                                                    }`}
                                                    disabled={isActionLoading}
                                                >
                                                    {isActionLoading && (
                                                        <svg
                                                            aria-hidden="true"
                                                            className="inline w-6 h-6 text-gray-300 animate-spin dark:text-white fill-gray-600 dark:fill-gray-400"
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
                                                    )}
                                                    {!isActionLoading && (
                                                        <span className="text-2xl">
                                                            <i className="icon-heart"></i>
                                                        </span>
                                                    )}
                                                    Yêu thích
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {isWatch &&
                        (isGetLoading ? (
                            <Skeleton />
                        ) : (
                            <p className="pt-2 font-medium border-b border-gray-300 pb-1.5 dark:text-white dark:border-slate-600">
                                Xem phim:{' '}
                                <span className="font-medium text-red-600 text-lg">
                                    {movieDetail?.vietnameseName}
                                </span>
                            </p>
                        ))}
                    <div className={`${!isWatch ? 'mt-24 md:mt-32' : 'mt-5'}`}>
                        <Tabs>
                            <Tab title="Tập phim">
                                <div className="pt-4 px-4 pb-3">
                                    {isWatch && (
                                        <>
                                            <p className="uppercase font-semibold text-lg text-gray-900 dark:text-white/80 border-b border-slate-300">
                                                Server
                                            </p>
                                            {!isGetLoading && (
                                                <div className="flex gap-4 my-4 flex-wrap w-full max-h-40 overflow-y-auto">
                                                    {videoPlay?.path &&
                                                        videoPlay.path.map(
                                                            (
                                                                item: any,
                                                                index: number
                                                            ) => (
                                                                <button
                                                                    key={`episodeServer${index}`}
                                                                    className={`focus:outline-none text-white text-sm py-2 md:py-2.5 px-3 md:px-5 rounded-md
                ${
                    item === urlPlaying
                        ? 'opacity-90 bg-red-800 cursor-default'
                        : 'hover:opacity-60 bg-stone-800 transition hover:shadow-lg dark:hover:opacity-100 dark:hover:bg-stone-700'
                }
                `}
                                                                    onClick={() =>
                                                                        item !==
                                                                            urlPlaying &&
                                                                        setUrlPlaying(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    {`Server ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                </button>
                                                            )
                                                        )}
                                                </div>
                                            )}
                                            {isGetLoading && (
                                                <div className="py-2">
                                                    <Skeleton heightRow={100} />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <p className="uppercase font-semibold text-lg text-gray-900 border-b border-slate-300 dark:text-white/90 dark:border-slate-600">
                                        Danh sách tập
                                    </p>
                                    {isGetLoading && (
                                        <div className="py-2">
                                            <Skeleton heightRow={100} />
                                        </div>
                                    )}
                                    {!isGetLoading && (
                                        <div className="flex gap-4 my-4 flex-wrap w-full max-h-40 overflow-y-auto">
                                            {movieDetail?.episodes &&
                                                movieDetail?.episodes.map(
                                                    (
                                                        item: any,
                                                        index: number
                                                    ) => (
                                                        <button
                                                            key={`episodeMedia${index}`}
                                                            className={`focus:outline-none text-white text-sm py-2 md:py-2.5 px-3 md:px-5 rounded-md
                                                    ${
                                                        JSON.stringify(item) ===
                                                        JSON.stringify(
                                                            videoPlay
                                                        )
                                                            ? 'opacity-90 bg-red-800 cursor-default'
                                                            : 'hover:opacity-60 bg-stone-800 transition hover:shadow-lg dark:hover:opacity-100 dark:hover:bg-stone-700'
                                                    }
                                                    `}
                                                            onClick={() =>
                                                                JSON.stringify(
                                                                    item
                                                                ) !==
                                                                    JSON.stringify(
                                                                        videoPlay
                                                                    ) &&
                                                                handlePlayMovie(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            {item?.name}
                                                        </button>
                                                    )
                                                )}
                                        </div>
                                    )}
                                </div>
                            </Tab>
                            <Tab title="Giới thiệu">
                                <div
                                    className="py-4 px-4 text-stone-800
                                "
                                >
                                    <p className="uppercase font-semibold text-lg text-gray-900 border-b border-slate-300 dark:text-white/90 dark:border-slate-600">
                                        Tóm tắt
                                    </p>
                                    <p className="tracking-wide leading-7 pt-4 dark:text-white/90">
                                        {movieDetail?.overview}
                                    </p>
                                </div>
                            </Tab>
                            <Tab title="Diễn viên">
                                <div className="py-4 px-4 text-stone-800">
                                    <p className="uppercase font-semibold text-lg text-gray-900 border-b border-slate-300 dark:border-slate-600 dark:text-white/90">
                                        Đạo diễn
                                    </p>
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-4 max-h-44 overflow-y-auto">
                                        {creators && creators.length > 0 ? (
                                            creators.map((creator, index) => {
                                                return (
                                                    <Link
                                                        to={`/person/${creator?.id}`}
                                                        key={`creator${index}`}
                                                        className="inline-block"
                                                    >
                                                        <div className=" hover:bg-indigo-200 border dark:hover:bg-slate-500 border-gray-200 shadow-md transition duration-200 group px-2 py-1 md:py-2 rounded-md overflow-hidden dark:text-white/90">
                                                            <p className="text-lg font-bold py-1 text-gray-800 dark:text-white/90 line-clamp-1">
                                                                {creator?.name}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        ) : (
                                            <p className="text-gray-700 text-lg dark:text-white/90">
                                                Đang cập nhật...
                                            </p>
                                        )}
                                    </div>
                                    <p className="uppercase font-semibold text-lg text-gray-900 border-b border-slate-300 mt-6 dark:border-slate-600 dark:text-white/90">
                                        Diễn viên
                                    </p>
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 pr-2 md:grid-cols-3 gap-x-3 gap-y-4 max-h-44 overflow-y-auto">
                                        {actors && actors.length > 0 ? (
                                            actors.map((actor, index) => {
                                                return (
                                                    <Link
                                                        to={`/person/${actor?.id}`}
                                                        key={`creator${index}`}
                                                        className="inline-block"
                                                    >
                                                        <div className="hover:bg-indigo-200 dark:hover:bg-slate-500 border border-gray-200 shadow-md transition duration-200 group px-2 py-1 md:py-2 rounded-md overflow-hidden">
                                                            <p className="text-lg font-bold py-1 text-gray-800 dark:text-white/90 line-clamp-1">
                                                                {actor?.name}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        ) : (
                                            <p className="text-gray-700 text-lg dark:text-white/90">
                                                Đang cập nhật...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    <div className="block lg:hidden mt-5">
                        <MovieCarousel
                            movies={similarMovies || []}
                            mediaHeading="Có thể bạn muốn xem"
                            isLoading={isGetLoading}
                        />
                    </div>
                    <div className="mt-5">
                        <h2 className="font-medium text-2xl dark:text-white">
                            Bình luận
                        </h2>
                        {((!isFetchCommentLoading &&
                            commentsMovie?.length < 1) ||
                            commentsMovie?.length > 0) &&
                            mySelf && (
                                <form
                                    onSubmit={formComment.handleSubmit}
                                    className="mt-2"
                                >
                                    <div className="flex gap-5 w-full">
                                        <div className="font-bold text-2xl w-11 h-11 min-w-11 bg-red-500 rounded-full text-white flex items-center justify-center">
                                            <span className="uppercase">
                                                {mySelf?.displayName &&
                                                    Utils.getLastChar(
                                                        mySelf.displayName
                                                    )}
                                            </span>
                                        </div>
                                        <div className="w-full">
                                            <h4 className="text-sky-700 font-semibold cursor-default">
                                                {mySelf?.displayName}
                                            </h4>
                                            <textarea
                                                name="comment"
                                                rows={4}
                                                value={
                                                    formComment.values.comment
                                                }
                                                onChange={
                                                    formComment.handleChange
                                                }
                                                className="resize-none block mt-2 w-full border-2 py-3 px-4 rounded outline-none focus:border-2 dark:border-slate-600 dark:text-white/80 dark:bg-gray-700 focus:border-blue-500"
                                                placeholder="Viết bình luận của bạn..."
                                            />
                                            {formComment.touched.comment &&
                                                formComment.errors.comment !==
                                                    undefined && (
                                                    <p className="mt-0.5 font-semibold text-red-600 pl-2">
                                                        {
                                                            formComment.errors
                                                                .comment
                                                        }
                                                    </p>
                                                )}
                                            <button
                                                className={`flex gap-2 mt-2.5 py-2 px-3 rounded text-white ${
                                                    isActionCommentLoading &&
                                                    isCommentClick
                                                        ? 'bg-blue-300'
                                                        : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-700'
                                                }`}
                                                type="submit"
                                                disabled={
                                                    isActionCommentLoading &&
                                                    isCommentClick
                                                }
                                            >
                                                {isActionCommentLoading &&
                                                    isCommentClick && (
                                                        <svg
                                                            aria-hidden="true"
                                                            className="w-6 h-6 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-400"
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
                                                    )}
                                                Bình luận
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        {!isFetchCommentLoading && !mySelf && (
                            <div className="flex justify-center px-2 py-3 border rounded mt-3 dark:border-slate-600">
                                <p className="text-gray-800 dark:text-white/90">
                                    Vui lòng{' '}
                                    <button
                                        className="underline text-blue-700"
                                        onClick={() =>
                                            dispatch(setIsShowModalAuth(true))
                                        }
                                    >
                                        Đăng nhập
                                    </button>{' '}
                                    để bình luận
                                </p>
                            </div>
                        )}
                        {_renderComment(commentsMovie)}
                        {isFetchCommentLoading && <Skeleton heightRow={100} />}
                        {metaComment?.currentPage < metaComment?.totalPages && (
                            <div className="my-2 flex justify-center">
                                <button
                                    className="hover:bg-sky-600 border border-sky-600 transition text-sky-600 hover:text-white px-2 py-1.5 rounded-md"
                                    onClick={() =>
                                        id &&
                                        dispatch(
                                            fetchAllCommentOfMovie({
                                                ...paginationComment,
                                                page:
                                                    paginationComment.page + 1,
                                                movieId: id,
                                                isFetchNew: false
                                            })
                                        )
                                    }
                                >
                                    Xem thêm
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="hidden lg:block lg:w-1/4 border-l px-6 border-stone-300 dark:border-slate-600 mb-3">
                    <p className="mb-5 mt-3">
                        <span className="text-black dark:text-white relative text-xl font-bold">
                            Có thể bạn muốn xem
                            <span className="w-2/3 h-[3px] bg-red-600 absolute left-0 -bottom-1" />
                        </span>
                    </p>

                    <div className="flex flex-col gap-6">
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
                        {similarMovies &&
                            similarMovies.map((movie: IMovie) => {
                                return (
                                    <Link
                                        key={`similar${movie.id}`}
                                        className="flex gap-4 group hover:opacity-90 transition"
                                        to={`/film/${movie?.id}`}
                                    >
                                        <div className="h-48 w-2/5 overflow-hidden rounded-xl group-hover:scale-105 transition duration-300 relative">
                                            <LazyLoadImage
                                                src={movie?.thumbnailPath}
                                                alt="loading..."
                                                effect="blur"
                                                width="100%"
                                                height="100%"
                                                className="absolute w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="mt-1 flex-1">
                                            <h3 className="font-semibold text-lg line-clamp-1 dark:text-white/90">
                                                {movie?.vietnameseName}
                                            </h3>
                                            <h4 className="line-clamp-1 font-medium text-indigo-800">
                                                {movie?.originalName}
                                            </h4>
                                            <p className="mb-2 text-stale-600 font-medium dark:text-slate-300">
                                                {movie?.release || 'N/A'}
                                            </p>
                                            <span className="items-baseline text-white bg-yellow-500 px-1 py-[2px] rounded-md">
                                                <span className="text-base">
                                                    <i className="icon-star" />
                                                </span>
                                                <span className="font-medium pl-1">
                                                    {movie?.averageRating
                                                        ? movie.averageRating.toFixed(
                                                              1
                                                          )
                                                        : 0}
                                                </span>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                </div>
                {confirmDeleteComment.isOpen && (
                    <Confirm
                        title="Xoá bình luận ?"
                        confirm={confirmDeleteComment}
                        callback={() =>
                            handleDeleteComment(
                                confirmDeleteComment.state.id,
                                confirmDeleteComment.state.status
                            )
                        }
                        onCancel={() =>
                            setConfirmDeleteComment(DEFAULT_CONFIRM_DIALOG)
                        }
                    />
                )}
            </div>
        );
    };
    return <DefaultLayout portalFor="USER" children={__renderContent()} />;
};
export default MediaDetail;
