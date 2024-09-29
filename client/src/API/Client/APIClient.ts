import _ from 'lodash';
import axios, {
    AxiosRequestHeaders,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import queryString from 'query-string';

import AuthAPI from '../Modules/AuthAPI';
import Utils from '@/Utils';

const baseURL =
    process.env.REACT_APP_MODE === 'prod'
        ? process.env.REACT_APP_API_PROD
        : process.env.REACT_APP_API_DEV;

const APIClient = axios.create({
    baseURL,
    paramsSerializer: (params) =>
        queryString.stringify(params, { arrayFormat: 'separator' })
});

APIClient.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    const isFormData = request.data instanceof FormData;
    return {
        ...request,
        headers: {
            ...request.headers,
            'Content-Type': isFormData
                ? 'multipart/form-data'
                : 'application/json',
            Authorization: `Bearer ${Utils.getSavedAccessToken()}`
        } as AxiosRequestHeaders
    };
});

let requestRefreshToken: null | Promise<AxiosResponse<any, any>> = null;
let isRetry = false;
APIClient.interceptors.response.use(
    async (response: any) => {
        if (response && response.data) return response.data;
        return response;
    },
    async (error) => {
        const originalRequest: any = error.config;
        if (error?.response?.status === 401 && !isRetry) {
            isRetry = true;
            try {
                const refreshTokenSaved = Utils.getSavedRefreshToken();
                if (!refreshTokenSaved) throw error;
                requestRefreshToken =
                    requestRefreshToken ||
                    AuthAPI.refreshToken(refreshTokenSaved);
                const res: any = await requestRefreshToken;
                requestRefreshToken = null;
                const accessToken = _.get(res, 'payload.accessToken', '');
                Utils.saveAccessToken(accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return APIClient(originalRequest);
            } catch {
                Utils.clearAllSavedData();
                Utils.redirect('/');
            }
        } else {
            return Promise.reject({
                status: error?.response?.status || 500,
                message:
                    error?.response?.data?.message || 'Oops! Đã xảy ra lỗi!'
            });
        }
    }
);

export default APIClient;
