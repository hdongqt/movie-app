import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import DefaultLayout from '@/Components/DefaultLayout';
import BannerDashboard from '@/Assets/Banner/banner-dashboard.jpg';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Utils from '@/Utils';

interface WeatherData {
    name: string;
    weather: { icon: string }[];
    main: { temp: number; humidity: number };
}

const AdminDashboard: React.FC = () => {
    const [data, setData] = useState<WeatherData | null>(null);

    useEffect(() => {
        const getAPI = async () => {
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            const response = await axios.get(
                                'https://api.openweathermap.org/data/2.5/weather',
                                {
                                    params: {
                                        lat: latitude,
                                        lon: longitude,
                                        appid: 'c34d0b30de706ed953190741dcd852f2',
                                        units: 'metric',
                                        lang: 'vi'
                                    }
                                }
                            );
                            setData(response.data);
                        }
                    );
                }
                setData(null);
            } catch (error) {
                Utils.ToastMessage(
                    'Không thể tìm thấy thông tin thời tiết',
                    'error'
                );
                setData(null);
            }
        };
        getAPI();
    }, []);

    const srcImage = data
        ? `http://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`
        : 'http://openweathermap.org/img/wn/10d@2x.png';

    const __renderContent = () => {
        return (
            <div>
                <h2 className="font-medium text-gray-900 text-2xl text-center py-5 mt-3 mb-5 bg-slate-200 rounded shadow-lg">
                    Welcome to Dashboard Movie App
                </h2>
                <div className="flex justify-center items-center">
                    <div>
                        <div className="text-lg capitalize">
                            {dayjs().format('dddd, D MMMM')}
                        </div>
                        <div className="text-2xl font-bold">
                            {dayjs().format('HH:mm')}
                        </div>
                        <div className="mt-4">{data ? data.name : '- -'}</div>
                    </div>
                    <div className="">
                        <img
                            className="w-32 mx-auto"
                            src={srcImage}
                            alt="weather icon"
                        />
                        <p className="text-6xl font-bold">
                            {data ? Math.round(data.main.temp) : 23}°
                        </p>
                    </div>
                </div>
                <img
                    src={BannerDashboard}
                    alt="Banner"
                    className="rounded mt-5"
                />
            </div>
        );
    };
    return <DefaultLayout portalFor="ADMIN" children={__renderContent()} />;
};

export default AdminDashboard;
