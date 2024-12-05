import React, { useEffect, useRef, useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

import './AuthModal.css';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import { AuthAction } from '@/Redux/Features/Auth';
import _ from 'lodash';

enum FormActionType {
    SIGN_IN = 'Sign In',
    SIGN_UP = 'Sign Up'
}
const { resetAuthErrorState, setIsShowModalAuth } = AuthAction;
const AuthModal: React.FC = () => {
    const dispatch = useTypedDispatch();

    const modalContentRef = useRef<HTMLDivElement>(null);
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

    const isActionLoading: boolean = useSelector((state: RootState) =>
        _.get(state.AUTH, 'isActionLoading')
    );
    const isError: boolean = useSelector((state: RootState) =>
        _.get(state.AUTH, 'isError')
    );
    const message: string = useSelector((state: RootState) =>
        _.get(state.AUTH, 'message')
    );
    const isShowModal: boolean = useSelector(
        (state: RootState) => state.AUTH.isShowModalAuth
    );

    const [formAction, setFormAction] = useState<FormActionType>(
        FormActionType.SIGN_IN
    );

    useEffect(() => {
        if (isError && message && modalContentRef?.current) {
            modalContentRef.current.scrollTo({
                top: modalContentRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
        return () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        };
    }, [isError]);

    const handleChangeAction = () => {
        dispatch(resetAuthErrorState());
        if (formAction === FormActionType.SIGN_IN)
            setFormAction(FormActionType.SIGN_UP);
        else setFormAction(FormActionType.SIGN_IN);
    };

    const handleCloseAuth = () => {
        if (modalContentRef && modalContentRef?.current) {
            modalContentRef.current.classList.remove('zoom-in');
            modalContentRef.current.classList.add('zoom-out');
        }
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
            dispatch(setIsShowModalAuth(false));
            dispatch(resetAuthErrorState());
            setFormAction(FormActionType.SIGN_IN);
        }, 285);
    };
    const changeToSignIn = () => {
        dispatch(resetAuthErrorState());
        setFormAction(FormActionType.SIGN_IN);
    };

    return (
        <>
            {isShowModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div
                        className="modal-overlay"
                        onClick={handleCloseAuth}
                    ></div>
                    <div
                        ref={modalContentRef}
                        className="auth-modal zoom-in relative px-8 md:px-20 py-8 rounded-xl w-[95%] md:w-[600px] max-h-[95%] bg-white dark:bg-slate-900 overflow-y-auto shadow-lg"
                    >
                        <button
                            className="absolute top-1 right-1 w-10 h-10 font-bold text-3xl rounded-full transition
             text-gray-700 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-500"
                            onClick={handleCloseAuth}
                        >
                            ×
                        </button>
                        {formAction === FormActionType.SIGN_IN ? (
                            <SignInForm handleCloseAuth={handleCloseAuth} />
                        ) : (
                            <SignUpForm changeToSignIn={changeToSignIn} />
                        )}
                        {isError && (
                            <div className="bg-red-50 dark:bg-gray-400 flex items-center px-2.5 py-1.5 border border-red-500 dark:border-red-700 rounded mt-2">
                                <span className="text-xl text-red-600 w-6 h-6 flex items-center justify-center text-center rounded-full">
                                    <i className="icon-info-sign"></i>
                                </span>
                                <span className="whitespace-pre-line font-semibold text-red-600 pl-2 py-1.5">
                                    {message}
                                </span>
                            </div>
                        )}
                        <p className="text-center mt-3 dark:text-white/80">
                            Bạn{' '}
                            {formAction === FormActionType.SIGN_IN
                                ? 'chưa'
                                : 'đã'}{' '}
                            có tài khoản?{' '}
                            <span
                                className={`font-bold transition-colors 
                                ${
                                    isActionLoading
                                        ? 'pointer-events-none text-gray-500 dark:text-gray-100'
                                        : 'text-orange-600 hover:text-orange-500 cursor-pointer'
                                }
                                `}
                                onClick={handleChangeAction}
                            >
                                Đăng{' '}
                                {formAction === FormActionType.SIGN_IN
                                    ? 'ký'
                                    : 'nhập'}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default AuthModal;
