import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '@/Assets/Logo/logoFilm.png';
import Utils from '@/Utils';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { AppStateAction } from '@/Redux/Features/AppState';
import { AuthAction } from '@/Redux/Features/Auth';
import { ROUTERS } from '@/Constants';

const SidebarAdmin = () => {
    const { pathname } = useLocation();
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    const dispatch = useTypedDispatch();
    const sidebarAdminOpen: boolean = useSelector((state: RootState) =>
        _.get(state.APP_STATE, 'sidebarAdminOpen')
    );
    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
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
                !sidebarAdminOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            dispatch(AppStateAction.setSidebarAdminOpen(false));
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarAdminOpen || keyCode !== 27) return;
            dispatch(AppStateAction.setSidebarAdminOpen(false));
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector('body')?.classList.add('sidebar-expanded');
        } else {
            document
                .querySelector('body')
                ?.classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-[100] flex h-screen w-72 flex-col overflow-y-hidden bg-slate-900 duration-300 ease-linear lg:static lg:translate-x-0 ${
                sidebarAdminOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between px-2 py-3 lg:py-6.5">
                <NavLink to="/" className="flex items-center gap-2">
                    <img src={Logo} alt="Logo" className="w-14" />
                    <span className="font-extrabold text-xl">
                        <span className="text-white">BRONZE</span>
                        <span className="text-red-600">FILM</span>
                    </span>
                </NavLink>
                <button
                    ref={trigger}
                    onClick={() =>
                        dispatch(
                            AppStateAction.setSidebarAdminOpen(
                                !sidebarAdminOpen
                            )
                        )
                    }
                    aria-controls="sidebar"
                    aria-expanded={sidebarAdminOpen}
                    className="lg:hidden text-xl text-gray-200 flex items-center justify-center w-9 h-9 text-center rounded-full transition hover:bg-gray-200 hover:text-gray-800"
                >
                    <i className="icon-arrow-left" />
                </button>
            </div>
            <h4 className="font-medium text-lg text-white text-center">
                {Utils.getUserData()?.displayName}
            </h4>
            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-white">
                            MENU
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <li>
                                <NavLink
                                    to="/admin"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out 
                                    hover:bg-gray-700 hover:opacity-90 ${
                                        pathname === '/admin' &&
                                        'bg-gray-700 opacity-90'
                                    }`}
                                >
                                    <i className="icon-bar-chart" /> Dashboard
                                </NavLink>
                            </li>

                            {/* <!-- Menu Item Calendar --> */}
                            <li>
                                <NavLink
                                    to="/admin/crawls"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-gray-700 hover:opacity-90 ${
                                        pathname.includes('/admin/crawl') &&
                                        'bg-gray-700 opacity-90'
                                    }`}
                                >
                                    <i className="icon-cogs" /> Crawls
                                </NavLink>
                            </li>
                            <SidebarLinkGroup activeCondition={true}>
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out 
                                                hover:bg-gray-700 hover:opacity-90 ${
                                                    (pathname ===
                                                        '/admin/genres' ||
                                                        pathname ===
                                                            '/admin/movies' ||
                                                        pathname ===
                                                            '/admin/users') &&
                                                    'bg-gray-700 opacity-90'
                                                }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    sidebarExpanded
                                                        ? handleClick()
                                                        : setSidebarExpanded(
                                                              true
                                                          );
                                                }}
                                            >
                                                <i className="icon-tasks" />
                                                Quản lý
                                                <svg
                                                    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                                        open && 'rotate-180'
                                                    }`}
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </NavLink>
                                            <div
                                                className={`translate transform overflow-hidden ${
                                                    !open && 'hidden'
                                                }`}
                                            >
                                                <ul className="mt-4 mb-5.5 flex flex-col gap-1 pl-6">
                                                    <li>
                                                        <NavLink
                                                            to="/admin/movies"
                                                            className={({
                                                                isActive
                                                            }) =>
                                                                'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-gray-700 hover:opacity-90' +
                                                                (isActive &&
                                                                    ' bg-gray-700 opacity-90')
                                                            }
                                                        >
                                                            <i className="icon-film" />
                                                            Phim
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/admin/genres"
                                                            className={({
                                                                isActive
                                                            }) =>
                                                                'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-gray-700 hover:opacity-90' +
                                                                (isActive &&
                                                                    ' bg-gray-700 opacity-90')
                                                            }
                                                        >
                                                            <i className="icon-align-left" />
                                                            Thể loại
                                                        </NavLink>
                                                    </li>
                                                    <li>
                                                        <NavLink
                                                            to="/admin/users"
                                                            className={({
                                                                isActive
                                                            }) =>
                                                                'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-gray-700 hover:opacity-90' +
                                                                (isActive &&
                                                                    ' bg-gray-700 opacity-90')
                                                            }
                                                        >
                                                            <i className="icon-user" />
                                                            Người dùng
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </div>
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                        </ul>
                    </div>

                    {/* <!-- Others Group --> */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-200">
                            AUTHENTICATION
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <li>
                                <button
                                    className={`w-full group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white hover:bg-gray-700 hover:opacity-90`}
                                    onClick={(e) => {
                                        dispatch(AuthAction.logOut());
                                        Utils.redirect(ROUTERS.HOME);
                                    }}
                                >
                                    <i className="icon-signout" />
                                    Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};

export default SidebarAdmin;
