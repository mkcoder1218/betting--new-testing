import React from "react";
import generatehover from "./generatehover";
import Circle from "../components/svg/circle";
import { useState, useEffect } from "react";
import Fourrowhover from "../components/svg/fourrowhover";
import Fourrow from "../components/svg/Fourrow";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addToBetSlip } from "../features/slices/pickerSlice";
import { Market, GameData } from "../features/slices/RacingGameSlice";
import { setIsClearCircle } from "../features/slices/gameType";
import { DispatchParams } from "../ui/Table";
import { OddNUMBERMap } from "./odd";

type ElementTag = keyof JSX.IntrinsicElements;

/*this object declaire numbers of diffrent color*/
const specialNumbers = {
  orangespecial: [32, 15, 19, 4, 21, 2],
  bluespecial: [25, 17, 34, 6, 27, 13],
  rosespecial: [36, 11, 30, 8, 23, 10],
  greenspecial: [5, 24, 16, 33, 1, 20],
  yellowspecial: [14, 31, 9, 22, 18, 29],
  whitespecial: [7, 28, 12, 35, 3, 26],
  firstRownumbers: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  secRownumbers: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  therdRownumbers: [3, 6, 9, 12, 15, 18, 21, 24, 27, 28, 30, 33, 36],
};
const CollactionNumbers = {
  0: 37,
  1: 15,
  2: 19,
  3: 4,
  4: 21,
  5: 2,
  6: 25,
  7: 17,
  8: 34,
  9: 6,
  10: 27,
  11: 13,
  12: 36,
  13: 11,
  14: 30,
  15: 8,
  16: 23,
  17: 10,
  18: 5,
  19: 24,
  20: 16,
  21: 33,
  22: 1,
  23: 20,
  24: 14,
  25: 31,
  26: 9,
  27: 22,
  28: 18,
  29: 29,
  30: 7,
  31: 28,
  32: 12,
  33: 35,
  34: 3,
  35: 26,
  36: 0,
  37: undefined,
};
const GenerateOption = (
  element: ElementTag,
  start: number,
  number: number,
  hoveredClass: string,
  gameId?: any,
  currentgameNumber?: any,
  sethoverdclass: (className: string) => void
): JSX.Element[] => {
  const result = [];
  const [hoverCircles, setHoverCircles] = useState<boolean[]>(
    Array.from({ length: number - start + 1 }, () => false)
  );
  const [circles, setCircles] = useState<boolean[]>(
    Array.from({ length: number - start + 1 }, () => false)
  );
  const dispatch = useAppDispatch();
  const IsCircle = useAppSelector((state) => state.gameType.isClearCircle);

  useEffect(() => {
    if (IsCircle) setCircles([]); // Run once when IsCircle changes
  }, [IsCircle, setCircles]);

  let className;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const CollactionNumbersMap = new Map<number, number>(
    Object.entries(CollactionNumbers).map(([key, value]) => [
      parseInt(key, 10),
      value,
    ])
  );

  const handlefindindex = (index: number) => {
    const keyForValue = Array.from(CollactionNumbersMap.entries()).find(
      ([, value]) => value === index
    )?.[0];

    return keyForValue;
  };
  const handleClickofNumber = (
    i: number,
    stake: number[],
    Multiplier: number,
    selected: string,
    stakeInfo: string,
    oddType?: string
  ) => {
    const number1 = handlefindindex(i);
    const number2 = handlefindindex(i + 1);
    const number3 = handlefindindex(i + 2);
    const number4 = handlefindindex(i - 1);
    const number5 = handlefindindex(i - 2);
    dispatch(setIsClearCircle(false));
    dispatch(
      addToBetSlip({
        selected: [number1, number2, number3, number4, number5],
        stakeInformation: stakeInfo,
        multiplier: OddNUMBERMap.Nei,
        gameId: gameId,
        stake: stake,
        oddType: oddType,
        gameType: "Neighbors",
        gameNumber: currentgameNumber,
      })
    );
  };
  for (let i = 0; i < number; i++) {
    const handleMouseEnterbottom = (index: number) => {
      setHoverIndex(index);
    };

    const handleMouseLeavebottom = () => {
      setHoverIndex(null);
    };
    if (i == 0) {
      className = "green";
    }
    if (i <= 10 && i > 0) {
      className = i % 2 === 0 ? "black " : "Red";
    }
    if (i >= 11 && i <= 19) {
      className = i % 2 === 0 ? "Red" : "black";
    }
    if (i >= 20 && i <= 28) {
      className = i % 2 === 0 ? "black" : "Red";
    }
    if (i >= 29 && i <= 36) {
      className = i % 2 === 0 ? "Red " : "black";
    }

    const isHovered =
      (hoverIndex !== null &&
        hoverIndex === CollactionNumbersMap.get(handlefindindex(i))) ||
      hoverIndex === CollactionNumbersMap.get(handlefindindex(i) - 1) ||
      hoverIndex === CollactionNumbersMap.get(handlefindindex(i) + 1) ||
      hoverIndex === CollactionNumbersMap.get(handlefindindex(i) - 2) ||
      hoverIndex === CollactionNumbersMap.get(handlefindindex(i) + 2);

    const combinedClass = `${className} ${isHovered ? hoveredClass : ""}`;

    result.push(
      React.createElement(
        element,
        {
          key: i,
          className: combinedClass,
          onMouseEnter: () => {
            handleMouseEnterbottom(i);
          },
          onMouseLeave: handleMouseLeavebottom,
          onClick: () => {
            handleClickofNumber(i, OddNUMBERMap.Nei, 10, "1st 12", "Neighbors");
          },
        },
        i.toString(),
        circles[i - start] && <Circle />,
        hoverCircles[i - start] && (
          <Fourrowhover
            row1={i > 3 ? 3 : i == 1 ? 2 : 1}
            row2={2}
            row3={i >= 34 ? 0 : 3}
            i={i}
          />
        )
      )
    );
  }
  return result;
};

