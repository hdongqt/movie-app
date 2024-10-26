import { Link } from 'react-router-dom';
import LogoIcon from '@/Assets/Logo/logoFilm.png';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import { AppStateAction } from '@/Redux/Features/AppState';
import _ from 'lodash';
import Utils from '@/Utils';
import { ISelfProfile } from '@/Interfaces/Auth.interface';

const AdminHeader = () => {
    const dispatch = useTypedDispatch();
    const sidebarAdminOpen: boolean = useSelector((state: RootState) =>
        _.get(state.APP_STATE, 'sidebarAdminOpen')
    );
    const selfProfile = useSelector<RootState, ISelfProfile | null>(
        (state: RootState) => state.AUTH.selfProfile
    );
    return (
        <header
            className="sticky w-full bg-white h-16 shadow text-black flex justify-between items-center left-0 
        top-0 px-3 py-4 lg:px-5 z-50"
        >
            <section className="flex items-center">
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
                <Link to="/" className="h-10 lg:h-12 flex items-center gap-1">
                    <img src={LogoIcon} alt="logoFilm" className="h-full" />
                    <span className="font-extrabold text-xl">
                        BRONZE<span className="text-red-600">FILM</span>
                    </span>
                </Link>
            </section>
            <div className="flex items-center gap-3 ml-auto">
                <button className="font-bold text-2xl w-11 h-11 bg-red-500 rounded-full text-white relative pointer-events-none">
                    <span className="uppercase">
                        {selfProfile &&
                            Utils.getLastChar(selfProfile.displayName)}
                    </span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
