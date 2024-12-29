import React, { useState, useEffect, ReactNode } from 'react';
import './CustomModal.css';
import { useLocation } from 'react-router-dom';

interface IActionButton {
    name: string;
    classFirst?: string;
    onClickAction: () => void;
}

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string | ReactNode;
    isLoading: boolean;
    children: React.ReactNode;
    actionButton?: IActionButton[];
}

const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    isLoading,
    title,
    children,
    actionButton
}) => {
    const [allowRender, setAllowRender] = useState(isOpen);
    const { pathname } = useLocation();
    const isUserRoute = !pathname.startsWith('/admin');
    useEffect(() => {
        if (isOpen) {
            setAllowRender(true);
        } else {
            const timer = setTimeout(() => {
                setAllowRender(false);
            }, 250);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!allowRender) {
        return null;
    }

    return (
        <div
            className={`fixed custom-modal px-2 md:px-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100] ${
                isOpen && 'custom-modal-open'
            }
            `}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!isLoading && e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className={`w-full sm:w-auto bg-white ${
                    isUserRoute && 'dark:bg-slate-900 '
                }rounded-lg shadow-lg custom-modal-content relative`}
            >
                <div className="border-b px-6 py-2 pr-1 flex justify-between items-center">
                    <h2
                        className={`text-lg font-semibold ${
                            isUserRoute && 'dark:text-white '
                        }cursor-default`}
                    >
                        {title}
                    </h2>
                    <button
                        className={`w-10 h-10 font-bold text-2xl rounded-full transition
             text-gray-700 ${
                 isUserRoute && 'dark:text-gray-300 dark:hover:bg-gray-600 '
             }hover:text-red-600 hover:bg-gray-100`}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className="p-4 px-6">{children}</div>
                <div className="p-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-red-600 min-w-20 inline-block text-white px-4 py-2 transition rounded hover:bg-red-700"
                    >
                        Đóng
                    </button>
                    {actionButton &&
                        actionButton.map(
                            (
                                {
                                    name,
                                    onClickAction,
                                    classFirst
                                }: IActionButton,
                                index: number
                            ) => (
                                <button
                                    key={`c_modal${name}${index}`}
                                    onClick={onClickAction}
                                    className={`
                                    ${classFirst} inline-block min-w-20 text-white px-4 py-2 transition rounded `}
                                >
                                    {name}
                                </button>
                            )
                        )}
                </div>
                {isLoading && (
                    <div className="bg-[#ffffff38] absolute inset-0 flex justify-center items-center">
                        <span className="inline-block border-gray-300 h-12 w-12 animate-spin rounded-full border-[5px] border-t-blue-600" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomModal;
