import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addPickedNumbers } from "../features/slices/pickerSlice";

const NumberPicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const pickedNumbers = useAppSelector((state) => state.picker.selected);
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);
  const currentDate = new Date().getTime();

  const toggleNumber = (number: number) => {
    // if (currentDate > ticketExpiry) return;
    dispatch(addPickedNumbers(number));
  };

  return (
    <div className="mr-10">
      <div className="mb-2 flex">
        <div className="grid gap-x-4 z-0 md:gap-y-1 gap-y-2 md:gap-x-8 grid-cols-10 border-b fade-border">
          {[...Array(40)].map((_, index) => {
            const number = index + 1;
            const isSelected = pickedNumbers.includes(number);
            return (
              <button
                style={{
                  backgroundColor: `${isSelected ? "#008000" : "#c2410c"}`,
                }}
                key={number}
                className={`balls rounded-full w-10 h-10 text-white`}
                onClick={() => toggleNumber(number)}
              >
                {number}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex">
        <div className="grid gap-x-4 md:gap-y-1 gap-y-2 md:gap-x-8 grid-cols-10">
          {[...Array(40)].map((_, index) => {
            const number = index + 41;
            const isSelected = pickedNumbers.includes(number);
            return (
              <button
                style={{
                  backgroundColor: `${isSelected ? "#008000" : "#ea580c"}`,
                }}
                key={number}
                className={`balls rounded-full w-10 h-10 text-white`}
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
