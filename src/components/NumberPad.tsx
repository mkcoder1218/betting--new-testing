import React, { useState } from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";

interface Props {
    onInput: (input: number | null, type: string) => void;
    onSubmit: (input: string) => void;
}

const NumberPad: React.FC<Props> = ({ onSubmit, onInput }) => {
    const [input, setInput] = useState<string>('');

    const handleClick = (value: string | number) => {
        if (value === 'Enter') {
            onSubmit(input);
            setInput('');
        } else if (value === 'Clear') {
            setInput('');
            onInput(null, "removeAll")
        } else if (value === 'X') {
            setInput(input.slice(0, -1));
            onInput(null, "remove")
        } else {
            typeof value === "number" && onInput(value, "add")
        }
    };

    return (
        <div className="mt-4">
            <div className="grid grid-cols-3 gap-5 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'L', 0, 'X',].map((value) => (
                    <button
                        key={value}
                        onClick={() => handleClick(value)}
                        className={`p-2 flex items-center justify-center text-center bg-green-500 transition-all text-white border-gray-300 rounded-md hover:opacity-75 focus:outline-none`}
                    >
                        {value === "X" ? <MdOutlineKeyboardBackspace size={24} color='white' /> : value}
                    </button>
                ))}
                <div className='col-span-3 flex items-center justify-between'>
                    <button
                        onClick={() => handleClick('Clear')}
                        className="col-span-3 p-2 pl-8 pr-8 text-center bg-slate-200 border border-gray-300 rounded-md hover:bg-opacity-75 transition-all focus:outline-none"
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => handleClick('Enter')}
                        className="col-span-3 p-2 pl-5 pr-5 text-center bg-green-500 text-white border border-gray-300 rounded-md hover:opacity-75 transition-all focus:outline-none"
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NumberPad;
