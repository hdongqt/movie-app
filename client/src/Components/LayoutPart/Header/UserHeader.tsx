import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import logoFilm from '@/Assets/Logo/logoFilm.png';

import { ENUMS, LIST, ROUTERS } from '@/Constants';
import { Link } from 'react-router-dom';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { AppStateAction } from '@/Redux/Features/AppState';
import { IGenre } from '@/Interfaces/Genre.interface';
import { AuthAction } from '@/Redux/Features/Auth';
import { ISelfProfile } from '@/Interfaces/Auth.interface';
import _ from 'lodash';
import Utils from '@/Utils';
import { IMenuSettings } from '@/Interfaces/Menu.interface';
import { logOut } from '@/Redux/Features/Auth/AuthAction';
import { Popover } from 'react-tiny-popover';

const { MENU_LIST } = LIST;
const { setThemeMode } = AppStateAction;
const { setIsShowModalAuth } = AuthAction;

const beforeElementCl =
    'before:content-[""] before:absolute before:w-full before:h-6 before:top-full before:left:0 before:bg-transparent';

const getMenuSettings = (role: string) => {
    switch (role) {
        case ENUMS.ROLES.ADMIN:
            return LIST.ADMIN_SETTINGS;
        default:
            return LIST.USER_SETTINGS;
    }
};

