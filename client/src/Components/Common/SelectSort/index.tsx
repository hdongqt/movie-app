import _ from 'lodash';
import React from 'react';
import Select from 'react-select';
import { ISelect } from '@/Interfaces/Select.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';

interface SelectSortProps {
    options: ISelect[];
    value: ISelect | undefined;
    onChange(option: ISelect | null): void;
}

const SelectSort: React.FC<SelectSortProps> = ({
    options,
    value,
    onChange
}: SelectSortProps) => {
    const { themeMode } = useSelector((state: RootState) => state.APP_STATE);
    const customDarkStyles = {
        control: (styles: any) => ({
            ...styles,
            backgroundColor: '#1f2937',
            boxShadow: 'none',
            border: 0
        }),
        option: (styles: any, { isSelected, isFocused }: any) => ({
            ...styles,
            backgroundColor: isSelected
                ? '#596981'
                : isFocused
                ? '#374151'
                : '#374151',
            color: '#fff'
        }),

        singleValue: (provided: any) => ({ ...provided, color: 'white' }),

        menu: (styles: any) => ({
            ...styles,
            backgroundColor: '#374151'
        })
    };
    return (
        <Select
            options={options}
            value={value}
            styles={themeMode === 'dark' ? customDarkStyles : {}}
            onChange={onChange}
            className="mb-3 mt-3"
            menuPosition="fixed"
        />
    );
};

export default SelectSort;
