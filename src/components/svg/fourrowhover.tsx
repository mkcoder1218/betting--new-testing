import React from "react";
import Circle from "@mui/icons-material/Circle";
import { mappedSpinhover } from "../../utils/mappedSpinhover";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { addToBetSlip } from "../../features/slices/pickerSlice";
import { OddNUMBERMap } from "../../utils/odd";
import { removemessage } from "../../features/slices/gameType";
import generatehover, { disablehover } from "../../utils/generatehover";

interface Rows {
  row1: number;
  row2: number;
  row3: number;
  i: number;
  gameNumber?: string;
  gameStartTime?: string;
  gameId?: string;
  gameState?: any;
  betSlip?: any;
}

interface ClickableCircleProps {
  numbers: number[];
  position: string;
  mainNumber: number;
  gameNumber?: string;
  gameStartTime?: string;
  gameId?: string;
  gameState?: any;
  betSlip?: any;
}


// Component for a single clickable circle
const ClickableCircle: React.FC<ClickableCircleProps> = ({ numbers, position, mainNumber, gameNumber, gameStartTime, gameId, betSlip }) => {
  const dispatch = useAppDispatch();
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);
  const gameState = useAppSelector((state) => state.game);
  const handleCircleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removemessage(true));
    dispatch(
      addToBetSlip({
        selected: numbers,
        expiry: ticketExpiry,
        stakeInformation: `Neighbors`,
        multiplier: OddNUMBERMap.Nei,
        gameId: gameId,
        stake: 10,
        toWin: 10 ,
        oddType: "Win",
        gameNumber:parseInt(gameNumber||'0'),
        gameType: "SpinAndWin",
        startTime: gameStartTime||"",
      })
    );
  };

  // Highlight all numbers in the hover group
  const handleMouseEnter = () => {
    numbers.forEach(num => {
      if (num >= 0 && num <= 36) {
        // Simple approach: directly target the element containing the number
        const allElements = document.querySelectorAll('p');
        allElements.forEach(el => {
          if (el.textContent === num.toString()) {
            el.classList.add('greenhover');
          }
        });
      }
    });
  };

  const handleMouseLeave = () => {
    // Remove highlights when mouse leaves
    numbers.forEach(num => {
      if (num >= 0 && num <= 36) {
        // Simple approach: directly target the element containing the number
        const allElements = document.querySelectorAll('p');
        allElements.forEach(el => {
          if (el.textContent === num.toString()) {
            el.classList.remove('greenhover');
          }
        });
      }
    });
  };

  return (
    <div 
      className="hover-circle-container" 
      onClick={handleCircleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Circle className="hover-circle" />
    </div>
  );
};

function fourrowhover(Prop: Rows) {
  const positionData = mappedSpinhover[Prop.i];

  if (!positionData) {
    return null;
  }

  // Special layout for zero
  if (Prop.i === 0) {
    console.log('numbers',Prop.gameNumber,Prop.gameStartTime,Prop.gameId)

    return (
      <div className="svg_container zero_container mr-2.5">
        <div className="right_circles ">
          {/* Four circles in a vertical line on the right */}
          <ClickableCircle  numbers={[0,3]} position="top" mainNumber={0} gameNumber={Prop.gameNumber} gameStartTime={Prop.gameStartTime} gameId={Prop.gameId} />
          <ClickableCircle numbers={[0,2]} position="middle_top" mainNumber={0} gameNumber={Prop.gameNumber} gameStartTime={Prop.gameStartTime} gameId={Prop.gameId}  />
          <ClickableCircle numbers={[0,1]} position="middle_bottom" mainNumber={0} gameNumber={Prop.gameNumber} gameStartTime={Prop.gameStartTime} gameId={Prop.gameId}  />
          <ClickableCircle numbers={[0,1,2,3]} position="bottom" mainNumber={0} gameNumber={Prop.gameNumber} gameStartTime={Prop.gameStartTime} gameId={Prop.gameId}  />
        </div>
      </div>
    );
  }

  return (
    <div className="svg_container">
      <div
        className={`firstrow_circle ${
          Prop.i === 1 ?"mt-6":Prop.i === 2 || Prop.i === 3 ? "mt-8" : ""
        } ${Prop.i >= 34 ? "-ml-5" : ""} `}
      >
        {positionData.left_top && (
          <ClickableCircle 
            gameNumber={Prop.gameNumber}
            gameStartTime={Prop.gameStartTime}
            gameId={Prop.gameId}
            numbers={positionData.left_top} 
            position="left_top" 
            mainNumber={Prop.i}
          />
        )}
        {positionData.left_middle && (
          <ClickableCircle 
            gameNumber={Prop.gameNumber}
            gameStartTime={Prop.gameStartTime}
            gameId={Prop.gameId}
            numbers={positionData.left_middle} 
            position="left_middle" 
            mainNumber={Prop.i}
          />
        )}
        {positionData.left_bottom && (
          <ClickableCircle 
            gameNumber={Prop.gameNumber}
            gameStartTime={Prop.gameStartTime}
            gameId={Prop.gameId}
            numbers={positionData.left_bottom} 
            position="left_bottom" 
            mainNumber={Prop.i}
          />
        )}
      </div>
      <div className="secondrow_circle">
        {positionData.middle_top && (
          <ClickableCircle 
            gameNumber={Prop.gameNumber}
            gameStartTime={Prop.gameStartTime}
            gameId={Prop.gameId}
            numbers={positionData.middle_top} 
            position="middle_top" 
            mainNumber={Prop.i}
          />
        )}
        {positionData.middle_bottom && (
          <ClickableCircle 
            gameNumber={Prop.gameNumber}
            gameStartTime={Prop.gameStartTime}
            gameId={Prop.gameId}
            numbers={positionData.middle_bottom} 
            position="middle_bottom" 
            mainNumber={Prop.i}
          />
        )}
      </div>
      <div
        className={`thirdrow_circle ${
          Prop.i === 0 ? "-ml-1 flex flex-col gap-5" : ""
        }`}
      >
        {positionData.right_top && (
          <ClickableCircle 
            gameNumber={Prop.gameNumber}
            gameStartTime={Prop.gameStartTime}
            gameId={Prop.gameId}
            numbers={positionData.right_top} 
            position="right_top" 
            mainNumber={Prop.i}
          />
        )}
        {positionData.right_middle && (
          <ClickableCircle 
            gameNumber={Prop.gameNumber}
            gameStartTime={Prop.gameStartTime}
            gameId={Prop.gameId}
            numbers={positionData.right_middle} 
            position="right_middle" 
            mainNumber={Prop.i}
          />
        )}
        {positionData.right_bottom && (
          <ClickableCircle 
            gameNumber={Prop.gameNumber}
            gameStartTime={Prop.gameStartTime}
            gameId={Prop.gameId}
            numbers={positionData.right_bottom} 
            position="right_bottom" 
            mainNumber={Prop.i}
          />
        )}
      </div>
    </div>
  );
}

export default fourrowhover;
