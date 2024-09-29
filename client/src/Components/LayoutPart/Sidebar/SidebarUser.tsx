import React, { Fragment, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '@/Assets/Logo/logoFilm.png';
import Utils from '@/Utils';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { AppStateAction } from '@/Redux/Features/AppState';
import { AuthAction } from '@/Redux/Features/Auth';
import { ENUMS, LIST, ROUTERS } from '@/Constants';
import { IGenre } from '@/Interfaces/Genre.interface';
import { ISelfProfile } from '@/Interfaces/Auth.interface';
import { IMenuSettings } from '@/Interfaces/Menu.interface';
const { MENU_LIST_MOBILE } = LIST;
const { setThemeMode, setSidebarUserOpen } = AppStateAction;
const { logOut } = AuthAction;

const SidebarUser = () => {
    const { pathname } = useLocation();
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    const dispatch = useTypedDispatch();
    const roleName = Utils.getRoleUser();

    const sidebarUserOpen: boolean = useSelector((state: RootState) =>
        _.get(state.APP_STATE, 'sidebarUserOpen')
    );
    const genreLists: IGenre[] = useSelector(
        (state: RootState) => state.APP_STATE.genreLists
    );

    const selfProfile = useSelector<RootState, ISelfProfile | null>(
        (state: RootState) => state.AUTH.selfProfile
    );

    const { themeMode } = useSelector((state: RootState) => state.APP_STATE);

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded-user');

    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === 'true'
    );
    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarUserOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            dispatch(setSidebarUserOpen(false));
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    useEffect(() => {
        localStorage.setItem(
            'sidebar-expanded-user',
            sidebarExpanded.toString()
        );
    }, [sidebarExpanded]);

    const handleChangeTheme = () =>
        dispatch(setThemeMode(themeMode === 'dark' ? 'light' : 'dark'));

    const handleLogout = () => {
        dispatch(setSidebarUserOpen(!sidebarUserOpen));
        dispatch(logOut());
    };

    const getMenuSettings = (role: string) => {
        switch (role) {
            case ENUMS.ROLES.ADMIN:
                return LIST.ADMIN_SETTINGS;
            default:
                return LIST.USER_SETTINGS;
        }
    };

    const __renderProfile = () => {
        const settings = getMenuSettings(roleName);
        return (
            <div>
                <h3 className="mb-4 ml-4 text-xl font-semibold">PERSONAL</h3>
                <ul className="mb-6 flex flex-col gap-3">
                    {settings &&
                        settings.map(
                            (setting: IMenuSettings, index: number) => (
                                <li key={`sbPer${index}`}>
                                    {setting.value === 'logout' ? (
                                        <span
                                            onClick={handleLogout}
                                            className="cursor-pointer relative hover:bg-gray-200 flex items-center gap-8 rounded-lg py-1.5 px-4 transition duration-300 ease-in-out line-clamp-1"
                                        >
                                            <span>{setting?.icon}</span>
                                            <span className="text-lg">
                                                {setting?.label}
                                            </span>
                                        </span>
                                    ) : (
                                        <NavLink
                                            to={setting.value}
                                            className={`relative hover:bg-gray-200 flex items-center gap-8 rounded-lg py-1.5 px-4 transition duration-300 ease-in-out line-clamp-1 
                ${
                    pathname === setting.value &&
                    'bg-red-600 text-white hover:bg-red-600'
                }`}
                                        >
                                            <span>{setting?.icon}</span>
                                            <span className="text-lg">
                                                {setting?.label}
                                            </span>
                                        </NavLink>
                                    )}
                                </li>
                            )
                        )}
                </ul>
            </div>
        );
    };

    return (
        <div
            className={`fixed block lg:hidden inset-0 z-[999999] bg-[#00000059] ${
                sidebarUserOpen ? 'visible' : 'invisible'
            }`}
        >
            <aside
                ref={sidebar}
                className={`absolute left-0 top-0 z-[9999999] lg:hidden flex h-screen w-72 flex-col overflow-y-hidden bg-white text-black dark:bg-slate-900 duration-300 ease-linear ${
                    sidebarUserOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between px-2 py-3 lg:py-6.5">
                    <NavLink to="/" className="flex items-center gap-2">
                        <img src={Logo} alt="Logo" className="w-14" />
                        <div className="flex flex-col">
                            {selfProfile ? (
                                <>
                                    <span className="font-semibold text-base">
                                        {selfProfile?.displayName}
                                    </span>
                                    <span className="text-gray-700 text-sm font-medium">
                                        {selfProfile?.email}
                                    </span>
                                </>
                            ) : (
                                <span className="font-extrabold text-xl">
                                    <span className="">BRONZE</span>
                                    <span className="text-red-600">FILM</span>
                                </span>
                            )}
                        </div>
                    </NavLink>
                    <button
                        ref={trigger}
                        onClick={() =>
                            dispatch(setSidebarUserOpen(!sidebarUserOpen))
                        }
                        aria-controls="sidebar"
                        aria-expanded={sidebarUserOpen}
                        className="lg:hidden text-4xl text-gray-800 flex items-center justify-center w-9 h-9 text-center rounded-full transition hover:bg-gray-200 hover:text-red-600"
                    >
                        ×
                    </button>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={handleChangeTheme}
                        className="px-4 py-1.5 border border-gray-300 rounded-lg flex items-center gap-2 transition hover:border-gray-400 hover:bg-sky-50"
                    >
                        {themeMode === 'dark' ? (
                            <>
                                <i className="icon-sun text-xl"></i>
                                <span className="font-medium">Light mode</span>
                            </>
                        ) : (
                            <>
                                <i className="icon-moon text-xl"></i>
                                <span className="font-medium">Dark mode</span>
                            </>
                        )}
                    </button>
                </div>
                <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
                    <nav className="py-4 px-4">
                        <div>
                            <h3 className="mb-4 ml-4 text-xl font-semibold">
                                MENU
                            </h3>
                            <ul className="mb-6 flex flex-col gap-3">
                                {MENU_LIST_MOBILE &&
                                    MENU_LIST_MOBILE.map((menu, index) => {
                                        return (
                                            <Fragment key={`sbUser${index}`}>
                                                {menu.value !==
                                                    ROUTERS.GENRES && (
                                                    <li>
                                                        <NavLink
                                                            to={menu.value}
                                                            className={`relative hover:bg-gray-200 flex items-center gap-8 rounded-lg py-1.5 px-4 transition duration-300 ease-in-out line-clamp-1 
                                            ${
                                                pathname === menu.value &&
                                                'bg-red-600 text-white hover:bg-red-600'
                                            }`}
                                                        >
                                                            <span>
                                                                {menu.icon}
                                                            </span>
                                                            <span className="text-lg">
                                                                {menu?.label}
                                                            </span>
                                                        </NavLink>
                                                    </li>
                                                )}
                                                {menu.value ===
                                                    ROUTERS.GENRES && (
                                                    <SidebarLinkGroup
                                                        activeCondition={
                                                            pathname ===
                                                            ROUTERS.GENRES
                                                        }
                                                    >
                                                        {(
                                                            handleClick,
                                                            open
                                                        ) => {
                                                            return (
                                                                <Fragment>
                                                                    <NavLink
                                                                        to="#"
                                                                        className={`group relative flex items-center gap-8 rounded-lg py-1.5 px-4 duration-300 ease-in-out hover:bg-gray-200 ${
                                                                            (pathname ===
                                                                                '/forms' ||
                                                                                pathname.includes(
                                                                                    'forms'
                                                                                )) &&
                                                                            'bg-gray-400'
                                                                        }`}
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            sidebarExpanded
                                                                                ? handleClick()
                                                                                : setSidebarExpanded(
                                                                                      true
                                                                                  );
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            {
                                                                                menu.icon
                                                                            }
                                                                        </span>
                                                                        <span className="text-lg">
                                                                            {
                                                                                menu.label
                                                                            }
                                                                        </span>
                                                                        <span
                                                                            className={`ml-auto text-base ${
                                                                                open &&
                                                                                'rotate-90'
                                                                            }`}
                                                                        >
                                                                            <i className="icon-chevron-right" />
                                                                        </span>
                                                                    </NavLink>
                                                                    <div
                                                                        className={`translate transform overflow-hidden ${
                                                                            !open &&
                                                                            'hidden'
                                                                        }`}
                                                                    >
                                                                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                                                            {genreLists &&
                                                                                genreLists.map(
                                                                                    (
                                                                                        genre: IGenre
                                                                                    ) => (
                                                                                        <li
                                                                                            key={`sbCollapse${genre.id}`}
                                                                                            onClick={() => {
                                                                                                dispatch(
                                                                                                    setSidebarUserOpen(
                                                                                                        !sidebarUserOpen
                                                                                                    )
                                                                                                );
                                                                                                Utils.redirect(
                                                                                                    '/film',
                                                                                                    {
                                                                                                        genreId:
                                                                                                            genre.id
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                            className="text-black inline-block cursor-pointer py-2 px-2 hover:bg-gray-200 rounded-lg font-medium"
                                                                                        >
                                                                                            {
                                                                                                genre.name
                                                                                            }
                                                                                        </li>
                                                                                    )
                                                                                )}
                                                                        </ul>
                                                                    </div>
                                                                    {/* <!-- Dropdown Menu End --> */}
                                                                </Fragment>
                                                            );
                                                        }}
                                                    </SidebarLinkGroup>
                                                )}
                                            </Fragment>
                                        );
                                    })}
                            </ul>
                        </div>
                        {selfProfile && __renderProfile()}
                    </nav>
                </div>
            </aside>
        </div>
    );
};

export default SidebarUser;
