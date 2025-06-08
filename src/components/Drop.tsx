import React, { useEffect, useState, useCallback } from "react";
import StartTimer from "../ui/StartTimer";
import IdandPlace from "../ui/IdandPlace";
import PlusMinus from "../ui/PlusMinus";
import BasicTable from "../ui/Table";
import Message from "../ui/Message";
import HeadToHead from "../ui/HeadtoHead";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { fetchEventDetail, GameData } from "../features/slices/RacingGameSliceMultipleSports";

// Define RootEventData interface locally since the import has issues
interface RootEventData {
  Race?: {
    Name: string;
    Distance: number;
    Entries?: any[];
  };
  Number: number;
  eventDetail?: any;
  ID: string;
}


interface DropProp {
  id: string;
  time: string;
  place: string;
  activeIndexValues?: number;
  Headtext?: string;
  gameData?: GameData;
  data: RootEventData;
  isActiveGame: boolean;
  isLiveGame: boolean;
  liveGameId?:string;
  index: number;
  isPastGame?: boolean;
  gameNumber?: number;
  WhichGameSelected: string;
  isActiveClicked: (activated: boolean) => void;
  // New props for preserving selections
  // makeActiveFetch?:(gameId:string,gameType:string)=>void,
  savedSelections?: number[];
  isExpanded?: boolean;
  onSelectionsChange?: (selections: number[]) => void;
  onTimerEnd?: () => void; // Add callback for when timer reaches 0
}

