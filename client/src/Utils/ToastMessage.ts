import { toast } from 'react-toastify';

type ITypeError = 'error' | 'success' | 'warning' | 'info';

const ToastMessage = (message: string, type: ITypeError) => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
        case 'error':
            toast.error(message);
            break;
        default:
            toast.info(message);
    }
};

export default { ToastMessage };
