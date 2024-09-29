import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NotFound from '@/Assets/NotFound/NotFound.png';

const PageNotFound: React.FC = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="flex items-center flex-col">
                <img
                    src={NotFound}
                    alt="404 Not Found"
                    className="h-44 lg:h-96"
                />
                <h1 className="text-3xl md:text-5xl text-red-600 font-extrabold">
                    404 Not Found
                </h1>
                <p className="text-base text-gray-600 mt-1">
                    Sorry, we can't find that page.
                </p>
                <Link
                    to="/"
                    className="py-2 px-4 bg-sky-600 text-white rounded-md mt-2 hover:bg-sky-500 transition"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
};

export default PageNotFound;
