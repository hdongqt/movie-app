import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import logoFilm from '@/Assets/Logo/logoFilm.png';

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-slate-100 dark:bg-slate-800 pr-10 pl-5">
            <div className="flex justify-between pr-10 py-6">
                <Link to="/" className="h-10 lg:h-12 flex items-center gap-1">
                    <img src={logoFilm} alt="logoFilm" className="h-full" />
                    <span className="font-extrabold text-xl dark:text-white">
                        BRONZE<span className="text-red-600">FILM</span>
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <a target="_blank" href="https://github.com/hdongqt">
                        <span className="text-lg transition bg-gray-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
                            <i className="icon-github" />
                        </span>
                    </a>
                    <a target="_blank" href="https://fb.com/dong.do.2104">
                        <span className="text-lg transition bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full">
                            <i className="icon-facebook" />
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
