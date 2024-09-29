import React, { useEffect, useRef, useState } from 'react';

interface ITagInput {
    tags: string[];
    onChange: (lists: string[]) => void;
}

const TagInput: React.FC<ITagInput> = ({ onChange, tags }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState('');

    const [indexExist, setIndexExist] = useState<undefined | Number>(undefined);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            (event.key === 'Enter' || event.key === 'Tab') &&
            inputValue.trim() !== ''
        ) {
            event.preventDefault();
            const newTag = inputValue.trim();
            const findIndexExist = tags.findIndex(
                (tag) => tag.toLowerCase() === newTag.toLowerCase()
            );
            if (findIndexExist < 0) {
                onChange([...tags, newTag]);
                setInputValue('');
            } else setIndexExist(findIndexExist);
        }
        if (event.key === 'Backspace' && inputValue === '') {
            onChange(tags.slice(0, -1));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onChange(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleFocusInput = () => {
        if (inputRef && inputRef?.current) inputRef.current.focus();
    };

    useEffect(() => {
        if (indexExist !== undefined) {
            const timer = setTimeout(() => {
                setIndexExist(undefined);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [indexExist]);

    return (
        <div>
            <div
                onClick={handleFocusInput}
                className="w-full flex items-center flex-wrap rounded-lg border-[1.5px] border-stone-300 pt-3 px-3"
            >
                {tags.map((tag, index) => (
                    <span
                        key={tag + index}
                        className={`rounded-sm text-sm overflow-hidden min-w-2 pl-1.5 mr-1 mb-3 text-black items-center bg-[#e6e6e6] inline-bloc
                    ${index === indexExist ? 'animate-pulse-custom' : ''}
                    `}
                    >
                        {tag}
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTag(tag);
                            }}
                            className="bg-transparent border-none inline-block h-full ml-2 px-1.5 cursor-pointer text-lg hover:bg-red-200 font-medium hover:text-red-600"
                        >
                            &times;
                        </span>
                    </span>
                ))}
                <input
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={`${
                        tags.length < 1 ? 'w-full' : 'w-16'
                    } text-gray-800 outline-none border-none mb-3`}
                />
            </div>
            <p className="text-sm text-gray-600 pt-1 font-medium">
                Nhập dữ liệu và nhấn Enter hoặc Tab để thêm
            </p>
        </div>
    );
};

export default TagInput;
