export interface IMenuTableClick {
    [key: string]: (data?: any) => void;
}

export interface ITableColumn {
    key: string;
    header: string;
    classHeaderFirst?: string;
    classRowFirst?: string;
    width?: number;
    render?: (row: any, menuClick?: IMenuTableClick) => React.ReactNode;
}
