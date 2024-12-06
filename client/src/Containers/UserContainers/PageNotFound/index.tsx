import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NotFound from '@/Assets/NotFound/NotFound.png';
import { ROUTERS } from '@/Constants';

const PageNotFound: React.FC = () => {
    return (
        <div className="w-full h-screen overflow-hidden flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-pink-700 shadow text-white">
                <div className="absolute bottom-4 md:bottom-64 left-8 md:left-12 w-24 h-24 rounded-full border-4 border-pink-500 bg-pink-600 shadow-pink-500" />
                <div className="absolute bottom-10 right-20 w-16 h-16 rounded-full border-4 border-sky-500 bg-sky-600 shadow-sky-500" />
                <div className="absolute top-5 right-7 w-28 h-28 rounded-full border-4 border-red-500 bg-red-600 shadow-red-500" />
                <div className="absolute top-32 left-7 w-14 h-14 rounded-full border-4 border-yellow-500 bg-yellow-600 shadow-yellow-500" />
                <div className="relative z-50 animate-bounce-down">
                    <h1 className="text-[9rem] md:text-[15rem] font-bold flex items-center cursor-default">
                        <span className="mx-8 rotate-6">4</span>
                        <span className="relative text-red-600 rotate-2">
                            0
                        </span>
                        <span className="mx-8 -rotate-6">4</span>
                    </h1>
                </div>
                <div className="mt-12">
                    <h2 className="text-xl md:text-3xl">
                        Ồ ! Hình như bạn đi lạc...
                    </h2>
                </div>
                <div className="mt-7">
                    <Link
                        className="outline-none px-7 py-2 text-lg border-2 border-[#be4d4d] bg-red-600
                     rounded-full hover:bg-red-500 transition-all duration-200"
                        to={ROUTERS.HOME}
                    >
                        Quay lại
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
