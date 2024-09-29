import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Link, useLocation, useParams } from 'react-router-dom';
import DefaultLayout from '@/Components/DefaultLayout';
import { RootState, useTypedDispatch } from '@/Redux/Store';
import { useSelector } from 'react-redux';
import { ROUTERS } from '@/Constants';
import { getCrawl } from '@/Redux/Features/Crawl/CrawlAction';
import dayjs from 'dayjs';
import Utils from '@/Utils';

const MediaDetail: React.FC = () => {
    const dispatch = useTypedDispatch();
    const { state } = useLocation();

    const isGetLoading: boolean = useSelector((state: RootState) =>
        _.get(state.CRAWL, 'isGetLoading')
    );

    const crawlDetail: any = useSelector((state: RootState) =>
        _.get(state.CRAWL, 'crawlDetail')
    );
    useEffect(() => {
        if (state?.id) dispatch(getCrawl(state?.id));
    }, [state]);
    const __renderContent = () => {
        return (
            <>
                <div className="flex gap-2 items-center  border-b pb-2 border-gray-300 justify-between">
                    <h2 className="text-3xl font-medium text-slate-800">
                        Chi tiết Crawl
                    </h2>
                    <Link
                        to={ROUTERS.CRAWL_MANAGEMENT}
                        className="flex gap-2 items-center border shadow px-2.5 py-1 font-medium rounded-full text-gray-700
                    hover:shadow-md hover:border-gray-300 hover:bg-gray-200 transition"
                    >
                        <span className="text-slate-800 text-sm">
                            <i className="icon-arrow-left"></i>
                        </span>
                        Trở về Crawl
                    </Link>
                </div>
                <div className="mt-8 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-black font-medium">
                                Trạng thái
                            </label>
                            <div className="flex items-start">
                                <span
                                    className={`text-base min-w-24 flex justify-center items-center gap-2 text-white px-3 py-1 rounded-full ${
                                        !!crawlDetail &&
                                        (crawlDetail?.status === 'complete'
                                            ? 'bg-green-500'
                                            : crawlDetail?.status === 'crawling'
                                            ? 'bg-sky-500'
                                            : 'bg-red-600')
                                    }`}
                                >
                                    {!!crawlDetail &&
                                        (crawlDetail?.status === 'complete' ? (
                                            <>
                                                Hoàn thành
                                                <i className="icon-ok"></i>
                                            </>
                                        ) : crawlDetail?.status ===
                                          'crawling' ? (
                                            <>
                                                Đang hoạt động
                                                <i className="icon-bolt"></i>
                                            </>
                                        ) : (
                                            <>
                                                Lỗi
                                                <i className="icon-ban-circle"></i>
                                            </>
                                        ))}
                                </span>
                            </div>
                        </div>
                        <div className="sm:col-span-1">
                            <label className="mb-1.5 block text-black font-medium">
                                Bắt đầu
                            </label>
                            <input
                                type="text"
                                disabled
                                value={
                                    !!crawlDetail
                                        ? dayjs(crawlDetail?.createdAt).format(
                                              'DD-MM-YYYY, HH:mm'
                                          )
                                        : ''
                                }
                                className="w-full rounded-lg border-[1.5px] border-stone-300 bg-transparent py-3 px-5 text-gray-800 outline-none"
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label className="mb-1.5 block text-black font-medium">
                                Kết thúc
                            </label>
                            <input
                                type="text"
                                disabled
                                value={
                                    !!crawlDetail
                                        ? Utils.formatDateTime(
                                              crawlDetail.updatedAt
                                          )
                                        : ''
                                }
                                className="w-full rounded-lg border-[1.5px] border-stone-300 bg-transparent py-3 px-5 text-gray-800 outline-none"
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label className="mb-1.5 block text-black font-medium">
                                Thông tin
                            </label>
                            <textarea
                                disabled
                                value={crawlDetail?.info || ''}
                                rows={50}
                                className="resize-none w-full max-h-36 rounded-lg border-[1.5px] border-stone-300 w-full inline-block border-stroke bg-transparent py-3 px-5 text-gray-800 outline-none"
                            />
                        </div>
                    </div>
                    {isGetLoading && (
                        <div className="absolute z-50 inset-0 flex items-center justify-center bg-[#ffffff4d]">
                            <span className="inline-block border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600" />
                        </div>
                    )}
                </div>
            </>
        );
    };
    return <DefaultLayout portalFor="ADMIN" children={__renderContent()} />;
};
export default MediaDetail;
