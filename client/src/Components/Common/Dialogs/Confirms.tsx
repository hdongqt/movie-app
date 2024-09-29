import { IConfirmDialog } from '@/Interfaces/ConfirmDialog.interface';
import CustomModal from '../CustomModal';

const Confirm = (props: {
    title?: string;
    callback?(): void;
    confirm: IConfirmDialog;
    onCancel: () => void;
}) => {
    const {
        callback,
        confirm,
        onCancel,
        title = 'Bạn chắc chắn chưa?'
    } = props;

    const onSubmit = () => {
        if (callback) callback();
    };

    return (
        <CustomModal
            isLoading={false}
            isOpen={confirm.isOpen}
            title={
                <span className="flex items-center gap-3 pr-3">
                    <span className="border-2 text-yellow-500 border-yellow-500 text-2xl p-3 w-9 h-9 rounded-full flex items-center justify-center">
                        <i className="icon-exclamation" />
                    </span>
                    <span className="text-xl">{title}</span>
                </span>
            }
            onClose={onCancel}
            actionButton={[
                {
                    name: 'Đồng ý',
                    classFirst: 'bg-green-600 hover:bg-green-700',
                    onClickAction: onSubmit
                }
            ]}
        >
            <p className="text-lg text-gray-700 font-medium min-w-72">
                {confirm?.message}
            </p>
        </CustomModal>
    );
};

export default Confirm;
