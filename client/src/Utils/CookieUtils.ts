import { COOKIE_KEYS } from '@/Constants';
import { IGenre } from '@/Interfaces/Genre.interface';
import _ from 'lodash';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const saveAccessToken = (token: string) => {
    cookies.set(COOKIE_KEYS.SECURE_TOKEN, token, {
        path: '/',
        maxAge: 60 * 60 * 24
    });
};

const getSavedAccessToken = () => {
    return cookies.get(COOKIE_KEYS.SECURE_TOKEN);
};

const saveRefreshToken = (token: string) => {
    cookies.set(COOKIE_KEYS.SECURE_REFRESH_TOKEN, token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30
    });
};

const getSavedRefreshToken = () => {
    return cookies.get(COOKIE_KEYS.SECURE_REFRESH_TOKEN);
};

const saveUserData = (userData: any) => {
    localStorage.setItem(COOKIE_KEYS.USER_DATA, JSON.stringify(userData));
};

const getUserData = () => {
    const user = localStorage.getItem(COOKIE_KEYS.USER_DATA);
    return user && user !== 'undefined' ? JSON.parse(user) : null;
};

const getRoleUser = () => {
    return _.get(getUserData(), 'role', 'user');
};

const clearAllSavedData = () => {
    cookies.remove(COOKIE_KEYS.SECURE_TOKEN, { path: '/' });
    cookies.remove(COOKIE_KEYS.SECURE_REFRESH_TOKEN, { path: '/' });
    localStorage.removeItem(COOKIE_KEYS.USER_DATA);
};

const saveGenres = (data: IGenre[]) => {
    sessionStorage.setItem(COOKIE_KEYS.GENRE_DATA, JSON.stringify(data));
};

const getSavedGenres = () => {
    const savedGenres = sessionStorage.getItem(COOKIE_KEYS.GENRE_DATA);
    return !!savedGenres ? JSON.parse(savedGenres) : [];
};

export default {
    saveRefreshToken,
    saveAccessToken,
    saveUserData,
    getUserData,
    getSavedAccessToken,
    getSavedRefreshToken,
    clearAllSavedData,
    getRoleUser,
    saveGenres,
    getSavedGenres
};
