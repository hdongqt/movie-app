import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '@/Assets/Logo/logoFilm.png';
import Utils from '@/Utils';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { AppStateAction } from '@/Redux/Features/AppState';

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
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out ${
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
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                        pathname.includes('/admin/crawl') &&
                                        'bg-gray-700 opacity-90'
                                    }`}
                                >
                                    <i className="icon-cogs" /> Crawls
                                </NavLink>
                            </li>
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/admin/genres' ||
                                    pathname === '/admin/movies' ||
                                    pathname === '/admin/users'
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out  ${
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
                                                                'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out' +
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
                                                                'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out' +
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
                                                                'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out' +
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
                                            {/* <!-- Dropdown Menu End --> */}
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                        </ul>
                    </div>

                    {/* <!-- Others Group --> */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-200">
                            OTHERS
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            <SidebarLinkGroup
                                activeCondition={
                                    pathname === '/auth' ||
                                    pathname.includes('auth')
                                }
                            >
                                {(handleClick, open) => {
                                    return (
                                        <React.Fragment>
                                            <NavLink
                                                to="#"
                                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                                    (pathname === '/auth' ||
                                                        pathname.includes(
                                                            'auth'
                                                        )) &&
                                                    'bg-graydark dark:bg-meta-4'
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
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="19"
                                                    viewBox="0 0 18 19"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g clipPath="url(#clip0_130_9814)">
                                                        <path
                                                            d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
                                                            fill=""
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_130_9814">
                                                            <rect
                                                                width="18"
                                                                height="18"
                                                                fill="white"
                                                                transform="translate(0 0.052124)"
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                Authentication
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
                                        </React.Fragment>
                                    );
                                }}
                            </SidebarLinkGroup>
                            {/* <!-- Menu Item Auth Pages --> */}
                        </ul>
                    </div>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};

export default SidebarAdmin;
