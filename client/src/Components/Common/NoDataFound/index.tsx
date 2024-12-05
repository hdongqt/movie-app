import React, { useState } from 'react';

import NoDataGif from '@/Assets/NoData/NoData.gif';
import './NoDataFound.css';

interface INoDataFound {
    firstClassImg?: string;
}

const NoDataFound: React.FC<INoDataFound> = ({
    firstClassImg
}: INoDataFound) => {
    return (
        <div>
            <div className="w-full flex flex-col justify-center items-center">
                <img
                    src={NoDataGif}
                    alt="NoData"
                    className={`${firstClassImg} max-h-80`}
                />
                <span className="font-bold dark:text-white/90">
                    Không có bộ phim nào 😞
                </span>
            </div>
        </div>
    );
};

export default NoDataFound;
