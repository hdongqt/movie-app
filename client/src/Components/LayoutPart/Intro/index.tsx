import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import heroImage from '@/Assets/Hero/hero.jpg';
import logoFilm from '@/Assets/Logo/logoFilm.png';
import Utils from '@/Utils';

const Intro: React.FC = () => {
    const location = useLocation();
    const [isAllowShowLoad, setIsAllowShowLoad] = useState(true);
    const isAdminRoute = location.pathname.includes('admin');

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (!isAdminRoute && Utils.getSavedGenres()?.length < 1) {
            if (isAllowShowLoad) {
                document.body.classList.add('overflow-hidden', 'pr-2');
                timeoutId = setTimeout(() => {
                    setIsAllowShowLoad(false);
                }, 2000);
            } else {
                document.body.classList.remove('overflow-hidden', 'pr-2');
            }
        } else {
            setIsAllowShowLoad(false);
        }

        return () => {
            clearTimeout(timeoutId);
            document.body.classList.remove('overflow-hidden', 'pr-2');
        };
    }, [isAdminRoute, isAllowShowLoad]);

    return (
        <>
            {!isAdminRoute && isAllowShowLoad && (
                <div className="fixed inset-0 bg-white z-[999999] flex items-center justify-center overflow-hidden w-full h-full hero-img">
                    <img
                        src={heroImage}
                        alt="Hero"
                        className="absolute inset-0 w-full h-full object-cover z-40"
                    />
                    <div className="bg-gradient-to-r from-[#ebdadae1] absolute inset-0 z-50"></div>
                    <img
                        src={logoFilm}
                        alt="Logo"
                        className="w-16 md:w-20 z-50 block relative inset-0"
                    />
                    <p className="typing-text overflow-hidden text-3xl md:text-5xl z-50 w-48 md:w-[300px]">
                        <span className="font-extrabold text-indigo-50">
                            BRONZE<span className="text-red-600">FILM</span>
                        </span>
                    </p>
                </div>
            )}
        </>
    );
};

export default Intro;
