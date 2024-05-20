import React, { useState } from 'react';

interface Props {
    onEnter: (input: string) => void;
    onClear: () => void;
    onDelete: () => void;
}

const NumberPad: React.FC<Props> = ({ onEnter, onClear, onDelete }) => {
    const [input, setInput] = useState<string>('');

    const handleClick = (value: string | number) => {
        if (value === 'Enter') {
            onEnter(input);
            setInput('');
        } else if (value === 'Clear') {
            onClear();
            setInput('');
        } else if (value === 'X') {
            onDelete();
            setInput(input.slice(0, -1));
        } else {
            setInput(input + value);
        }
    };

    return (
        <div className="mt-4">
            <div className="grid grid-cols-3 gap-5 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'X',].map((value) => (
                    <button
                        key={value}
                        onClick={() => handleClick(value)}
                        className={`p-2 text-center ${value === "X" && 'col-start-3'} ${value === 0 && 'col-start-2'} bg-orange-500 transition-all text-white border-gray-300 rounded-md hover:opacity-75 focus:outline-none`}
                    >
                        {value}
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
                        className="col-span-3 p-2 pl-5 pr-5 text-center bg-orange-500 text-white border border-gray-300 rounded-md hover:opacity-75 transition-all focus:outline-none"
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NumberPad;
