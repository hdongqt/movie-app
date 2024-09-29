import { ISignInPayload, ISignUpPayload } from '@/Interfaces/Auth.interface';
import APIClient from '../Client/APIClient';
import { API } from '@/Constants';
const { AUTH } = API;

const signUp = async (payload: ISignUpPayload) => {
    return APIClient.post(AUTH.SIGN_UP, payload);
};

const signIn = async (payload: ISignInPayload) => {
    return APIClient.post(AUTH.SIGN_IN, payload);
};

const getInfo = async () => {
    return APIClient.get(AUTH.GET_INFO);
};

const logOut = async (token: string) => {
    return APIClient.post(AUTH.LOG_OUT, {
        refreshToken: token
    });
};

const refreshToken = async (token: string) => {
    return APIClient.post(AUTH.REFRESH_TOKEN, {
        refreshToken: token
    });
};

export default { signUp, signIn, getInfo, logOut, refreshToken };
