import ToastMessage from './ToastMessage';
import CookieUtils from './CookieUtils';
import ConvertToFile from './ConvertFile';
import HandleUtils from './HandleUntils';
import { redirect } from './Navigation';

export default {
    ...ToastMessage,
    ConvertToFile,
    ...HandleUtils,
    ...CookieUtils,
    redirect
};
