import Utils from '@/Utils';
import React, { useEffect, useRef, useState } from 'react';

interface PropImageInput {
    inputFile: File | null;
    onChangeImage: (file: File | null) => void;
}

const ALLOWED_IMAGE = ['image/jpg', 'image/jpeg', 'image/png'];
const INPUT_ACCEPT = '.png,.jpg,.jpeg';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageInput: React.FC<PropImageInput> = ({ inputFile, onChangeImage }) => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [blob, setBlob] = useState('');

    useEffect(() => {
        if (inputFile) {
            setBlob(URL.createObjectURL(inputFile));
        } else setBlob('');
        return () => {
            URL.revokeObjectURL(blob);
        };
    }, [inputFile]);

    const onFileChange = (newFile: File | undefined) => {
        if (newFile) {
            let messageError = '';
            if (!ALLOWED_IMAGE.includes(newFile.type)) {
                messageError = 'Hình ảnh không đúng định dạng !';
            }
            if (newFile.size > MAX_FILE_SIZE) {
                messageError = 'Hình ảnh quá lớn !';
            }
            if (!messageError) {
                inputFileRef?.current && (inputFileRef.current.value = '');
                onChangeImage(newFile);
            } else {
                Utils.ToastMessage(messageError, 'error');
                onChangeImage(null);
            }
        }
    };

    const handleRemoveFile = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        onChangeImage(null);
    };

    useEffect(() => {
        // Disable open image in new tab
        const handler = (e: Event) => {
            e.preventDefault();
        };

        window.addEventListener('dragover', handler);
        window.addEventListener('drop', handler);

        return () => {
            window.removeEventListener('dragover', handler);
            window.removeEventListener('drop', handler);
        };
    }, []);

    return (
        <div
            style={{
                backgroundImage: `url(${blob})`
            }}
            onDrop={(e) => onChangeImage(e.dataTransfer.files?.[0])}
            onClick={() =>
                inputFileRef?.current && inputFileRef.current?.click()
            }
            className={`${
                blob ? 'before-bg-file' : ''
            } relative min-h-10 cursor-pointer w-full h-full select-none
            bg-no-repeat bg-cover bg-center hover:bg-indigo-300 transition hover:bg-blend-multiply group`}
        >
            {inputFile && (
                <span
                    className="hidden absolute top-1 right-1 w-8 h-8 group-hover:flex items-center justify-center rounded-full text-lg bg-red-600
                     hover:bg-red-500 text-white hover:text-red-100"
                    onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
                        handleRemoveFile(e)
                    }
                >
                    <i className="icon-remove" />
                </span>
            )}
            <input
                ref={inputFileRef}
                onChange={(e) => onFileChange(e?.target?.files?.[0])}
                type="file"
                accept={INPUT_ACCEPT}
                hidden
            />
            <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 transition -translate-y-1/2 flex flex-col items-center
                ${inputFile ? 'invisible group-hover:visible' : ''}
                `}
            >
                <span
                    className="w-12 h-12 flex items-center justify-center rounded-full text-3xl bg-gray-300 text-blue-900
               "
                >
                    <i className="icon-cloud-upload" />
                </span>
                <span
                    className={`mt-1 font-medium transition text-center ${
                        inputFile
                            ? 'text-white drop-shadow-md'
                            : 'text-gray-700 group-hover:text-white'
                    }
                `}
                >
                    Select file or drag here
                </span>
            </div>
        </div>
    );
};

export default ImageInput;
