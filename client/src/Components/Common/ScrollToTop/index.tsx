import { RootState } from '@/Redux/Store';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        setIsVisible(window.scrollY > 300 ? true : false);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;
    return (
        <button
            className="w-10 h-10 fixed z-50 bottom-5 right-4 md:bottom-3 md:right-3 bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-sky-700 rounded-full text-lg text-center text-white transition overflow-hidden"
            onClick={scrollToTop}
        >
            <i className="icon-chevron-up" />
        </button>
    );
};

export default ScrollToTop;
