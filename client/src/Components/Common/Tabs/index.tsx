import React, { useEffect, useState } from 'react';

interface ITabs {
    children: JSX.Element[];
}

interface ITab {
    title: string;
    children: JSX.Element;
}

const Tabs: React.FC<ITabs> = ({ children }: ITabs) => {
    const [activeTab, setActiveTab] = useState<string>('');
    const handleClick = (newActiveTab: string) => {
        setActiveTab(newActiveTab);
    };
    useEffect(() => {
        setActiveTab(children[0].props.title);
    }, [children]);
    return (
        <div className="w-full">
            <div className="flex text-black gap-2">
                {children &&
                    children.map((child, index: number) => (
                        <span
                            key={`${child.props.title}${index}`}
                            className={`relative text-base rounded cursor-pointer text-center px-2 line-clamp-1 min-w-24 max-w-36 py-2 
                           
                            ${
                                activeTab === child.props.title
                                    ? 'bg-gradient-to-r from-sky-800 to-indigo-600 text-white'
                                    : 'text-gray-200 bg-slate-700 hover:opacity-80'
                            }`}
                            onClick={() => handleClick(child.props.title)}
                        >
                            {child.props.title}
                        </span>
                    ))}
            </div>
            <div>
                {children &&
                    children.map((child, index: number) => {
                        if (child.props.title === activeTab) {
                            return (
                                <div
                                    key={`${child.props.label}${index}`}
                                    className="rounded overflow-hidden shadow-md border border-stone-200 dark:border-slate-600 mt-2"
                                >
                                    {child.props.children}
                                </div>
                            );
                        }
                        return null;
                    })}
            </div>
        </div>
    );
};

const Tab: React.FC<ITab> = ({ title, children }: ITab) => {
    return (
        <div title={title} className="hidden">
            {children}
        </div>
    );
};

export { Tabs, Tab };
