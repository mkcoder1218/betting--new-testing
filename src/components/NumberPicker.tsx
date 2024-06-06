import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { addPickedNumbers } from '../features/slices/pickerSlice';

const NumberPicker: React.FC = () => {
    const dispatch = useAppDispatch();
    const pickedNumbers = useAppSelector(state => state.picker.selected);
    const ticketExpiry = useAppSelector(state => state.expiry.expiry);
    const currentDate = new Date().getTime();

    const toggleNumber = (number: number) => {
        if (currentDate > ticketExpiry) return;

        dispatch(addPickedNumbers(number));
    };

    return (
        <div className="mr-10 basis-5/6">
            <div className="mb-3">
                <div className="grid gap-x-8 gap-y-2 grid-cols-10 pb-4 border-b-2 border-red-400">
                    {[...Array(40)].map((_, index) => {
                        const number = index + 1;
                        const isSelected = pickedNumbers.includes(number);
                        return (
                            <button
                                style={{
                                    backgroundColor: `${isSelected ? '#008000' : '#c2410c'
                                        }`
                                }}
                                key={number}
                                className={`rounded-full w-10 h-10 text-white`}
                                onClick={() => toggleNumber(number)}
                            >
                                {number}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="">
                <div className="grid gap-x-8 gap-y-2 grid-cols-10">
                    {[...Array(40)].map((_, index) => {
                        const number = index + 41;
                        const isSelected = pickedNumbers.includes(number);
                        return (
                            <button
                                style={{
                                    backgroundColor: `${isSelected ? '#008000' : '#ea580c'
                                        }`
                                }}
                                key={number}
                                className={`rounded-full w-10 h-10 text-white`}
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
