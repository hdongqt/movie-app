import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import DefaultLayout from '@/Components/DefaultLayout';
import Select from 'react-select';
import { useTypedDispatch } from '../../../Redux/Store';

import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { ROUTERS } from '@/Constants';
import { IMovie, IMovieSave } from '@/Interfaces/Movie.interface';
import { ImageInput, TagInput } from '@/Components/Common';
import { Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { YEAR_SELECT_LIST } from '@/Constants/Lists/Select.list';
import { MoviesManagementAction } from '@/Redux/Features/MoviesManagement';
import { ISelect } from '@/Interfaces/Select.interface';
import Utils from '@/Utils';
import { IGenre } from '@/Interfaces/Genre.interface';

const { getMovieMetaData, createMovie, updateMovie } = MoviesManagementAction;

interface IGetMovie extends Omit<IMovie, 'countries'> {
    countries: {
        id: string;
        name: string;
        status: string;
        createdAt: string;
    }[];
}

const optionsMovieType = [
    { value: 'single', label: 'Phim lẻ' },
    { value: 'tv', label: 'Phim bộ' }
];

const MovieSave: React.FC = () => {
    const dispatch = useTypedDispatch();
    const { pathname, state } = useLocation();
    const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const errorEpisodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const isGetLoading: boolean = useSelector((state: RootState) =>
        _.get(state.MOVIES_MANAGEMENT, 'isGetLoading')
    );

    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.MOVIES_MANAGEMENT, 'isActionLoading')
    );

    const genres: IGenre[] = useSelector((state: RootState) =>
        _.get(state.MOVIES_MANAGEMENT, 'genres')
    );
    const countries: IGenre[] = useSelector((state: RootState) =>
        _.get(state.MOVIES_MANAGEMENT, 'countries')
    );
    const movieDetail = useSelector<RootState, IGetMovie | null>((state) =>
        _.get(state.MOVIES_MANAGEMENT, 'movieDetail')
    );

    const [isHasChangeImage, setIsHasChangeImage] = useState<{
        poster: boolean;
        thumbnail: boolean;
    }>({ poster: false, thumbnail: false });

    const genreOptions: ISelect[] =
        genres?.length > 0
            ? genres.map((genre) => {
                  return { value: genre.id, label: genre.name };
              })
            : [];

    const countryOptions: ISelect[] =
        countries?.length > 0
            ? countries.map((country) => {
                  return { value: country.id, label: country.name };
              })
            : [];

    const formMovie = useFormik<IMovieSave>({
        initialValues: {
            movieType: 'single',
            originalName: '',
            vietnameseName: '',
            overview: '',
            release: new Date().getFullYear(),
            thumbnail: null,
            poster: null,
            countries: [],
            episodes: [{ name: '', path: '' }],
            genres: [],
            creators: [],
            actors: []
        },
        validationSchema: Yup.object({
            vietnameseName: Yup.string()
                .trim()
                .required('Tên phim không được để trống')
                .max(50, 'Tên phim không quá 150 ký tự'),
            originalName: Yup.string()
                .trim()
                .required('Tên quốc tế không được để trống'),
            movieType: Yup.string()
                .oneOf(['tv', 'single'])
                .required('Thể loại phim không hợp lệ'),
            genres: Yup.array().min(1, 'Chọn thể loại phim'),
            countries: Yup.array().min(1, 'Chọn quốc gia sản xuất'),
            overview: Yup.string()
                .trim()
                .required('Giới thiệu phim không được để trống'),
            episodes: Yup.array()
                .of(
                    Yup.object().shape({
                        name: Yup.string().required('Tên không được để trống'),
                        path: Yup.string().test(
                            'is-valid-url',
                            'Đường dẫn không hợp lệ',
                            (value) => {
                                if (!value) return false;
                                const urlPattern =
                                    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\:[0-9]{1,5})?(\/.*)?$/;
                                return urlPattern.test(value);
                            }
                        )
                    })
                )
                .min(1, 'Phải có ít nhất một tập phim')
        }),
        onSubmit: async (values) => {
            const { genres, countries, episodes, ...form } = values;
            const formData = new FormData();
            for (const key in form) {
                if (
                    values.hasOwnProperty(key) &&
                    !_.isArray(_.get(values, key))
                ) {
                    formData.append(key, _.get(values, key));
                }
            }
            formData.append('genres', JSON.stringify(genres));
            formData.append('countries', JSON.stringify(countries));
            const persons = [
                ...form.actors.map((actor) => ({ name: actor, role: 'actor' })),
                ...form.creators.map((creator) => ({
                    name: creator,
                    role: 'creator'
                }))
            ];
            persons.forEach((person) => {
                formData.append('persons[]', JSON.stringify(person));
            });
            episodes.forEach((episode) => {
                formData.append(
                    'episodes[]',
                    JSON.stringify({ ...episode, path: [episode.path] })
                );
            });
            if (!isHasChangeImage.thumbnail) formData.delete('thumbnail');
            if (!isHasChangeImage.poster) formData.delete('poster');
            if (state?.id) {
                formData.append(
                    'isChangePoster',
                    JSON.stringify(isHasChangeImage.poster)
                );
                formData.append(
                    'isChangeThumbnail',
                    JSON.stringify(isHasChangeImage.thumbnail)
                );
                dispatch(updateMovie({ id: state.id, form: formData }));
                setIsHasChangeImage({ poster: false, thumbnail: false });
            } else dispatch(createMovie(formData));
        }
    });
    const handleSubmitWithScroll = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        const errors = await formMovie.validateForm();
        //touche to show error

        if (Object.keys(errors).length > 0 || errors?.episodes) {
            formMovie.setTouched(
                Object.keys(formMovie.values).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {} as { [field: string]: boolean })
            );

            //check first error and scroll to it
            const firstErrorKey = Object.keys(errors)[0];
            if (firstErrorKey && errorRefs?.current?.[firstErrorKey]) {
                errorRefs.current[firstErrorKey]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } else if (errors?.episodes) {
                const indexError = +Object.keys(errors.episodes)[0];
                errorEpisodeRefs.current?.[indexError]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else formMovie.submitForm();
    };

    const onChangeThumbnailImage = (file: File | null) => {
        formMovie.setFieldValue('thumbnail', file);
        if (!isHasChangeImage.thumbnail)
            setIsHasChangeImage({ ...isHasChangeImage, thumbnail: true });
    };

    const onChangePosterImage = (file: File | null) => {
        formMovie.setFieldValue('poster', file);
        if (!isHasChangeImage.poster)
            setIsHasChangeImage({ ...isHasChangeImage, poster: true });
    };

    const onChangeInputActor = (listActors: string[]) => {
        formMovie.setFieldValue('actors', listActors);
    };

    const onChangeInputCreator = (listCreators: string[]) => {
        formMovie.setFieldValue('creators', listCreators);
    };

    useEffect(() => {
        if (state?.id || pathname.endsWith('create'))
            dispatch(
                getMovieMetaData({
                    isGetDetail: !!state?.id,
                    id: state?.id
                })
            );
        else Utils.redirect(ROUTERS.MOVIES_MANAGEMENT);
    }, [state]);

    useEffect(() => {
        const updateForm = async () => {
            if (movieDetail && state) {
                const [thumbnailHandle, posterHandle] = await Promise.all([
                    Utils.ConvertToFile(movieDetail.thumbnailPath),
                    Utils.ConvertToFile(movieDetail.posterPath)
                ]);
                const actorsGet: string[] = [];
                const creatorsGet: string[] = [];

                if (movieDetail?.persons) {
                    movieDetail.persons.forEach((person) => {
                        if (person.role === 'creator')
                            creatorsGet.push(person.name);
                        else actorsGet.push(person.name);
                    });
                }
                formMovie.setValues({
                    originalName: movieDetail.originalName || '',
                    vietnameseName: movieDetail.vietnameseName || '',
                    overview: movieDetail.overview || '',
                    movieType: movieDetail.movieType || 'single',
                    genres: movieDetail.genres?.map((genre) => genre.id) || [],
                    countries:
                        movieDetail.countries?.map((country) => country.id) ||
                        [],
                    creators: creatorsGet,
                    actors: actorsGet,
                    episodes:
                        movieDetail?.episodes.length > 0
                            ? movieDetail.episodes.map((episode) => ({
                                  name: episode.name,
                                  path: episode?.path?.[0] || ''
                              }))
                            : [{ name: '', path: '' }],
                    thumbnail: thumbnailHandle,
                    poster: posterHandle,
                    release: +movieDetail.release || new Date().getFullYear()
                });
            }
        };
        updateForm();
    }, [movieDetail]);
    const __renderContent = () => {
        return (
            <>
                <div className="flex gap-2 items-center border-b pb-2 border-gray-300 justify-between">
                    <h2 className="text-3xl font-medium text-slate-800">
                        {state?.id ? 'Cập nhật phim' : 'Tạo mới phim'}
                    </h2>
                    <Link
                        to={ROUTERS.MOVIES_MANAGEMENT}
                        className="flex gap-2 items-center border shadow px-2.5 py-1 font-medium rounded-full text-gray-700
                    hover:shadow-md hover:border-gray-300 hover:bg-gray-200 transition"
                    >
                        <span className="text-slate-800 text-sm">
                            <i className="icon-arrow-left"></i>
                        </span>
                        Quản lý phim
                    </Link>
                </div>
                <form
                    autoComplete="off"
                    onSubmit={handleSubmitWithScroll}
                    // onSubmit={(e) => {
                    //     e.preventDefault();
                    //     formMovie.handleSubmit();
                    // }}
                    className="relative"
                >
                    <div className="mt-6 relative">
                        <h2 className="text-2xl font-medium text-slate-800 border-b pb-2 border-gray-200">
                            Thông tin phim
                        </h2>
                        <div className="mt-4 md:mt-8 flex flex-col gap-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) =>
                                        (errorRefs.current.vietnameseName = el)
                                    }
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Tên Phim
                                    </label>
                                    <input
                                        type="text"
                                        name="vietnameseName"
                                        value={formMovie.values.vietnameseName}
                                        onChange={formMovie.handleChange}
                                        className="w-full rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                    />
                                    {formMovie.touched.vietnameseName &&
                                        formMovie.errors.vietnameseName !==
                                            undefined && (
                                            <span className="text-sm font-semibold text-red-600 pl-2">
                                                {
                                                    formMovie.errors
                                                        .vietnameseName
                                                }
                                            </span>
                                        )}
                                </div>
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) =>
                                        (errorRefs.current.originalName = el)
                                    }
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Tên quốc tế
                                    </label>
                                    <input
                                        type="text"
                                        name="originalName"
                                        value={formMovie.values.originalName}
                                        onChange={formMovie.handleChange}
                                        className="w-full rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                    />
                                    {formMovie.touched.originalName &&
                                        formMovie.errors.originalName !==
                                            undefined && (
                                            <span className="text-sm font-semibold text-red-600 pl-2">
                                                {formMovie.errors.originalName}
                                            </span>
                                        )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) =>
                                        (errorRefs.current.movieType = el)
                                    }
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Loại phim
                                    </label>
                                    <Select
                                        isSearchable={false}
                                        closeMenuOnScroll
                                        options={optionsMovieType}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        value={optionsMovieType.find(
                                            (type) =>
                                                type.value ===
                                                formMovie.values.movieType
                                        )}
                                        onChange={(newValue) =>
                                            formMovie.setFieldValue(
                                                'movieType',
                                                newValue?.value
                                            )
                                        }
                                        menuPosition="fixed"
                                        className="w-full [&>div]:py-1.5"
                                    />
                                    {formMovie.touched.movieType &&
                                        formMovie.errors.movieType !==
                                            undefined && (
                                            <span className="text-sm font-semibold text-red-600 pl-2">
                                                {formMovie.errors.movieType}
                                            </span>
                                        )}
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="mb-1.5 block text-black font-medium">
                                        Năm phát hành
                                    </label>
                                    <Select
                                        options={YEAR_SELECT_LIST}
                                        value={
                                            YEAR_SELECT_LIST.find(
                                                (item) =>
                                                    item.value ===
                                                    formMovie.values.release
                                            ) || YEAR_SELECT_LIST[0]
                                        }
                                        onChange={(newValue) =>
                                            formMovie.setFieldValue(
                                                'release',
                                                newValue?.value
                                            )
                                        }
                                        className="w-full [&>div]:py-1.5"
                                    />
                                    {formMovie.touched.release &&
                                        formMovie.errors.release !==
                                            undefined && (
                                            <span className="text-sm font-semibold text-red-600 pl-2">
                                                {formMovie.errors.release}
                                            </span>
                                        )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) =>
                                        (errorRefs.current.genres = el)
                                    }
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Thể loại
                                    </label>
                                    <Select
                                        closeMenuOnScroll
                                        isMulti
                                        options={genreOptions}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        value={formMovie.values.genres.map(
                                            (genreId) =>
                                                genreOptions.find(
                                                    (genre) =>
                                                        genre.value.toString() ===
                                                        genreId
                                                )
                                        )}
                                        onChange={(newValue) => {
                                            const newGenreAdd = newValue.map(
                                                (item) => item?.value
                                            );
                                            formMovie.setFieldValue(
                                                'genres',
                                                newGenreAdd
                                            );
                                            formMovie.setFieldTouched(
                                                'genres',
                                                true,
                                                false
                                            );
                                        }}
                                        menuPosition="fixed"
                                        className="w-full [&>div]:py-1.5"
                                        placeholder="Chọn thể loại"
                                    />
                                    {formMovie.touched.genres &&
                                        formMovie.errors.genres !==
                                            undefined && (
                                            <span className="text-sm font-semibold text-red-600 pl-2">
                                                {formMovie.errors.genres}
                                            </span>
                                        )}
                                </div>
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) =>
                                        (errorRefs.current.countries = el)
                                    }
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Quốc gia
                                    </label>
                                    <Select
                                        closeMenuOnScroll
                                        isMulti
                                        options={countryOptions}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        value={formMovie.values.countries.map(
                                            (countryId) =>
                                                countryOptions.find(
                                                    (country) =>
                                                        country.value.toString() ===
                                                        countryId
                                                )
                                        )}
                                        onChange={(newValue) => {
                                            const newCountryAdd = newValue.map(
                                                (item) => item?.value
                                            );
                                            formMovie.setFieldValue(
                                                'countries',
                                                newCountryAdd
                                            );
                                            formMovie.setFieldTouched(
                                                'countries',
                                                true,
                                                false
                                            );
                                        }}
                                        menuPosition="fixed"
                                        className="w-full [&>div]:py-1.5"
                                        placeholder="Chọn quốc gia"
                                    />
                                    {formMovie.touched.countries &&
                                        formMovie.touched.countries &&
                                        formMovie.errors.countries !==
                                            undefined && (
                                            <span className="text-sm font-semibold text-red-600 pl-2">
                                                {formMovie.errors.countries}
                                            </span>
                                        )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) =>
                                        (errorRefs.current.overview = el)
                                    }
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Đạo diễn
                                    </label>
                                    <TagInput
                                        tags={formMovie.values.creators}
                                        onChange={onChangeInputCreator}
                                    />
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="mb-1.5 block text-black font-medium">
                                        Diễn viên
                                    </label>
                                    <TagInput
                                        tags={formMovie.values.actors}
                                        onChange={onChangeInputActor}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-black font-medium">
                                        Giới thiệu
                                    </label>
                                    <textarea
                                        name="overview"
                                        rows={5}
                                        value={formMovie.values.overview}
                                        onChange={formMovie.handleChange}
                                        className="w-full resize-none rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                    />
                                    {formMovie.touched.overview &&
                                        formMovie.errors.overview !==
                                            undefined && (
                                            <span className="text-sm font-semibold text-red-600 pl-2">
                                                {formMovie.errors.overview}
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-medium text-slate-800 border-b pb-2 border-gray-200">
                            Ảnh
                        </h2>
                        <div className="mt-4 md:mt-8 flex flex-col gap-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-1">
                                    <label className="mb-1.5 block text-black font-medium">
                                        Ảnh Thumbnail
                                    </label>
                                    <div className="w-full h-56 rounded-md overflow-hidden border border-stone-300">
                                        <ImageInput
                                            inputFile={
                                                formMovie.values.thumbnail
                                            }
                                            onChangeImage={
                                                onChangeThumbnailImage
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="mb-1.5 block text-black font-medium">
                                        Ảnh Poster
                                    </label>
                                    <div className="w-full h-56 rounded-md overflow-hidden border border-stone-300">
                                        <ImageInput
                                            inputFile={formMovie.values.poster}
                                            onChangeImage={onChangePosterImage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-medium text-slate-800 border-b pb-2 border-gray-200">
                            Tập phim
                        </h2>
                        <div className="mt-4 md:mt-8 flex flex-col gap-y-3 max-h-96 overflow-y-auto">
                            {formMovie.values.episodes &&
                                formMovie.values.episodes.map(
                                    (episodeRow, indexRowEpisode) => (
                                        <div
                                            key={'esp' + indexRowEpisode}
                                            className="flex items-start gap-4"
                                            ref={(el) => {
                                                errorEpisodeRefs.current[
                                                    indexRowEpisode
                                                ] = el;
                                            }}
                                        >
                                            <div className="w-1/4">
                                                <label className="mb-1.5 block text-black font-medium">
                                                    Tên tập
                                                </label>
                                                <input
                                                    type="text"
                                                    value={episodeRow.name}
                                                    name={`episodes[${indexRowEpisode}].name`}
                                                    onChange={
                                                        formMovie.handleChange
                                                    }
                                                    className="w-full rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                                />
                                                {_.get(
                                                    formMovie,
                                                    `errors.episodes[${indexRowEpisode}].name`
                                                ) && (
                                                    <span className="text-sm font-semibold text-red-600 pl-2">
                                                        {_.get(
                                                            formMovie,
                                                            `errors.episodes[${indexRowEpisode}].name`
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w-2/4">
                                                <label className="mb-1.5 block text-black font-medium">
                                                    Đường dẫn
                                                </label>
                                                <input
                                                    type="text"
                                                    value={episodeRow.path}
                                                    name={`episodes[${indexRowEpisode}].path`}
                                                    onChange={
                                                        formMovie.handleChange
                                                    }
                                                    className="w-full rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                                />
                                                {_.get(
                                                    formMovie,
                                                    `errors.episodes[${indexRowEpisode}].path`
                                                ) && (
                                                    <span className="text-sm font-semibold text-red-600 pl-2">
                                                        {_.get(
                                                            formMovie,
                                                            `errors.episodes[${indexRowEpisode}].path`
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            {formMovie.values.episodes.length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        formMovie.setFieldValue(
                                                            'episodes',
                                                            [
                                                                ...formMovie.values.episodes.slice(
                                                                    0,
                                                                    indexRowEpisode
                                                                ),
                                                                ...formMovie.values.episodes.slice(
                                                                    indexRowEpisode +
                                                                        1
                                                                )
                                                            ],
                                                            false
                                                        )
                                                    }
                                                    className="outline-none translate-y-10 text-lg w-7 h-7 hover:bg-red-600 rounded-full transition border border-red-600 text-red-600 hover:text-white"
                                                >
                                                    <i className="icon-minus" />
                                                </button>
                                            )}

                                            {indexRowEpisode ===
                                                formMovie.values.episodes
                                                    .length -
                                                    1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        formMovie.setFieldValue(
                                                            'episodes',
                                                            [
                                                                ...formMovie
                                                                    .values
                                                                    .episodes,
                                                                {
                                                                    name: '',
                                                                    path: ''
                                                                }
                                                            ],
                                                            false
                                                        )
                                                    }
                                                    className="outline-none translate-y-10 text-lg w-7 h-7 hover:bg-sky-600 rounded-full transition border border-sky-600 text-sky-600 hover:text-white"
                                                >
                                                    <i className="icon-plus" />
                                                </button>
                                            )}
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <Link
                            to={ROUTERS.MOVIES_MANAGEMENT}
                            className="outline-none bg-gray-600 hover:bg-gray-700 min-w-20 inline-block text-white px-4 py-2 transition rounded"
                        >
                            Trở về
                        </Link>
                        <button
                            type="submit"
                            className="outline-none bg-green-600 hover:bg-green-700 min-w-20 inline-block text-white px-4 py-2 transition rounded"
                        >
                            Lưu
                        </button>
                    </div>
                    {(isGetLoading || isActionLoading) && (
                        <div className="fixed ml-72 pt-16 z-50 inset-0 flex items-start justify-center bg-[#ffffff4d]">
                            <span className="mt-52 inline-block border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
                        </div>
                    )}
                </form>
            </>
        );
    };
    return <DefaultLayout portalFor="ADMIN" children={__renderContent()} />;
};

export default MovieSave;
