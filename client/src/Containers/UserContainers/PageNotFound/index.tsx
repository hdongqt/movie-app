import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NotFound from '@/Assets/NotFound/NotFound.png';

const PageNotFound: React.FC = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2a1f6f] to-[#ae3082] shadow-[0_0_100px_rgba(0,0,0,0.8)] text-white">
                {/* Stars */}
                <div className="stars relative">
                    {/* Loop through 100 stars using JavaScript or similar */}
                    <div
                        className="star absolute bg-white rounded-full shadow-lg"
                        style={{ width: 2, height: 2, bottom: 300, left: 500 }}
                    />
                    {/* Add more stars here */}
                </div>
                {/* Planets */}
                <div className="planet planet1 absolute bottom-[260px] left-[50px] w-[90px] h-[90px] rounded-full border-[5px] border-[#a3358c] bg-[#cf3684] shadow-[0_0_30px_#a3358c]" />
                <div className="planet planet2 absolute bottom-[40px] right-[80px] w-[72px] h-[72px] rounded-full border-[5px] border-[#1383df] bg-[#08abf3] shadow-[0_0_30px_#1383df]" />
                <div className="planet planet3 absolute top-[20px] right-[30px] w-[54px] h-[54px] rounded-full border-[5px] border-[#7a7afe] bg-[#9a82ff] shadow-[0_0_30px_#7a7afe]" />
                {/* Girl */}
                <div className="girl absolute top-[130px] left-[460px]">
                    <div className="head relative w-[10px] h-[10px] bg-white rounded-[5px] border-l-[3px] border-black rotate-[-20deg]" />
                    <div className="body absolute top-[7px] left-[-2px] border-transparent border-b-[20px] border-l-[8px] border-r-[8px] rounded-b-[7px]" />
                    <div className="legs absolute bottom-[5px] left-[3px] w-[3px] h-[10px] border-l-[2px] border-r-[2px] border-white" />
                </div>
                {/* Title */}
                <div className="title relative z-50">
                    <h1 className="text-[15rem] font-bold flex items-center">
                        <span className="mx-[30px]">4</span>
                        <div className="square w-[150px] h-[150px] inline-block transform scale-[1.1] rotate-[45deg] relative">
                            <div className="light light1 absolute top-[7px] left-[15px] w-[15px] h-[135px] bg-[#fedbae] shadow-[0_0_10px_#fedbae] skew-y-[45deg]" />
                            <div className="light light2 absolute top-0 left-[25px] w-[120px] h-[15px] bg-[#fedbae] shadow-[0_0_10px_#fedbae] skew-x-[45deg]" />
                            <div className="light light3 absolute top-[7px] right-[15px] w-[15px] h-[135px] bg-[#fedbae] shadow-[0_0_10px_#fedbae] skew-y-[45deg]" />
                            <div className="light light4 absolute bottom-0 right-[25px] w-[120px] h-[15px] bg-[#fedbae] shadow-[0_0_10px_#fedbae] skew-x-[45deg]" />
                            <div className="shadow shadow1 absolute bottom-[7px] right-0 w-[15px] h-[135px] bg-[#ff9c61] shadow-[0_0_10px_#ff9c61] skew-y-[-45deg]" />
                            <div className="shadow shadow2 absolute top-[25px] left-[25px] w-[120px] h-[15px] bg-[#ff9c61] shadow-[0_0_10px_#ff9c61] skew-x-[-45deg]" />
                            <ul className="stairs1 absolute top-[1px] left-[11px] h-[150px]">
                                {/* 12 <li> elements for the stairs */}
                                <li className="w-[7.5px] h-[7.5px] bg-[#fedbae] shadow-[0_0_10px_#fedbae] rotate-[45deg] mb-[3px]" />
                            </ul>
                        </div>
                        <span className="mx-[30px]">4</span>
                    </h1>
                </div>
                {/* Message */}
                <div className="message mt-[50px]">
                    <h2 className="text-[1.8rem]">
                        Ồ ! Hình như bạn đi lạc...
                    </h2>
                </div>
                {/* Action Button */}
                <div className="action mt-[30px]">
                    <button className="px-[20px] py-[10px] text-[1.2rem] border-[2px] border-[#ff9c61] bg-[#ff9c61] rounded-full shadow-[0_0_15px_#ff9c61] hover:bg-transparent transition-all duration-200">
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