export const GenerateOption2 = (
  element: ElementTag,
  start: number,
  number: number,
  gameId?: any,
  gameNumber?: any
): JSX.Element[] => {
  const result = [];
  const dispatch = useAppDispatch();
  const IsCircle = useAppSelector((state) => state.gameType.isClearCircle);
  const [circles, setCircles] = useState<boolean[]>(
    Array.from({ length: number - start + 1 }, () => false)
  );
  useEffect(() => {
    if (IsCircle) setCircles([]); // Run once when IsCircle changes
  }, [IsCircle, setCircles]);
  const [hoverCircles, setHoverCircles] = useState<boolean[]>(
    Array.from({ length: number - start + 1 }, () => false)
  );
  for (let i = number; i >= start; i--) {
    var className = "";
    var containerclassName = "";
    var specialclassName = "";
    const isFirstrow = specialNumbers.firstRownumbers.includes(i);
    const issecondrow = specialNumbers.secRownumbers.includes(i);
    const isThirdrow = specialNumbers.therdRownumbers.includes(i);

    const handleclick = (index: number, i: number, param: DispatchParams) => {
      const newCircles = [...circles];
      newCircles[index] = !newCircles[index];
      setCircles(newCircles);
      dispatch(setIsClearCircle(false));
      dispatch(
        addToBetSlip({
          selected: [i],
          stakeInformation: "Win",
          multiplier: OddNUMBERMap.Win,
          gameId: gameId,
          stake: 10,
          toWin: 10,
          oddType: "Win",
          gameNumber: gameNumber,
        })
      );
    };
    const handleMouseEnter = (index: number) => {
      const newHoverCircles = Array(number - start + 1).fill(false);
      if (i) {
        newHoverCircles[index] = true;
        setHoverCircles(newHoverCircles);
      }
    };
    const handleMouseLeave = () => {
      setHoverCircles(Array(number - start + 1).fill(false));
    };
    if (i <= 10) {
      className =
        i % 2 === 0
          ? "black blackhover h-full relative"
          : "Red relative redhover";
    } else if (i >= 11 && i <= 19) {
      className =
        i % 2 === 0 ? "Red redhover relative" : "black relative blackhover";
    } else if (i >= 20 && i <= 28) {
      className =
        i % 2 === 0 ? "black blackhover relative" : "Red relative redhover";
    } else if (i >= 29 && i <= 36) {
      className =
        i % 2 === 0 ? "Red redhover relative" : "black relative blackhover";
    }

    const isorange = specialNumbers.orangespecial.includes(i);
    const isblue = specialNumbers.bluespecial.includes(i);
    const isrose = specialNumbers.rosespecial.includes(i);
    const isgreen = specialNumbers.greenspecial.includes(i);
    const isyellow = specialNumbers.yellowspecial.includes(i);
    const iswhite = specialNumbers.whitespecial.includes(i);
    containerclassName = isFirstrow
      ? "first-row h-1/3 relative"
      : issecondrow
      ? "second-row h-1/3 relative"
      : isThirdrow
      ? "third-row h-1/3 relative"
      : "";

    specialclassName = isorange
      ? "orangenumber relative"
      : isblue
      ? "bluenumber relative"
      : isrose
      ? "rosenumber relative"
      : isgreen
      ? "greennumber relative"
      : isyellow
      ? "yellownumber relative"
      : iswhite
      ? "whitenumber relative"
      : "";

    const combinedClass = `${specialclassName} ${className}`;
    result.push(
      <div className={containerclassName}>
        {React.createElement(
          element,
          {
            className: combinedClass,
            onClick: () => handleclick(i - start, i),
            onMouseEnter: () => handleMouseEnter(i - start),
            onMouseLeave: handleMouseLeave,
          },
          i.toString(),
          circles[i - start] && <Circle margin={true} />,
          hoverCircles[i - start] && (
            <Fourrowhover
              row1={i > 3 ? 3 : i == 1 ? 2 : 1}
              row2={2}
              row3={i >= 34 ? 0 : 3}
              i={i}
            />
          )
        )}
      </div>
    );
  }

  return result;
};

export default GenerateOption;
