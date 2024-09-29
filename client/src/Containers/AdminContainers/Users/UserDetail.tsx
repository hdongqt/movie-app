import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import DefaultLayout from '@/Components/DefaultLayout';
import { useTypedDispatch } from '../../../Redux/Store';

import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { ENUMS, ROUTERS } from '@/Constants';
import { Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UsersManagementAction } from '@/Redux/Features/UsersManagement';
import Utils from '@/Utils';
import ROLE from '@/Constants/Enums/Roles.enum';
import dayjs from 'dayjs';

const { getUserDetail } = UsersManagementAction;
interface IUser {
    displayName: string;
    role: ROLE;
    email: string;
    createdAt: string;
}

const UserDetail: React.FC = () => {
    const dispatch = useTypedDispatch();
    const { state } = useLocation();

    const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const isGetLoading: boolean = useSelector((state: RootState) =>
        _.get(state.USERS_MANAGEMENT, 'isGetLoading')
    );

    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.USERS_MANAGEMENT, 'isActionLoading')
    );

    const userDetail = useSelector<RootState, IUser | null>((state) =>
        _.get(state.USERS_MANAGEMENT, 'userDetail')
    );

    const formMovie = useFormik<IUser>({
        initialValues: {
            email: '',
            displayName: '',
            createdAt: '',
            role: ENUMS.ROLES.USER
        },
        validationSchema: Yup.object({
            role: Yup.string()
                .trim()
                .required('Tên phim không được để trống')
                .oneOf([ENUMS.ROLES.ADMIN, ENUMS.ROLES.USER])
        }),
        onSubmit: async (values) => {}
    });

    useEffect(() => {
        if (state?.id) dispatch(getUserDetail(state.id));
        else Utils.redirect(ROUTERS.USERS_MANAGEMENT);
    }, [state]);

    useEffect(() => {
        const updateForm = async () => {
            if (userDetail) {
                formMovie.setValues({
                    email: userDetail.email,
                    displayName: userDetail.displayName,
                    createdAt: Utils.formatDateTime(userDetail.createdAt),
                    role: userDetail.role
                });
            }
        };
        updateForm();
    }, [userDetail]);
    const __renderContent = () => {
        return (
            <>
                <div className="flex gap-2 items-center border-b pb-2 border-gray-300 justify-between">
                    <h2 className="text-3xl font-medium text-slate-800">
                        Chi tiết người dùng
                    </h2>
                    <Link
                        to={ROUTERS.USERS_MANAGEMENT}
                        className="flex gap-2 items-center border shadow px-2.5 py-1 font-medium rounded-full text-gray-700
                    hover:shadow-md hover:border-gray-300 hover:bg-gray-200 transition"
                    >
                        <span className="text-slate-800 text-sm">
                            <i className="icon-arrow-left"></i>
                        </span>
                        Quản lý người dùng
                    </Link>
                </div>
                <form autoComplete="off" className="relative">
                    <div className="mt-6 relative">
                        <h2 className="text-2xl font-medium text-slate-800 border-b pb-2 border-gray-200">
                            Tài khoản
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
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        name="vietnameseName"
                                        disabled
                                        value={formMovie.values.email}
                                        className="w-full opacity-85 rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-medium text-slate-800 border-b pb-2 border-gray-200">
                            Thông tin
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
                                        Tên
                                    </label>
                                    <input
                                        type="text"
                                        name="vietnameseName"
                                        disabled
                                        value={formMovie.values.displayName}
                                        className="w-full opacity-85 rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                    />
                                </div>
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) => (errorRefs.current.role = el)}
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Quyền
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        disabled
                                        value={formMovie.values.role}
                                        className="uppercase w-full opacity-85 rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                <div
                                    className="sm:col-span-1"
                                    ref={(el) =>
                                        (errorRefs.current.originalName = el)
                                    }
                                >
                                    <label className="mb-1.5 block text-black font-medium">
                                        Ngày đăng ký
                                    </label>
                                    <input
                                        type="text"
                                        name="originalName"
                                        value={formMovie.values.createdAt}
                                        disabled
                                        className="w-full opacity-85 rounded-lg border-[1.5px] border-stone-300 bg-transparent p-3 text-gray-800 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <Link
                            to={ROUTERS.USERS_MANAGEMENT}
                            className="outline-none bg-gray-600 hover:bg-gray-700 min-w-20 inline-block text-white px-4 py-2 transition rounded"
                        >
                            Trở về
                        </Link>
                    </div>
                    {(isGetLoading || isActionLoading) && (
                        <div className="fixed ml-72 mt-16 z-50 inset-0 flex items-start justify-center bg-[#ffffff4d]">
                            <span className="mt-52 inline-block border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
                        </div>
                    )}
                </form>
            </>
        );
    };
    return <DefaultLayout portalFor="ADMIN" children={__renderContent()} />;
};

export default UserDetail;
