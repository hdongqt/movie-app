import _ from 'lodash';
import React, { useState } from 'react';

interface ISkeleton {
    rowNumber?: number;
    isMulti?: boolean;
    heightRow?: number;
}

const Skeleton: React.FC<ISkeleton> = ({
    rowNumber,
    isMulti,
    heightRow
}: ISkeleton) => {
    let heightList = [22, 28, 16, 32, 40, 24, 16, 52];
    const numberAdd = isMulti ? rowNumber || 5 : 1;
    while (numberAdd > heightList.length) {
        const countAdd = numberAdd - heightList.length;
        heightList = [...heightList, ...heightList.slice(0, countAdd)];
    }
    return (
        <div className="animate-pulse">
            <ul className="space-y-3">
                {_.range(numberAdd).map((item) => {
                    return (
                        <li
                            key={`skeleton${item}`}
                            className={`w-full bg-zinc-200 rounded-md dark:bg-gray-700`}
                            style={{
                                height: heightRow || heightList[item] + 'px'
                            }}
                        ></li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Skeleton;
