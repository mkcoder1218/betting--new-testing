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
    <div className="flex justify-center w-full ml-3">
      <div className="flex flex-col items-center w-full">
        <div className="mb-2 w-full flex justify-center">
          <div className="grid gap-x-2 z-0 gap-y-2 grid-cols-5 sm:grid-cols-8 md:grid-cols-10 md:gap-x-9 md:gap-y-1 border-b fade-border">
            {[...Array(40)].map((_, index) => {
              const number = index + 1;
              const isSelected = pickedNumbers.includes(number);
              return (
                <button
                  style={{
                    backgroundColor: `${isSelected ? "#008000" : "#c2410c"}`,
                  }}
                  key={number}
                  className={`balls rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white text-sm md:text-base`}
                  onClick={() => toggleNumber(number)}
                >
                  {number}
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="grid gap-x-2 gap-y-2 grid-cols-5 sm:grid-cols-8 md:grid-cols-10 md:gap-x-9 md:gap-y-1">
            {[...Array(40)].map((_, index) => {
              const number = index + 41;
              const isSelected = pickedNumbers.includes(number);
              return (
                <button
                  style={{
                    backgroundColor: `${isSelected ? "#008000" : "#ea580c"}`,
                  }}
                  key={number}
                  className={`balls rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white text-sm md:text-base`}
                  onClick={() => toggleNumber(number)}
                >
                  {number}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberPicker;
