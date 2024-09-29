import { Link } from 'react-router-dom';
import LogoIcon from '@/Assets/Logo/logoFilm.png';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import { AppStateAction } from '@/Redux/Features/AppState';
import _ from 'lodash';

const AdminHeader = () => {
    const dispatch = useTypedDispatch();
    const sidebarAdminOpen: boolean = useSelector((state: RootState) =>
        _.get(state.APP_STATE, 'sidebarAdminOpen')
    );
    return (
        <header className="sticky top-0 z-[99] flex w-full bg-white drop-shadow">
            <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                                AppStateAction.setSidebarAdminOpen(
                                    !sidebarAdminOpen
                                )
                            );
                        }}
                        className="z-[9999] block rounded border hover:bg-gray-100 bg-white px-1.5 py-1 shadow-sm lg:hidden text-2xl"
                    >
                        <i className="icon-align-justify"></i>
                    </button>
                    <Link
                        to="/"
                        className="h-10 lg:h-12 flex items-center gap-1"
                    >
                        <img src={LogoIcon} alt="logoFilm" className="h-full" />
                        <span className="font-extrabold text-xl">
                            BRONZE<span className="text-red-600">FILM</span>
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                    <div className="flex flex-col items-end">
                        <span className="font-medium">Đồng Hoàng</span>
                        <span className="text-sm">Admin</span>
                    </div>
                    <button className="group font-bold text-2xl w-11 h-11 bg-red-500 rounded-full text-white relative">
                        <span className="uppercase">Đ</span>
                        <span className="w-max hidden lg:inline-block absolute top-full right-0 scale-0 transition rounded bg-gray-600 p-2 text-xs text-white group-hover:scale-100">
                            Update Info
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
