export interface IConfirmDialog {
    isOpen: boolean;
    message: string;
    state: {
        id: string;
        status: string;
    };
}
