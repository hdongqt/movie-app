import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import DefaultLayout from '@/Components/DefaultLayout';
import { useTypedDispatch } from '../../../Redux/Store';

import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { ROUTERS } from '@/Constants';
import { Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GenresManagementAction } from '@/Redux/Features/GenresManagement';
import Utils from '@/Utils';
import { IGenreSave } from '@/Interfaces/Genre.interface';

const { createGenre, getGenreData, updateGenre } = GenresManagementAction;

const GenreSave: React.FC = () => {
    const dispatch = useTypedDispatch();
    const { state, pathname } = useLocation();
    const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const isGetLoading: boolean = useSelector((state: RootState) =>
        _.get(state.GENRES_MANAGEMENT, 'isGetLoading')
    );

    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.GENRES_MANAGEMENT, 'isActionLoading')
    );

    const genreDetail = useSelector<RootState, IGenreSave | null>((state) =>
        _.get(state.GENRES_MANAGEMENT, 'genreDetail')
    );

    const formGenre = useFormik<IGenreSave>({
        initialValues: {
            name: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .trim()
                .required('Tên thể loại không được để trống')
                .min(1, 'Tên thể loại có ít nhất 1 ký tự')
                .max(50, 'Tên thể loại không quá 50 ký tự')
        }),
        onSubmit: async (values) => {
            const { name } = values;

            if (state?.id) {
                dispatch(updateGenre({ id: state.id, name }));
            } else dispatch(createGenre({ name }));
        }
    });

    useEffect(() => {
        if (state?.id && pathname.endsWith('update'))
            dispatch(getGenreData(state.id));
        else if (!pathname.includes('create'))
            Utils.redirect(ROUTERS.GENRES_MANAGEMENT);
    }, [state]);

    useEffect(() => {
        const updateForm = async () => {
            if (genreDetail && state) {
                formGenre.setValues({
                    name: genreDetail.name || ''
                });
            }
        };
        updateForm();
    }, [genreDetail]);
    const __renderContent = () => {
        return (
            <>
                <div className="flex flex-col md:flex-row gap-2 items-center border-b pb-2 border-gray-300 justify-between">
                    <h2 className="text-3xl font-medium text-slate-800">
                        {state?.id ? 'Cập nhật thể loại' : 'Tạo mới thể loại'}
                    </h2>
                    <Link
                        to={ROUTERS.MOVIES_MANAGEMENT}
                        className="flex gap-2 items-center border shadow px-2.5 py-1 font-medium rounded-full text-gray-700
                    hover:shadow-md hover:border-gray-300 hover:bg-gray-200 transition"
                    >
                        <span className="text-slate-800 text-sm">
                            <i className="icon-arrow-left"></i>
                        </span>
                        Quản lý thể loại
                    </Link>
                </div>
                <form
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                        formGenre.handleSubmit();
                    }}
                    className="relative"
                >
                    <div className="mt-6 relative">
                        <div className="mt-4 md:mt-8 flex flex-col gap-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) =>
                                        (errorRefs.current.vietnameseName = el)
                                    }
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Tên thể loại
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formGenre.values.name}
                                        onChange={formGenre.handleChange}
                                        className="w-full rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                    />
                                    {formGenre.touched.name &&
                                        formGenre.errors.name !== undefined && (
                                            <span className="text-sm font-semibold text-red-600 pl-2">
                                                {formGenre.errors.name}
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <Link
                            to={ROUTERS.GENRES_MANAGEMENT}
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
                        <div className="fixed md:ml-72 mt-16 z-50 inset-0 flex items-start justify-center bg-[#ffffff4d]">
                            <span className="mt-52 inline-block border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
                        </div>
                    )}
                </form>
            </>
        );
    };
    return <DefaultLayout portalFor="ADMIN" children={__renderContent()} />;
};

export default GenreSave;
