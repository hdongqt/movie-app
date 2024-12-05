import _ from 'lodash';
import React, { useEffect, useState } from 'react';
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
import Utils from '@/Utils';
import { IMenuItem, IMenuSettings } from '@/Interfaces/Menu.interface';
import { logOut } from '@/Redux/Features/Auth/AuthAction';
import { Popover } from 'react-tiny-popover';
import MenuMultiple from './MenuMulitple';
import { YEAR_SELECT_LIST } from '@/Constants/Lists/Select.list';

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

    useEffect(() => {
        if (themeMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [themeMode]);

    const _renderMenu = () => {
        return (
            <ul className="lg:flex hidden gap-4 ml-10">
                {MENU_LIST &&
                    MENU_LIST.map((setting: IMenuItem) => {
                        if (setting?.value && setting.value.startsWith('@'))
                            return (
                                <li
                                    key={`menu${setting?.value}`}
                                    onClick={() => {
                                        if (setting?.state)
                                            Utils.redirect(ROUTERS.FILM, {
                                                movieType: setting.state
                                            });
                                    }}
                                    className={`relative cursor-pointer px-3.5 py-1 text-center min-w-20 flex items-center justify-center gap-1
                                        transition rounded-full hover:bg-red-600 hover:text-white dark:text-white
                                      group ${beforeElementCl}`}
                                >
                                    <span className="font-medium text-lg">
                                        {setting?.label}
                                    </span>
                                    {setting?.value === '@Genre' && (
                                        <MenuMultiple
                                            data={genreLists}
                                            loading={isAppLoading}
                                            keyRedirect="id"
                                            keyText="name"
                                            stateKey="genreId"
                                            urlRedirect={ROUTERS.FILM}
                                        />
                                    )}
                                    {setting?.value === '@Year' && (
                                        <MenuMultiple
                                            data={[
                                                ...YEAR_SELECT_LIST.slice(1)
                                            ]}
                                            loading={false}
                                            keyRedirect="value"
                                            keyText="label"
                                            stateKey="year"
                                            urlRedirect={ROUTERS.FILM}
                                        />
                                    )}
                                </li>
                            );
                        return (
                            <NavLink
                                to={setting.value}
                                key={`menu${setting?.value}`}
                                className={({ isActive }) => {
                                    return `relative px-3.5 py-1 text-center min-w-20 flex items-center justify-center gap-1
                                        transition rounded-full
                                        ${
                                            isActive
                                                ? 'bg-red-600 text-white'
                                                : 'hover:bg-red-600 hover:text-white dark:text-white'
                                        } 
                                        `;
                                }}
                            >
                                <span className="font-medium text-lg">
                                    {setting?.label}
                                </span>
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
                            <ul className="bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white rounded overflow-hidden border shadow min-w-52">
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
                                                        index + 1 &&
                                                    'border-b dark:border-slate-600'
                                                }`}
                                            >
                                                {setting.value === 'logout' ? (
                                                    <button
                                                        className="w-full flex gap-6 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                                                        className="flex gap-6 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
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
        <header className="header w-full bg-white h-16 shadow text-black flex justify-between items-center fixed left-0 top-0 px-3 lg:px-5 z-50 dark:bg-slate-900/95 dark:shadow-gray-700">
            <section className="flex items-center">
                <button
                    aria-controls="sidebar"
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                            AppStateAction.setSidebarUserOpen(!sidebarUserOpen)
                        );
                    }}
                    className="z-[9999] block rounded border dark:border-slate-800 dark:hover:bg-slate-700 hover:bg-gray-100 bg-white dark:bg-transparent dark:text-white px-1.5 py-1 shadow-sm lg:hidden text-2xl"
                >
                    <i className="icon-align-justify"></i>
                </button>
                <Link to="/" className="h-10 lg:h-12 flex items-center gap-1">
                    <img src={logoFilm} alt="logoFilm" className="h-full" />
                    <span className="font-extrabold text-xl dark:text-gray-100">
                        BRONZE<span className="text-red-600">FILM</span>
                    </span>
                </Link>
                {_renderMenu()}
            </section>
            <div className="flex gap-2 items-center">
                <Link
                    to="/search"
                    className="group hidden lg:block w-10 h-10 relative rounded-full transition
                             text-gray-900 hover:bg-slate-200 dark:hover:bg-slate-800 border-2 dark:text-white"
                >
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                        <i className="icon-search"></i>
                    </span>
                </Link>
                <button
                    className="text-xl hidden lg:block w-10 h-10 rounded-full text-gray-900 hover:bg-slate-200 dark:hover:bg-slate-800 border-2 dark:text-white"
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
