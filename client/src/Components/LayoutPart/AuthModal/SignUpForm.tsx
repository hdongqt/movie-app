import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import logoFilm from '@/Assets/Logo/logoFilm.png';
import { Form, useFormik } from 'formik';
import * as Yup from 'yup';
import { useTypedDispatch, RootState } from '@/Redux/Store';
import { signUp } from '@/Redux/Features/Auth/AuthAction';
import { useSelector } from 'react-redux';

interface Props {
    changeToSignIn: () => void;
}

const SignUpForm: React.FC<Props> = ({ changeToSignIn }: Props) => {
    const dispatch = useTypedDispatch();
    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.AUTH, 'isActionLoading')
    );
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });

    const signUpForm = useFormik({
        initialValues: {
            email: '',
            displayName: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email không hợp lệ')
                .required('Email không được trống'),
            displayName: Yup.string()
                .trim()
                .min(5, 'Tên của bạn cần có ít nhất 5 kí tự')
                .required('Hãy nhập tên của bạn'),
            password: Yup.string()
                .trim()
                .min(8, 'Mật khẩu cần ít nhẩt 8 kí tự')
                .required('Mật khẩu không hợp lệ'),
            confirmPassword: Yup.string()
                .oneOf(
                    [Yup.ref('password')],
                    'Xác nhận mật khẩu không trùng khớp'
                )
                .min(8, 'Xác nhận mật khẩu cần ít nhất 8 kí tự')
                .required('Xác nhận mật khẩu không hợp lệ')
        }),
        onSubmit: async (values) => {
            const { confirmPassword, ...payload } = values;
            const resultAction = await dispatch(signUp(payload));
            if (resultAction?.meta?.requestStatus === 'fulfilled')
                changeToSignIn();
        }
    });

    return (
        <form onSubmit={signUpForm.handleSubmit} autoComplete="off">
            <img src={logoFilm} alt="logo" className="w-14 mx-auto" />
            <h1 className="text-center font-medium text-2xl mt-2">
                Chào mừng đến với{' '}
                <span className="font-extrabold">
                    BRONZE<span className="text-red-600">FILM</span>
                </span>
            </h1>
            <div className="mt-8 flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-black pl-2">Email</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Nhập email của bạn"
                        onChange={signUpForm.handleChange}
                        value={signUpForm.values.email}
                        className="border py-2.5 pl-6 pr-4 outline-none border-gray-400 rounded-full"
                    />
                    {signUpForm.touched.email &&
                        signUpForm.errors.email !== undefined && (
                            <span className="text-sm font-semibold text-red-600 pl-2">
                                {signUpForm.errors.email}
                            </span>
                        )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-black pl-2">
                        Tên của bạn
                    </label>
                    <input
                        type="text"
                        placeholder="Tên của bạn"
                        name="displayName"
                        value={signUpForm.values.displayName}
                        onChange={signUpForm.handleChange}
                        className="border py-2.5 pl-6 pr-4 outline-none border-gray-400 rounded-full"
                    />
                    {signUpForm.touched.displayName &&
                        signUpForm.errors.displayName !== undefined && (
                            <span className="text-sm font-semibold text-red-600 pl-2">
                                {signUpForm.errors.displayName}
                            </span>
                        )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium text-black pl-2">
                        Mật khẩu
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword?.password ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu"
                            name="password"
                            onChange={signUpForm.handleChange}
                            value={signUpForm.values.password}
                            className="w-full border py-2.5 pl-6 pr-4 outline-none border-gray-400 rounded-full"
                        />
                        <span
                            className="absolute top-1/2 right-[2px] -translate-y-1/2 w-11 h-11 flex items-center justify-center
                         bg-white hover:bg-gray-200 transition cursor-pointer rounded-full text-lg"
                            onClick={() =>
                                setShowPassword({
                                    ...showPassword,
                                    password: !showPassword.password
                                })
                            }
                        >
                            {showPassword?.password ? (
                                <i className="icon-eye-close" />
                            ) : (
                                <i className="icon-eye-open" />
                            )}
                        </span>
                    </div>
                    {signUpForm.touched.password &&
                        signUpForm.errors.password !== undefined && (
                            <span className="text-sm font-semibold text-red-600 pl-2">
                                {signUpForm.errors.password}
                            </span>
                        )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium text-black pl-2">
                        Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                        <input
                            type={
                                showPassword?.confirmPassword
                                    ? 'text'
                                    : 'password'
                            }
                            name="confirmPassword"
                            onChange={signUpForm.handleChange}
                            value={signUpForm.values.confirmPassword}
                            placeholder="Xác nhận mật khẩu"
                            className="border py-2.5 pl-6 pr-4 outline-none border-gray-400 rounded-full w-full"
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
                            {showPassword?.confirmPassword ? (
                                <i className="icon-eye-close" />
                            ) : (
                                <i className="icon-eye-open" />
                            )}
                        </span>
                    </div>
                    {signUpForm.touched.confirmPassword &&
                        signUpForm.errors.confirmPassword !== undefined && (
                            <span className="text-sm font-semibold text-red-600 pl-2">
                                {signUpForm.errors.confirmPassword}
                            </span>
                        )}
                </div>
                <button
                    type="submit"
                    className={`py-2.5 flex items-center justify-center outline-none transition rounded-full text-white font-semibold mt-3
                    ${
                        isActionLoading
                            ? 'bg-gray-400'
                            : 'bg-red-600 hover:bg-red-700'
                    }
                    `}
                >
                    {!isActionLoading && <span>Đăng ký</span>}
                    {isActionLoading && (
                        <svg
                            aria-hidden="true"
                            className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
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
                </button>
            </div>
        </form>
    );
};

export default SignUpForm;
