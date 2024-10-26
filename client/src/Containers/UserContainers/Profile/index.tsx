import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DefaultLayout from '@/Components/DefaultLayout';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { ProfileAction } from '@/Redux/Features/Profile';
import { useSelector } from 'react-redux';
import Utils from '@/Utils';
import { ISelfProfile } from '@/Interfaces/Auth.interface';
import { IUpdatePassword, IUpdateProfile } from '@/Interfaces/User.interface';

const { updateProfile, updatePassword } = ProfileAction;

interface IFormUpdatePassword extends IUpdatePassword {
    confirmPassword: string;
}

const Profile: React.FC = () => {
    const dispatch = useTypedDispatch();

    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.PROFILE, 'isActionLoading')
    );

    const selfProfile = useSelector<RootState, ISelfProfile | null>(
        (state: RootState) => state.AUTH.selfProfile
    );

    const [showForm, setShowForm] = useState(0);

    const [showPassword, setShowPassword] = useState({
        password: false,
        newPassword: false,
        confirmPassword: false
    });

    const updateInfoForm = useFormik<IUpdateProfile>({
        initialValues: {
            displayName: selfProfile?.displayName || 'N/A'
        },
        validationSchema: Yup.object({
            displayName: Yup.string()
                .trim()
                .min(5, 'Tên của bạn cần có ít nhất 5 kí tự')
                .required('Hãy nhập tên của bạn')
        }),
        onSubmit: async (values) => {
            const resultAction = await dispatch(updateProfile(values));
            if (resultAction?.meta?.requestStatus === 'fulfilled')
                setShowForm(0);
        }
    });

    const updatePasswordForm = useFormik<IFormUpdatePassword>({
        initialValues: {
            password: '',
            confirmPassword: '',
            newPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .trim()
                .min(8, 'Mật khẩu cần ít nhẩt 8 kí tự')
                .required('Mật khẩu không hợp lệ'),
            newPassword: Yup.string()
                .trim()
                .min(8, 'Mật khẩu mới cần ít nhẩt 8 kí tự')
                .required('Mật khẩu không hợp lệ'),
            confirmPassword: Yup.string()
                .oneOf(
                    [Yup.ref('newPassword')],
                    'Xác nhận mật khẩu không trùng khớp'
                )
                .min(8, 'Xác nhận mật khẩu cần ít nhất 8 kí tự')
                .required('Xác nhận mật khẩu không hợp lệ')
        }),
        onSubmit: async (values) => {
            const { password, newPassword } = values;
            const resultAction = await dispatch(
                updatePassword({ password, newPassword })
            );
            if (resultAction?.meta?.requestStatus === 'fulfilled')
                setShowForm(0);
        }
    });

    const __renderContent = () => {
        return (
            <div className="w-full mt-16 px-6 pb-5">
                <div className="px-4 w-full md:w-3/5 mx-auto">
                    <h2 className="text-2xl pt-5 font-semibold">
                        Cài đặt tài khoản
                    </h2>
                    <div className="border shadow-lg rounded-lg mt-10 relative min-h-96">
                        <span
                            className="cursor-default uppercase font-bold text-5xl flex items-center justify-center w-28 h-28 bg-red-500 
                        rounded-full text-white absolute top-0 -translate-x-1/2 -translate-y-1/2 left-1/2"
                        >
                            {selfProfile
                                ? Utils.getLastChar(selfProfile.displayName)
                                : 'N/A'}
                        </span>
                        <div className="mt-20 flex flex-col items-center">
                            <h5 className="text-2xl font-medium">
                                {selfProfile?.displayName}
                            </h5>
                            <p className="text-center text-zinc-700 font-medium">
                                Người dùng
                            </p>
                            <p className="text-center text-lg text-zinc-800 font-medium mt-10">
                                {selfProfile?.email}
                            </p>
                            <div className="grid grid-cols-1 md:gap-2 md:grid-cols-2">
                                <button
                                    onClick={() => setShowForm(1)}
                                    disabled={isActionLoading}
                                    className="w-full font-semibold mt-8 mr-2 border-2 text-white bg-gradient-to-r from-red-600 to-pink-700 py-2.5 px-4 rounded-full hover:opacity-90 transition"
                                >
                                    Thay đổi thông tin
                                </button>
                                <button
                                    onClick={() => setShowForm(2)}
                                    disabled={isActionLoading}
                                    className="w-full font-semibold mt-8 border-2 text-white bg-gradient-to-r from-blue-700 to-pink-800 py-2.5 px-4 rounded-full hover:opacity-90 transition"
                                >
                                    Thay đổi mật khẩu
                                </button>
                            </div>
                            {showForm === 1 && (
                                <form
                                    className="mt-8"
                                    onSubmit={updateInfoForm.handleSubmit}
                                    autoComplete="off"
                                >
                                    <div className="flex items-center gap-7">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-black pl-2">
                                                Tên của bạn
                                            </label>
                                            <input
                                                type="text"
                                                name="displayName"
                                                disabled={isActionLoading}
                                                placeholder="Nhập tên của bạn"
                                                className="border py-2.5 pl-6 pr-4 min-w-72 outline-none border-gray-400 rounded-full"
                                                onChange={
                                                    updateInfoForm.handleChange
                                                }
                                                value={
                                                    updateInfoForm.values
                                                        .displayName
                                                }
                                            />
                                            {updateInfoForm.touched
                                                .displayName &&
                                                updateInfoForm.errors
                                                    .displayName !==
                                                    undefined && (
                                                    <span className="text-sm font-semibold text-red-600 pl-2">
                                                        {
                                                            updateInfoForm
                                                                .errors
                                                                .displayName
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mb-6">
                                        <button
                                            onClick={() => setShowForm(0)}
                                            type="button"
                                            disabled={isActionLoading}
                                            className={`font-semibold mt-6 w-28 gap-2 mr-2 py-2.5 border flex items-center justify-center rounded-full hover:opacity-90 transition
                                            ${
                                                isActionLoading
                                                    ? 'bg-gray-400 text-white'
                                                    : 'hover:bg-red-500 text-red-600 hover:text-white border-red-500'
                                            }
                                            `}
                                        >
                                            Huỷ bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isActionLoading}
                                            className={`font-semibold mt-6 w-28 py-2.5 border-2 text-white
                                             flex items-center justify-center gap-2 rounded-full hover:opacity-90 transition
                                             ${
                                                 isActionLoading
                                                     ? 'bg-gray-400'
                                                     : 'bg-red-600 hover:bg-red-700'
                                             }
                                             `}
                                        >
                                            {isActionLoading && (
                                                <span className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"></span>
                                            )}
                                            Lưu
                                        </button>
                                    </div>
                                </form>
                            )}
                            {showForm === 2 && (
                                <form
                                    onSubmit={updatePasswordForm.handleSubmit}
                                    autoComplete="off"
                                    className="mt-8 flex flex-col gap-2.5"
                                >
                                    <div className="flex items-center gap-7">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-black pl-2">
                                                Mật khẩu hiện tại
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        showPassword?.password
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="password"
                                                    onChange={
                                                        updatePasswordForm.handleChange
                                                    }
                                                    value={
                                                        updatePasswordForm
                                                            .values.password
                                                    }
                                                    placeholder="Nhập mật khẩu hiện tại"
                                                    className="border py-2.5 pl-6 pr-4 min-w-72 outline-none border-gray-400 rounded-full w-full"
                                                />
                                                <span
                                                    className="absolute top-1/2 right-[2px] -translate-y-1/2 w-11 h-11 flex items-center 
                        justify-center bg-white hover:bg-gray-200 transition cursor-pointer rounded-full text-lg"
                                                    onClick={() =>
                                                        setShowPassword({
                                                            ...showPassword,
                                                            password:
                                                                !showPassword.password
                                                        })
                                                    }
                                                >
                                                    {showPassword.password ? (
                                                        <i className="icon-eye-close" />
                                                    ) : (
                                                        <i className="icon-eye-open" />
                                                    )}
                                                </span>
                                            </div>
                                            {updatePasswordForm.touched
                                                .password &&
                                                updatePasswordForm.errors
                                                    .password !== undefined && (
                                                    <span className="text-sm font-semibold text-red-600 pl-2">
                                                        {
                                                            updatePasswordForm
                                                                .errors.password
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-7">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-black pl-2">
                                                Mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        showPassword.newPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="newPassword"
                                                    onChange={
                                                        updatePasswordForm.handleChange
                                                    }
                                                    value={
                                                        updatePasswordForm
                                                            .values.newPassword
                                                    }
                                                    placeholder="Nhập mật khẩu mới"
                                                    className="border py-2.5 pl-6 pr-4 min-w-72 outline-none border-gray-400 rounded-full w-full"
                                                />
                                                <span
                                                    className="absolute top-1/2 right-[2px] -translate-y-1/2 w-11 h-11 flex items-center 
                        justify-center bg-white hover:bg-gray-200 transition cursor-pointer rounded-full text-lg"
                                                    onClick={() =>
                                                        setShowPassword({
                                                            ...showPassword,
                                                            newPassword:
                                                                !showPassword.newPassword
                                                        })
                                                    }
                                                >
                                                    {showPassword.newPassword ? (
                                                        <i className="icon-eye-close" />
                                                    ) : (
                                                        <i className="icon-eye-open" />
                                                    )}
                                                </span>
                                            </div>
                                            {updatePasswordForm.touched
                                                .newPassword &&
                                                updatePasswordForm.errors
                                                    .newPassword !==
                                                    undefined && (
                                                    <span className="text-sm font-semibold text-red-600 pl-2">
                                                        {
                                                            updatePasswordForm
                                                                .errors
                                                                .newPassword
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-7">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-black pl-2">
                                                Xác nhận mật khẩu
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        showPassword.confirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    name="confirmPassword"
                                                    onChange={
                                                        updatePasswordForm.handleChange
                                                    }
                                                    value={
                                                        updatePasswordForm
                                                            .values
                                                            .confirmPassword
                                                    }
                                                    placeholder="Nhập lại mật khẩu mới"
                                                    className="border py-2.5 pl-6 pr-4 min-w-72 outline-none border-gray-400 rounded-full w-full"
                                                />
                                                <span
                                                    className="absolute top-1/2 right-[2px] -translate-y-1/2 w-11 h-11 flex items-center 
                        justify-center bg-white hover:bg-gray-200 transition cursor-pointer rounded-full text-lg"
                                                    onClick={() =>
                                                        setShowPassword({
                                                            ...showPassword,
                                                            confirmPassword:
                                                                !showPassword.confirmPassword
                                                        })
                                                    }
                                                >
                                                    {showPassword.confirmPassword ? (
                                                        <i className="icon-eye-close" />
                                                    ) : (
                                                        <i className="icon-eye-open" />
                                                    )}
                                                </span>
                                            </div>
                                            {updatePasswordForm.touched
                                                .confirmPassword &&
                                                updatePasswordForm.errors
                                                    .confirmPassword !==
                                                    undefined && (
                                                    <span className="text-sm font-semibold text-red-600 pl-2">
                                                        {
                                                            updatePasswordForm
                                                                .errors
                                                                .confirmPassword
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center mb-6">
                                        <button
                                            onClick={() => setShowForm(0)}
                                            type="button"
                                            disabled={isActionLoading}
                                            className={`font-semibold mt-6 w-28 gap-2 mr-2 py-2.5 border flex items-center justify-center rounded-full hover:opacity-90 transition
                                            ${
                                                isActionLoading
                                                    ? 'bg-gray-400 text-white'
                                                    : 'hover:bg-red-500 text-red-600 hover:text-white border-red-500'
                                            }
                                            `}
                                        >
                                            Huỷ bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isActionLoading}
                                            className={`font-semibold mt-6 w-28 py-2.5 border-2 text-white
                                             flex items-center justify-center gap-2 rounded-full hover:opacity-90 transition
                                             ${
                                                 isActionLoading
                                                     ? 'bg-gray-400'
                                                     : 'bg-red-600 hover:bg-red-700'
                                             }
                                             `}
                                        >
                                            {isActionLoading && (
                                                <span className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"></span>
                                            )}
                                            Lưu
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return <DefaultLayout portalFor="USER" children={__renderContent()} />;
};

export default Profile;
