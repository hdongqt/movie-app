import React, { useState } from 'react';

import './CollapseMenu.css';

interface ICollapseMenu {
    children: JSX.Element;
    heading: string;
}

const CollapseMenu: React.FC<ICollapseMenu> = (props: ICollapseMenu) => {
    const { children, heading } = props;

    const [isOpen, setIsOpen] = useState(true);
    const changeStatusCollapse = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="relative border rounded-md text-light px-3 shadow-lg">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={changeStatusCollapse}
            >
                <span className="font-medium text-lg py-1.5 block">
                    {heading}
                </span>
                <span className="text-lg cursor-pointer p-1 text-gray-800">
                    {isOpen ? (
                        <i className="icon-chevron-down"></i>
                    ) : (
                        <i className="icon-chevron-right"></i>
                    )}
                </span>
            </div>
            <div
                className={`collapse-area rounded-b-md ${
                    isOpen ? 'collapse-open' : ''
                }`}
            >
                <div className="collapse-content">
                    <div className="border-t border-stone-300 w-full mt-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollapseMenu;
