import React, { Fragment, memo, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import SidebarLinkGroup from './SidebarLinkGroup';
import { setSidebarUserOpen } from '@/Redux/Features/AppState/AppStateSlice';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import Utils from '@/Utils';

interface Props {
    setting: any;
    data: any;
    keyText: string;
    urlRedirect: string;
    keyRedirect: string;
    stateKey: string;
}

const SidebarMultiple: React.FC<Props> = ({
    setting,
    data,
    keyText,
    urlRedirect,
    keyRedirect,
    stateKey
}) => {
    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded-user');
    const dispatch = useTypedDispatch();
    const sidebar = useRef<any>(null);
    const trigger = useRef<any>(null);

    const sidebarUserOpen: boolean = useSelector((state: RootState) =>
        _.get(state.APP_STATE, 'sidebarUserOpen')
    );
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null
            ? false
            : storedSidebarExpanded === 'true'
    );

    useEffect(() => {
        localStorage.setItem(
            'sidebar-expanded-user',
            sidebarExpanded.toString()
        );
    }, [sidebarExpanded]);
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
    return (
        <SidebarLinkGroup activeCondition={false}>
            {(handleClick, open) => {
                return (
                    <Fragment>
                        <div
                            className="group cursor-pointer overflow-hidden relative flex items-center gap-8 rounded-lg duration-300 ease-in-out pl-4 dark:text-white hover:bg-red-600 hover:text-white"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                sidebarExpanded
                                    ? handleClick()
                                    : setSidebarExpanded(true);
                            }}
                        >
                            <span>{setting.icon}</span>
                            <span className="text-lg">{setting.label}</span>
                            <span
                                className="ml-auto text-2xl px-4 py-1.5 inline-block transition
                                                                                 text-gray-700 group-hover:text-white dark:text-white"
                            >
                                {!open ? (
                                    <i className="icon-chevron-sign-right" />
                                ) : (
                                    <i className="icon-chevron-sign-down" />
                                )}
                            </span>
                        </div>
                        <div
                            className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                            }`}
                        >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                {data &&
                                    data.map((item: any, index: number) => (
                                        <li
                                            key={`sbCollapse${setting.value}${index}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                dispatch(
                                                    setSidebarUserOpen(
                                                        !sidebarUserOpen
                                                    )
                                                );
                                                Utils.redirect(urlRedirect, {
                                                    [stateKey]: _.get(
                                                        item,
                                                        keyRedirect
                                                    )
                                                });
                                            }}
                                            className="text-black dark:text-white hover:bg-red-600 inline-block hover:text-white cursor-pointer py-2 px-2 rounded-lg font-medium"
                                        >
                                            {_.get(item, keyText)}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </Fragment>
                );
            }}
        </SidebarLinkGroup>
    );
};

export default memo(SidebarMultiple);