const UserHeader: React.FC = () => {
    const dispatch = useTypedDispatch();

    const roleName = Utils.getRoleUser();

    const { themeMode } = useSelector((state: RootState) => state.APP_STATE);

    const isAppLoading: boolean = useSelector((state: RootState) =>
        _.get(state.APP_STATE, 'isAppLoading')
    );

    const genreLists: IGenre[] = useSelector(
        (state: RootState) => state.APP_STATE.genreLists
    );

    const selfProfile = useSelector<RootState, ISelfProfile | null>(
        (state: RootState) => state.AUTH.selfProfile
    );

    const sidebarUserOpen: boolean = useSelector(
        (state: RootState) => state.APP_STATE.sidebarUserOpen
    );
    const [isShowMenu, setIsShowMenu] = useState(false);

    const handleChangeTheme = () =>
        dispatch(setThemeMode(themeMode === 'dark' ? 'light' : 'dark'));

    const handleLogout = () => {
        setIsShowMenu(!isShowMenu);
        dispatch(logOut());
    };

    const _renderMenu = () => {
        return (
            <ul className="lg:flex hidden gap-4 ml-10 dark:bg-red-600">
                {MENU_LIST &&
                    MENU_LIST.map((setting: any) => {
                        return (
                            <NavLink
                                to={setting?.value}
                                key={`menu${setting?.value}`}
                                className={({ isActive }) => {
                                    return `relative px-3.5 py-1 text-center min-w-20 flex items-center justify-center gap-1
                                        transition rounded-full
                                        ${
                                            isActive
                                                ? 'bg-red-600 text-white'
                                                : 'hover:bg-red-600 hover:text-white'
                                        } 
                                        ${
                                            setting?.isMultiple
                                                ? `group ${beforeElementCl}`
                                                : ''
                                        }
                                        `;
                                }}
                            >
                                <span className="font-medium text-lg">
                                    {setting?.label}
                                </span>
                                {setting?.value === ROUTERS.FILM && (
                                    <>
                                        {isAppLoading && (
                                            <div className="hidden z-20 border border-gray-300 absolute top-full left-0 p-1 px-3 shadow-lg bg-white rounded-md w-20 group-hover:block mt-2">
                                                <svg
                                                    aria-hidden="true"
                                                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"
                                                        stroke="currentColor"
                                                        strokeWidth="5"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentFill"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        {!isAppLoading && genreLists && (
                                            <ul className="hidden z-20 border border-gray-300 absolute top-full left-0 p-1 px-3 shadow-lg bg-white rounded-md w-max group-hover:grid grid-cols-3 gap-2 mt-2">
                                                {genreLists.map(
                                                    (
                                                        genre: IGenre,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <li
                                                                key={`genreHeader${index}`}
                                                            >
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        Utils.redirect(
                                                                            '/film',
                                                                            {
                                                                                genreId:
                                                                                    genre.id
                                                                            }
                                                                        );
                                                                    }}
                                                                    className="text-black inline-block py-2 hover:bg-gray-200 w-32 rounded-lg font-medium"
                                                                >
                                                                    {genre.name}
                                                                </button>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
            </ul>
        );
    };

    const _renderProfile = () => {
        const settings = getMenuSettings(roleName);
        return (
            <>
                {!selfProfile && (
                    <button onClick={() => dispatch(setIsShowModalAuth(true))}>
                        <span
                            className="block px-3.5 py-1.5 text-center rounded
                                transition duration-100 ease-linear
                                bg-red-600 hover:bg-red-700 text-white 
                                "
                        >
                            Đăng nhập
                        </span>
                    </button>
                )}

                {selfProfile && (
                    <Popover
                        isOpen={isShowMenu}
                        positions={['bottom', 'left']}
                        containerStyle={{ zIndex: '99999', marginTop: '4px' }}
                        padding={0}
                        onClickOutside={() => setIsShowMenu(false)}
                        content={
                            <ul className="bg-white rounded overflow-hidden border shadow min-w-52">
                                {settings &&
                                    settings.map(
                                        (
                                            setting: IMenuSettings,
                                            index: number
                                        ) => (
                                            <li
                                                key={`settingUser${index}`}
                                                className={`${
                                                    settings.length !==
                                                        index + 1 && 'border-b'
                                                } rounded`}
                                            >
                                                {setting.value === 'logout' ? (
                                                    <button
                                                        className="w-full flex gap-6 px-4 py-2 hover:bg-gray-200"
                                                        onClick={handleLogout}
                                                    >
                                                        <span className="text-lg">
                                                            {setting.icon}
                                                        </span>
                                                        <span className="font-medium text-lg">
                                                            {setting.label}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={setting.value}
                                                        className="flex gap-6 px-4 py-2 hover:bg-gray-200"
                                                    >
                                                        <span className="text-lg">
                                                            {setting.icon}
                                                        </span>
                                                        <span className="font-medium text-lg">
                                                            {setting.label}
                                                        </span>
                                                    </Link>
                                                )}
                                            </li>
                                        )
                                    )}
                            </ul>
                        }
                    >
                        <button
                            className="pointer-events-none lg:pointer-events-auto group font-bold text-2xl w-11 h-11 bg-red-500 rounded-full text-white relative"
                            onClick={() => setIsShowMenu(!isShowMenu)}
                        >
                            <span className="uppercase">
                                {Utils.getLastChar(selfProfile.displayName)}
                            </span>
                            {!isShowMenu && (
                                <span className="w-max inline-block absolute top-full right-0 scale-0 transition rounded bg-gray-600 p-2 text-xs text-white group-hover:scale-100">
                                    Open Settings
                                </span>
                            )}
                        </button>
                    </Popover>
                )}
            </>
        );
    };

    return (
        <header className="header w-full bg-white h-16 shadow text-black flex justify-between items-center fixed left-0 top-0 px-3 lg:px-5 z-50">
            <section className="flex items-center">
                <button
                    aria-controls="sidebar"
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                            AppStateAction.setSidebarUserOpen(!sidebarUserOpen)
                        );
                    }}
                    className="z-[9999] block rounded border hover:bg-gray-100 bg-white px-1.5 py-1 shadow-sm lg:hidden text-2xl"
                >
                    <i className="icon-align-justify"></i>
                </button>
                <Link to="/" className="h-10 lg:h-12 flex items-center gap-1">
                    <img src={logoFilm} alt="logoFilm" className="h-full" />
                    <span className="font-extrabold text-xl">
                        BRONZE<span className="text-red-600">FILM</span>
                    </span>
                </Link>
                {_renderMenu()}
            </section>
            <div className="flex gap-2 items-center">
                <Link
                    to="/search"
                    className="hidden lg:block w-10 h-10 relative rounded-full transition
                                border-2 text-gray-900 hover:bg-slate-900 hover:text-white hover:border-none"
                >
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                        <i className="icon-search"></i>
                    </span>
                </Link>
                <button
                    className="text-xl hidden lg:block w-9 h-9 rounded-full hover:bg-slate-200 border border-gray-600"
                    onClick={(e: React.MouseEvent) => handleChangeTheme()}
                >
                    {themeMode === 'dark' ? (
                        <i className="icon-sun"></i>
                    ) : (
                        <i className="icon-moon"></i>
                    )}
                </button>
                {_renderProfile()}
            </div>
        </header>
    );
};

export default UserHeader;
