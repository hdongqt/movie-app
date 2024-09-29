import { ISelect } from '@/Interfaces/Select.interface';

const yearsArray = Array.from(
    { length: new Date().getFullYear() - 1899 },
    (_, index) => new Date().getFullYear() - index
);

const YEAR_SELECT_LIST: ISelect[] = [
    { value: '', label: 'Chọn năm' },
    ...yearsArray.map((year) => {
        return { value: year, label: `${year}` };
    })
];

export { YEAR_SELECT_LIST };
