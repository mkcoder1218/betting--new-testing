import React from "react";

interface ResultsProp {
  Icon: React.ComponentType;
  isSmall: boolean;
}
const Result: React.FC<ResultsProp> = ({ Icon, isSmall }) => {
  return (
    <div
      className="w-full bg-black text-white text-lg"
      style={{ height: "50vw" }}
    >
      <div className="flex w-full items-center p-5 uppercase gap-4">
        <div className="">
          <Icon isSmall={isSmall} />
        </div>
        <div className="flex-col w-full">
          <p className="" style={{ fontSize: "30px" }}>
            Place
          </p>
          <div className="flex w-full" style={{ fontSize: "20px" }}>
            <p>24/21/2024</p>
            <p>23:23:31</p>
            <p className="flex-1" style={{ fontSize: "20px" }}>
              ID:2121
            </p>
          </div>
        </div>
      </div>
      <div className="borderLine"></div>
      <div className="flex w-full justify-center mt-4 uppercase -mb-10">
        <p>Results</p>
      </div>
      <div
        className="bg-gray-500 h-28 mt-14 ml-10"
        style={{ width: "95%" }}
      ></div>
      <div className="w-full flex justify-center text-sm mt-1">
        <p>Number Of Particepants:</p>
      </div>
    </div>
  );
};

export default Result;