const Drop: React.FC<DropProp> = ({
  id,
  time,
  place,
  // makeActiveFetch,
  activeIndexValues,
  index,
  Headtext,
  gameData,
  data,
  isLiveGame,
  liveGameId,
  isActiveGame = false,
  isPastGame = false,
  gameNumber,
  isActiveClicked,
  // New props with defaults
  savedSelections = [],
  isExpanded = false,
  onSelectionsChange = () => {},
  onTimerEnd,
}) => {
  // Optimized state management - consolidate related states
  const [isActive, setIsActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [selectCombo, setSelectCombo] = useState<number[]>(savedSelections || []);
  const [BankClick, setBankclick] = useState<number | undefined>(undefined);
  const [ClearTheClick, setClear] = useState(false);
  const [activeGameForIcon, setActiveGame] = useState(isExpanded || false);
  const dispatch=useAppDispatch()
  // Initialize active table buttons from saved selections
  const [isActivedtableButton, setisActivedTableButton] = useState<Set<number>>(() => {
    const set = new Set<number>();
    if (savedSelections?.length > 0) {
      savedSelections.forEach((num) => set.add(num));
      // Use setTimeout to avoid state update during render
      setTimeout(() => {
        setClickCount(savedSelections.length);
      }, 0);
    }
    return set;
  });

  // Memoized selectors to prevent unnecessary re-renders
  const isClearSelection = useAppSelector((state) => state.gameType.ClearSelected);

  // Update active state based on isExpanded prop
  useEffect(() => {
    setIsActive(isExpanded);
    setActiveGame(isExpanded);
    if(isExpanded){
         dispatch(fetchEventDetail(gameData?.id||'', gameData?.gameType||''))
        }
  }, [isExpanded]);

  // Optimized event handlers with useCallback to prevent unnecessary re-renders
  const handleClick = useCallback(() => {


    setIsActive(prev => {
      const newActiveState = !prev;
      setActiveGame(newActiveState);
      isActiveClicked(newActiveState);
      return newActiveState;
    });
  }, [isActiveClicked]);

  const handleClickCount = useCallback((val: number) => {
    setClickCount(val);
    setClear(false);
  }, []);

  const handleLive = useCallback((val: boolean) => {
    // This function was referencing a non-existent state variable
    // If needed, add the state variable or remove this function
    console.log('Live state:', val);
  }, []);

  const handleClear = useCallback(() => {
    // Clear only this drop's local state
    setClear(true);
    setisActivedTableButton(new Set());
    setBankclick(undefined);
    setSelectCombo([]);
    onSelectionsChange([]); // Update parent with empty selections

    // Create a custom event to notify that only this drop's selections should be cleared
    // We'll include the drop's ID to identify which drop's selections to clear
    const event = new CustomEvent('clearDropSelections', {
      detail: {
        dropId: id, // Include the drop's ID to identify which drop to clear
        gameNumber: gameNumber
      }
    });
    document.dispatchEvent(event);

    // Dispatch a custom action to remove betslip items for this specific game
    // This avoids the need to access betSlip state directly in the component
    if (gameNumber) {
      // Create a custom event that the BetSlip component can listen to
      const clearBetSlipEvent = new CustomEvent('clearBetSlipForGame', {
        detail: { gameNumber }
      });
      document.dispatchEvent(clearBetSlipEvent);
    }

    // Log the action for debugging
    console.log('Clearing selections for drop:', id, 'game number:', gameNumber);
  }, [id, gameNumber, onSelectionsChange]);

  const handleSelectCombo = useCallback((index: number) => {
    const newSelectCombo = [...selectCombo, index];
    setSelectCombo(newSelectCombo);
    onSelectionsChange(newSelectCombo); // Notify parent of selection change
  }, [selectCombo, onSelectionsChange]);

  const handleColorChange = useCallback((index: number) => {
    setisActivedTableButton((prevActiveButtons) => {
      const updatedButtons = new Set(prevActiveButtons);

      // Normal toggle behavior
      if (updatedButtons.has(index)) {
        updatedButtons.delete(index);
      } else {
        updatedButtons.add(index);
      }

      // Update parent with new selections
      const newSelections = Array.from(updatedButtons);
      setTimeout(() => onSelectionsChange(newSelections), 0);

      return updatedButtons;
    });
  }, [onSelectionsChange]);

  const HandleBankClick = useCallback((index: number) => {
    setBankclick(index);
  }, []);

  // Listen for the removeSelection and clearAllSelections custom events
  useEffect(() => {
    // Function to handle the removeSelection event
    const handleRemoveSelection = (event: any) => {
      const { buttonIndex, buttonType, rowIndex, isSingleSelection, removeRelatedCombo, gameNumber: eventGameNumber } = event.detail;

      // Only process the event if it's for this drop's game number
      if (buttonIndex >= 0 && eventGameNumber === gameNumber) {
        // Remove the specific button from the active buttons
        setisActivedTableButton((prevActiveButtons) => {
          const updatedButtons = new Set(prevActiveButtons);
          updatedButtons.delete(buttonIndex);

          // Update parent with new selections
          const newSelections = Array.from(updatedButtons);
          setTimeout(() => onSelectionsChange(newSelections), 0);

          return updatedButtons;
        });

        // If this is a single selection removal (from betslip)
        if (isSingleSelection) {
          // If it's the first selection (bank), update the bank selection
          if (rowIndex === BankClick) {
            setBankclick(undefined);
          }

          // Update the combo selections
          setSelectCombo(prev => prev.filter(item => item !== rowIndex));
        }

        // Log the removal for debugging
        console.log('Drop component removed selection:', {
          buttonIndex,
          buttonType,
          rowIndex,
          isSingleSelection,
          removeRelatedCombo,
          gameNumber: eventGameNumber,
          dropGameNumber: gameNumber,
          currentComboSelections: selectCombo
        });
      }
    };

    // Function to handle clearing all selections
    const handleClearAllSelections = () => {
      // Clear all selections
      setisActivedTableButton(new Set());
      setBankclick(undefined);
      setSelectCombo([]);
      setClear(true);
      onSelectionsChange([]); // Update parent with empty selections

      console.log('Cleared all selections from Drop component');
    };

    // Add event listeners
    document.addEventListener('removeSelection', handleRemoveSelection);
    document.addEventListener('clearAllSelections', handleClearAllSelections);

    // Clean up
    return () => {
      document.removeEventListener('removeSelection', handleRemoveSelection);
      document.removeEventListener('clearAllSelections', handleClearAllSelections);
    };
  }, [onSelectionsChange, BankClick]);

  useEffect(() => {
    // This effect was used to set visibility state which is no longer needed
    // The visibility is now controlled by clickCount and isActivedtableButton.size
  }, [clickCount]);

  // Optimized useEffect for clear selection
  useEffect(() => {
    if (isClearSelection) {
      setClear(true);
      setisActivedTableButton(new Set());
      setBankclick(undefined);
      setSelectCombo([]);
      onSelectionsChange([]); // Update parent with empty selections
    }
  }, [isClearSelection, onSelectionsChange]);

  // Remove the local loading state management as it will be handled at the application level

  useEffect(() => {
    setActiveGame(isActiveGame);
   
  }, [isActiveGame]);

useEffect(()=>{
  if(isLiveGame)
         dispatch(fetchEventDetail(gameData?.id||'', gameData?.gameType||''))
},[isLiveGame])

  return (
    <div className="DropContainer w-full max-w-full">
      <div
        className="container w-full"
        style={{
          backgroundColor: isPastGame
            ? "#a81005"
            : isActiveGame
            ? "#37b34a"
            : "transparent",
          color: isPastGame || isActiveGame ? "white" : "",
        }}
      >
        <div className="timePlace">
          <StartTimer
            text={time}
            onLive={handleLive}
            isgameActive={isActiveGame}
            isActive={isActiveGame}
            isPastGame={isPastGame}
            onTimerEnd={onTimerEnd}
          />
          <IdandPlace
            Place={place}
            Id={id}
            isActive={isActiveGame}
            isPastGame={isPastGame}
          />
        </div>
        <PlusMinus
          onClick={handleClick}
          isActive={isActive}
          isActiveGame={isActiveGame}
          isPastGame={isPastGame}
        />
      </div>
      {(isActive || activeGameForIcon) && data ? (
        <div className="container2 flex flex-col md:flex-row  pb-3 gap-2 w-full">
          <div className="w-full md:w-[80%]">
            {activeIndexValues !== 1 || isActiveGame ? (
              <BasicTable
                selectedCombos={handleSelectCombo}
                clickCount={handleClickCount}
                isClear={ClearTheClick}
                isActivatedtablebutton={isActivedtableButton}
                handleColorChange={handleColorChange}
                handleBankColorChange={HandleBankClick}
                isActiveBank={BankClick}
                HeadTexttoTable={Headtext}
                data={data as any}
                gameDatalist={gameData as any}
                isActiveGame={isActiveGame}
                isPastGame={isPastGame}
              />
            ) : activeIndexValues === 1 ? (
              <HeadToHead />
            ) : (
              ""
            )}
          </div>

          <div
            className={`${
              clickCount > 1 && activeIndexValues === 0 ? "miniContainer" : ""
            } w-full max-w-[25%] min-w-[25%] md:w-[20%]`}
          >
            {clickCount === 1 || isActivedtableButton.size === 1 ? (
              <div className="flex-col Need ml-1 text-md mt-4 md:mt-16 text-black">
                <Message text="Need a minimum of two selections to create a combo" />
                <button
                  className="flex items-center justify-center px-3 mt-2 py-1 bg-[#ff6b6b] text-white font-medium"
                  onClick={() => {
                    // Call handleClear which now also clears the bet slip
                    handleClear();
                    setClickCount(0);
                  }}
                >
                  <span>CLEAR</span>
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="10" height="30" viewBox="0 0 24 24">
                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z" fill="white"></path>
                  </svg>
                </button>
              </div>
            ) :  (
              <div className={`NeedQ flex flex-col w-full ${isActivedtableButton.size >= 1 ? "opacity-100" : "opacity-0"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-full mb-2">
                  <div
                    className="bg-[#09b517] text-white p-1 text-center min-w-fit min-h-fit flex !px-2 flex-col items-center justify-center  cursor-default"
                  >
                    <span className="font-bold text-sm md:text-xs">QUINELLA</span>
                    <span className="text-xs md:text-[10px]">2 any order</span>
                    <span className="text-[8px]">3 combinations</span>
                  </div>


                    <div
                      className={`bg-[#09b517] text-white p-2 text-center flex flex-col items-center justify-center min-w-fit min-h-fit ${isActivedtableButton.size >= 3 ? "opacity-100" : "opacity-0"} cursor-default`}
                    >
                      <span className="font-bold text-xs md:text-base">TRIO</span>
                      <span className="text-xs md:text-[10px]">3 any order</span>
                      <span className="text-[8px]">1 combinations</span>
                    </div>


                  <div
                    className="bg-[#09b517] text-white p-2 text-center flex flex-col items-center justify-center min-w-fit min-h-fit  cursor-default"
                  >
                    <span className="font-bold text-[xs] ">EXACTA</span>
                    <span className="text-xs md:text-[10px]">2 in order</span>
                    <span className="text-[8px]">3 combinations</span>
                  </div>


                    <div
                      className={`bg-[#09b517] text-white p-2 text-center flex flex-col items-center justify-center min-w-fit min-h-fit ${isActivedtableButton.size >= 3 ? "opacity-100" : "opacity-0"} cursor-default`}
                    >
                      <span className="font-bold text-sm md:text-[xs]">TRIFECTA</span>
                      <span className="text-xs md:text-[10px]">3 in order</span>
                      <span className="text-[8px]">1 combinations</span>
                    </div>


                  <div
                    className="bg-[#09b517] text-white p-2 text-center flex flex-col items-center justify-center min-w-fit min-h-fit  cursor-default"
                  >
                    <span className="font-bold text-sm md:text-[xs]">SWINGER</span>
                    <span className="text-xs md:text-[10px]">2 to 3 any order</span>
                    <span className="text-[8px]">3 combinations</span>
                  </div>
                </div>

                <div
                  className="flex items-center justify-center px-3 max-w-fit mt-2 py-1 !bg-[#ff6b6b] text-white font-medium cursor-pointer"
                  onClick={() => {
                    // Call handleClear which now also clears the bet slip
                    handleClear();
                    setClickCount(0);
                  }}
                >
                  <span>CLEAR</span>
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="30" viewBox="0 0 24 24">
                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z" fill="white"></path>
                  </svg>
                </div>
              </div>
            ) }
          </div>
        </div>
      ):""}
    </div>
  );
};

export default React.memo(Drop, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.id === nextProps.id &&
    prevProps.time === nextProps.time &&
    prevProps.place === nextProps.place &&
    prevProps.activeIndexValues === nextProps.activeIndexValues &&
    prevProps.Headtext === nextProps.Headtext &&
    prevProps.isActiveGame === nextProps.isActiveGame &&
    prevProps.isPastGame === nextProps.isPastGame &&
    prevProps.gameNumber === nextProps.gameNumber &&
    prevProps.WhichGameSelected === nextProps.WhichGameSelected &&
    prevProps.isExpanded === nextProps.isExpanded &&
    // Compare data object by reference - if it's the same object, no need to re-render
    prevProps.data === nextProps.data &&
    prevProps.gameData === nextProps.gameData &&
    // Compare savedSelections array by length and content
    JSON.stringify(prevProps.savedSelections) === JSON.stringify(nextProps.savedSelections)
    // Note: We intentionally don't compare function props (isActiveClicked, onSelectionsChange, onTimerEnd)
    // as they may change but the component behavior remains the same
  );
});
