import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { addPickedNumbers } from '../features/slices/pickerSlice';

const NumberPicker: React.FC = () => {
    const dispatch = useAppDispatch();
    const pickedNumbers = useAppSelector(state => state.picker.selected);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

    const toggleNumber = (number: number) => {
        setSelectedNumbers(prevNumbers =>
            prevNumbers.includes(number)
                ? prevNumbers.filter(n => n !== number)
                : selectedNumbers.length >= 10 ? [...prevNumbers] : [...prevNumbers, number]
        );

        dispatch(addPickedNumbers(number));
        console.log(pickedNumbers);
    };

    return (
        <div className="flex flex-wrap">
            <div className="mb-3">
                <div className="grid gap-x-6 gap-y-2 grid-cols-10 pb-4 border-b-2 border-slate-400">
                    {[...Array(40)].map((_, index) => {
                        const number = index + 1;
                        const isSelected = selectedNumbers.includes(number);
                        return (
                            <button
                                key={number}
                                className={`rounded-full w-10 h-10 text-white ${isSelected ? 'bg-green-500' : 'bg-orange-500'
                                    }`}
                                onClick={() => toggleNumber(number)}
                            >
                                {number}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="">
                <div className="grid gap-x-6 gap-y-2 grid-cols-10">
                    {[...Array(40)].map((_, index) => {
                        const number = index + 41;
                        const isSelected = selectedNumbers.includes(number);
                        return (
                            <button
                                key={number}
                                className={`rounded-full w-10 h-10 text-white ${isSelected ? 'bg-green-500' : 'bg-orange-500'
                                    }`}
                                onClick={() => toggleNumber(number)}
                            >
                                {number}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NumberPicker;
