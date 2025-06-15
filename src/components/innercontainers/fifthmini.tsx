import React, { useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GenerateOption from "../../utils/GenerateOption";
import "./fifthmini.css"; // We'll create this CSS file next
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { addToBetSlip, removeFromBetSlip } from "../../features/slices/pickerSlice";
import { removemessage, setIsClearCircle } from "../../features/slices/gameType";
import { OddNUMBERMap } from "../../utils/odd";

interface FirstMiniProp {
  gameId?: any;
  gameNumber?: any;
  gameIdofBack?: string;
  gameStartTime?: any;
}

function Fifthmini(prop: FirstMiniProp) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoverdclass, sethoverdclass] = useState("hovergreen");
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const betSlip = useAppSelector((state) => state.picker.betSlip);
  const gameStates = useAppSelector((state) => state.game);
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);

  // Define the wheel order and neighbors
  const wheelOrder = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  // Build a map of each number to its position on the wheel
  const wheelPositions = new Map<number, number>();
  wheelOrder.forEach((num, index) => {
    wheelPositions.set(num, index);
  });

  // Function to get neighbor numbers based on wheel position
  const getNeighbors = (number: number): number[] => {
    const position = wheelPositions.get(number);
    if (position === undefined) return [];

    const total = wheelOrder.length;
    const neighbors = [
      wheelOrder[(position - 2 + total) % total],
      wheelOrder[(position - 1 + total) % total],
      number,
      wheelOrder[(position + 1) % total],
      wheelOrder[(position + 2) % total]
    ];

    return neighbors;
  };

  const handleScroll = () => {
    // Just handle scrolling, no need to load more items
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // Calculate a good scroll distance - approximately 5 numbers
  const scrollDistance = 220; // 5 numbers * (40px + 4px margin)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: -scrollDistance,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: scrollDistance,
        behavior: "smooth",
      });
    }
  };

  const checkIsSelected = (stakeInfo: string) => {
    for (let value of betSlip) {
      if (value.stakeInformation === stakeInfo) {
        dispatch(removeFromBetSlip(betSlip.indexOf(value)));
        return true;
      }
    }
    return false;
  };

  const handleNumberClick = (number: number) => {
    const gameCreatedDate = gameStates.game && new Date(gameStates.game?.createdAt);
    const expiryOfGame = gameCreatedDate?.setMinutes(
      gameCreatedDate.getMinutes() + 5
    );
    const startTime = gameStates.game?.startTime + "";
    
    // Get wheel-based neighbors
    const neighbors = getNeighbors(number);
    
    const stakeInfo = `Neighbors of ${number}`;
    
    dispatch(setIsClearCircle(false));
    
    if (!checkIsSelected(stakeInfo)) {
      dispatch(removemessage(!removemessage));
      dispatch(
        addToBetSlip({
          selected: neighbors,
          expiry: expiryOfGame ? expiryOfGame : ticketExpiry,
          stakeInformation: stakeInfo,
          multiplier: OddNUMBERMap.Nei,
          gameId: prop.gameId,
          stake: 10,
          toWin: 10,
          oddType: "Neighbors",
          gameType: "SpinAndWin",
          gameNumber: prop.gameNumber,
          startTime: prop.gameStartTime + "",
        })
      );
    }
  };

  const handleMouseEnter = (number: number) => {
    setHoveredNumber(number);
  };

  const handleMouseLeave = () => {
    setHoveredNumber(null);
  };

  // Check if a number is a neighbor of the hovered number
  const isNeighborOfHovered = (number: number): boolean => {
    if (hoveredNumber === null) return false;
    
    const neighbors = getNeighbors(hoveredNumber);
    return neighbors.includes(number);
  };

  // Custom rendering for numbers to match exact pattern in image
  const renderNumbers = () => {
    const numberElements = [];
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 29, 30, 32, 34];
    
    // Add 0 first (typically green in roulette)
    numberElements.push(
      <div 
        key={0}
        className={`number-item green ${(hoveredNumber === 0 || isNeighborOfHovered(0)) ? 'hovered' : ''}`}
        onClick={() => handleNumberClick(0)}
        onMouseEnter={() => handleMouseEnter(0)}
        onMouseLeave={handleMouseLeave}
      >
        0
      </div>
    );
    
    // Add numbers 1-36
    for (let i = 1; i <= 36; i++) {
      const isRed = redNumbers.includes(i);
      const isHovered = hoveredNumber === i || isNeighborOfHovered(i);
      
      const className = `number-item ${isRed ? 'red' : 'black'} ${isHovered ? 'hovered' : ''}`;
      
      numberElements.push(
        <div 
          key={i}
          className={className}
          onClick={() => handleNumberClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          {i}
        </div>
      );
    }
    
    return numberElements;
  };

  return (
    <div className="neighbors-container">
      <div className="text-sm ml-1 font-light ">NEIGHBORS</div>
      <div className="neighbors-scroll-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          <ChevronLeftIcon />
        </button>
        
        <div className="numbers-container" ref={scrollContainerRef}>
          {renderNumbers()}
        </div>
        
        <button className="scroll-button right" onClick={scrollRight}>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

export default Fifthmini;
