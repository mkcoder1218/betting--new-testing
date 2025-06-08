import React, { useEffect, useState, useCallback, useMemo, useRef, memo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BasicRating from "./Rating";
import ButtonSizes from "./Win";
import "../styles/Table.css";
import {
  addToBetSlip,
} from "../features/slices/pickerSlice";
import F from "./F";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import Images from "./Images";
import { RootEventData, GameData } from "../features/slices/RacingGameSlice";
import { Entry } from "../config/types";
import moment from "moment";
import { ClearSelected, removemessage, sethasEntry } from "../features/slices/gameType";
import { fetchEventResult } from "../features/slices/RacingGameSliceMultipleSports";

// Extend RootEventData to include eventResult property
interface ExtendedRootEventData extends RootEventData {
  eventResult?: {
    Race?: {
      Entries: Array<{
        Draw: string;
      }>;
    };
  };
}

interface TableProp {
  clickCount: (val: number) => void;
  isClear?: boolean;
  isActivatedtablebutton: Set<number>;
  isActiveBank?: number;
  handleColorChange: (index: number) => void;
  handleBankColorChange: (index: number) => void;
  HeadTexttoTable?: string;
  data: ExtendedRootEventData;
  selectedCombos?: (val: number) => void;
  gameDatalist?: GameData;
  isActiveGame?: boolean;
  isPastGame?: boolean;
}

export interface DispatchParams {
  selected: any;
  multiplier: number;
  toWin: number;
  expiry?: number;
  stake: number;
  gameId: number;
  draw?: number;
  stakeInfo?: string;
  oddType?: string;
  nameofplayer?: string;
  entry?: Entry;
  gameNumber?: number;
  isActiveGame?: boolean;
  isPastGame?: boolean;
  startTime?: string;
}

// Memoized TableRow component to prevent unnecessary re-renders
interface MemoizedTableRowProps {
  row: any; // Use any to handle different Entry types
  index: number;
  gameType: string | undefined;
  isGameLocked: boolean | undefined;
  winnerEntries: any[];
  isActivatedtablebutton: Set<number>;
  clickOrder: number[];
  HeadText: string | undefined;
  handleClick: (index: number, type: string) => void;
  handleColorChange: (index: number) => void;
  handleDispatch: (params: DispatchParams) => void;
  dispatch: any;
  gameDatalist: GameData | undefined;
  data: ExtendedRootEventData;
  silkGenerator: (row: any, gameType: string, index: number) => string;
  isComboSelected: boolean;
  clickCounter: number;
  isActiveBank?: number; // Add bank prop
}

const MemoizedTableRow = memo<MemoizedTableRowProps>(({
  row,
  index,
  gameType,
  isGameLocked,
  winnerEntries,
  isActivatedtablebutton,
  clickOrder,
  HeadText,
  handleClick,
  handleColorChange,
  handleDispatch,
  dispatch,
  gameDatalist,
  data,
  silkGenerator,
  isComboSelected,
  clickCounter,
  isActiveBank,
}) => {
  // Calculate values once per row
  const rating = (row.StarRating / 100) * 5;
  const silkImageUrl = silkGenerator(row, gameType || "", index);
  const isWinnerRow = winnerEntries.length > 0 &&
    parseInt(winnerEntries[0].Draw) === index + 1;

  // Memoize button text calculation
  const comboButtonText = useMemo(() => {
    if (HeadText === "ALT") return "1.2";
    if (!clickOrder.includes(index)) return (index + 1).toString();

    if (clickOrder.length <= 3) {
      const orderIndex = clickOrder.indexOf(index);
      if (orderIndex === 0) return "1st";
      if (orderIndex === 1) return "2nd";
      if (orderIndex === 2) return "3rd";
    }
    return (index + 1).toString();
  }, [HeadText, clickOrder, index]);

  // Memoize winner check for place button
  const isWinnerPlace = useMemo(() => {
    return winnerEntries.length > 0 &&
      winnerEntries.findIndex(
        (nums: any) => parseInt(nums.Draw) === index + 1
      ) > -1;
  }, [winnerEntries, index]);

  // Memoize click handlers
  const handleWinClick = useCallback(() => {
    handleClick(index, 'win');
    handleColorChange(index * 4);
    dispatch(ClearSelected(false));
    if (gameDatalist) {
      handleDispatch({
        nameofplayer: row.Name,
        selected: row.Draw,
        multiplier: row.WinOdds,
        toWin: 10,
        stake: 10,
        gameId: gameDatalist.id as any,
        draw: row.Draw,
        oddType: "WIN",
        stakeInfo: "Win",
        entry: row as any,
        gameNumber: data.Number,
        startTime: gameDatalist.startTime,
        expiry: gameDatalist.startTime ? new Date(gameDatalist.startTime).getTime() : undefined,
      });
    }
  }, [index, row, gameDatalist, handleClick, handleColorChange, dispatch, handleDispatch, data.Number]);

  const handlePlaceClick = useCallback(() => {
    handleClick(index, 'place');
    handleColorChange(index * 4 + 1);
    dispatch(ClearSelected(false));
    if (gameDatalist) {
      handleDispatch({
        nameofplayer: row.Name,
        selected: row.Draw,
        multiplier: row.PlaceOdds,
        toWin: 10,
        stake: 10,
        gameId: gameDatalist.id as any,
        draw: row.Draw,
        stakeInfo: "PLACE",
        entry: row as any,
        oddType: "Place",
        gameNumber: data.Number,
        startTime: gameDatalist.startTime,
        expiry: gameDatalist.startTime ? new Date(gameDatalist.startTime).getTime() : undefined,
      });
    }
  }, [index, row, gameDatalist, handleClick, handleColorChange, dispatch, handleDispatch, data.Number]);

  return (
    <TableRow key={`${row.Name}-${index}`} className="Tablerow">
      <TableCell scope="row" className="nam" style={{ minWidth: "30px" }}>
        <div
          className="flex items-center gap-1"
          style={{ width: "100%" }}
        >
          <p className={`${row.Draw > 10 ? "-ml-1" : ""} min-w-2 text-center`}>
            {gameType !== "PlatinumHounds" &&
            gameType !== "PreRecRealDogs"
              ? row.Draw
              : ""}
          </p>
          <Images
            src={silkImageUrl}
            className="w-8 h-8 ml-3 object-contain"
          />
          <div className="flex flex-row ml-2 w-full">
            <p className="text-right nameText truncate">{row.Name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell align="center" className="tableContent f" style={{minWidth: "50px" }}>
        {row.Favorite ? <F favoritenumber={row.Favorite} /> : ""}
      </TableCell>
      <TableCell align="center" className="tableContent rating">
        <BasicRating rating={rating} />
      </TableCell>
      <TableCell
        align="center"
        className="tableContent texts text-2xl"
      >
        {row.Form}
      </TableCell>
      <TableCell
        align="center"
        className="tableContent buttonsTable"
      >
        <ButtonSizes
          isWinner={isWinnerRow}
          text={row.WinOdds + ""}
          isActive={
            isActivatedtablebutton?.has(index * 4) || false
          }
          isLocked={isGameLocked || false}
          onClick={handleWinClick}
          numberofClickedbuttons={clickCounter}
          isCombo={false}
          selectionOrder={clickOrder.indexOf(index) + 1}
          clickOrder={clickOrder}
        />
      </TableCell>
      <TableCell
        align="center"
        className="tableContent buttonsTable "
      >
        <ButtonSizes
          text={row.PlaceOdds + ""}
          isActive={
            isActivatedtablebutton?.has(index * 4 + 1) || false
          }
          isLocked={isGameLocked || false}
          isWinner={isWinnerPlace}
          onClick={handlePlaceClick}
          numberofClickedbuttons={clickCounter}
          isCombo={false}
          selectionOrder={clickOrder.indexOf(index) + 1}
          clickOrder={clickOrder}
        />
      </TableCell>
      <TableCell
        align="center"
        className="tableContent buttonsTable"
      >
        <ButtonSizes
          text={comboButtonText}
          isActive={isComboSelected}
          isWinner={false}
          isLocked={isGameLocked || false}
          numberofClickedbuttons={clickCounter}
          isCombo={true}
          selectionOrder={clickOrder.indexOf(index) + 1}
          clickOrder={clickOrder}
          isReadOnly={true}
        />
      </TableCell>
      <TableCell
        align="center"
        className="tableContent buttonsTable"
      >
        <ButtonSizes
          text={
            // Show "1st" if this row is selected as the bank, otherwise show the row number
            isActiveBank === index ? "1st" : (index + 1).toString()
          }
          isActive={isActiveBank === index} // Active only if this row is the bank selection
          isWinner={false}
          isLocked={isGameLocked || false} // Only locked if the game is locked, not always locked
          numberofClickedbuttons={clickCounter}
          isCombo={true} // Make it render like a combo button
          isBankActive={isActiveBank === index} // Add bank active state
          selectionOrder={isActiveBank === index ? 1 : 0} // Always 1st if it's the bank
          clickOrder={clickOrder}
          isReadOnly={true} // Keep read-only
          isDesabled={false} // Don't disable any bank buttons, just show them
        />
      </TableCell>
    </TableRow>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.row === nextProps.row &&
    prevProps.index === nextProps.index &&
    prevProps.gameType === nextProps.gameType &&
    prevProps.isGameLocked === nextProps.isGameLocked &&
    prevProps.winnerEntries === nextProps.winnerEntries &&
    prevProps.isActivatedtablebutton === nextProps.isActivatedtablebutton &&
    JSON.stringify(prevProps.clickOrder) === JSON.stringify(nextProps.clickOrder) &&
    prevProps.HeadText === nextProps.HeadText &&
    prevProps.isComboSelected === nextProps.isComboSelected &&
    prevProps.clickCounter === nextProps.clickCounter
  );
});

MemoizedTableRow.displayName = 'MemoizedTableRow';
const BasicTable: React.FC<TableProp> = ({
  clickCount,
  isClear,
  isActivatedtablebutton,
  handleColorChange,
  selectedCombos,
  handleBankColorChange,
  data,
  gameDatalist,
  isPastGame,
  isActiveBank,
}) => {
  // Optimized Redux selectors with memoization
  const dispatch = useAppDispatch();
  const gameType = useAppSelector((state) => state.gameType.gameType);
  const isClearselection = useAppSelector((state) => state.gameType.ClearSelected);
  const HeadText = useAppSelector((state) => state.Head.Name);

  // Memoize selector results to prevent unnecessary re-renders
  const memoizedGameType = useMemo(() => gameType, [gameType]);
  const memoizedHeadText = useMemo(() => HeadText, [HeadText]);

  // Consolidated state management for better performance
  const [clickCounter, setClickCounter] = useState<number>(0);
  const [clickOrder, setClickOrder] = useState<number[]>([]);
  const [changedForm, setchangedForm] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  // Use useRef for interval to prevent unnecessary re-renders
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize expensive calculations
  const hasEntries = useMemo(() => {
    return data?.eventDetail?.Event?.Race?.Entries?.length > 0;
  }, [data?.eventDetail?.Event?.Race?.Entries?.length]);
useEffect(()=>{
  if(!hasEntries)
  dispatch(sethasEntry(false))
},[hasEntries])
  const entries = useMemo(() => {
    return data?.eventDetail?.Event?.Race?.Entries || [];
  }, [data?.eventDetail?.Event?.Race?.Entries]);

  // Memoize game lock status to avoid recalculating in every row
  const isGameLocked = useMemo(() => {
    return gameDatalist && moment(gameDatalist.startTime).diff(moment(), "seconds") < 0;
  }, [gameDatalist]);

  // Memoize winner entries for better performance
  const winnerEntries = useMemo(() => {
    return data?.eventResult?.Race?.Entries || [];
  }, [data?.eventResult?.Race?.Entries]);
  // Memoize event handlers with useCallback to prevent recreation on each render
  const handleClick = useCallback((index: number, _buttonType?: string) => {
    dispatch(removemessage(!removemessage));
    if (selectedCombos) selectedCombos(index);

    // Create a new array for click order
    let newClickOrder = [...clickOrder];

    // Update the click order for all button types (Win, Place, Combo)
    // Check if this index is already in the click order
    if (newClickOrder.includes(index)) {
      // If it is, remove it (toggle behavior)
      newClickOrder = newClickOrder.filter((i) => i !== index);

      // If we're removing a selection, decrement the click counter
      setClickCounter((prev) => {
        const newValue = Math.max(0, prev - 1);
        clickCount(newValue);
        return newValue;
      });
    } else {
      // If it's not in the click order, add it
      // Always add to the existing click order, never reset
      newClickOrder.push(index);

      // If we're adding a selection, increment the click counter
      setClickCounter((prev) => {
        const newValue = prev + 1;
        clickCount(newValue);
        return newValue;
      });
    }

    // Update the click order state
    setClickOrder(newClickOrder);

    // Handle changedForm updates
    // For all button types, toggle the changedForm array for consistency
    if (changedForm.includes(index)) {
      // If it's already in the changedForm array, remove it (toggle behavior)
      setchangedForm(changedForm.filter(i => i !== index));
    } else {
      // If it's not in the changedForm array, add it
      setchangedForm([...changedForm, index]);
    }
  }, [clickOrder, changedForm, dispatch, selectedCombos, clickCount]);

  // Optimize useEffect to batch state updates
  useEffect(() => {
    if (isClear) {
      setClickCounter(0);
      setClickOrder([]);
      setchangedForm([]);
    }
  }, [isClear]);

  // Optimize useEffect to reduce dependencies and remove console logs
  useEffect(() => {
    if (isPastGame) {
      setIsLocked(true);
    } else if (gameDatalist) {
      setIsLocked(moment(gameDatalist.startTime).diff(moment(), "seconds") < 0);
    }
  }, [isPastGame, gameDatalist]);

  // Track selected tickets locally to avoid betSlip subscription
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());

  // Helper function to create a unique key for a ticket
  const createTicketKey = useCallback((row: Entry, type: string) => {
    return `${row.Form}-${type}-${row.Draw}-${data.Number}`;
  }, [data.Number]);

  // Check if a ticket is selected and handle deselection
  const checkIsSelected = useCallback((row: Entry, type: string) => {
    const ticketKey = createTicketKey(row, type);

    if (selectedTickets.has(ticketKey)) {
      // Ticket is selected, remove it
      setSelectedTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketKey);
        return newSet;
      });

      // Calculate the button index based on the row and type
      let buttonIndex = -1;
      let buttonType = '';
      if (type === "WIN") {
        buttonIndex = (row.Draw - 1) * 4; // For WIN buttons
        buttonType = 'win';
      } else if (type === "Place") {
        buttonIndex = (row.Draw - 1) * 4 + 1; // For PLACE buttons
        buttonType = 'place';
      }

      // Calculate the row index from the button index
      const rowIndex = Math.floor(buttonIndex / 4);

      // Create and dispatch a custom event to remove from betslip
      const event = new CustomEvent('removeTicketFromBetSlip', {
        detail: {
          entry: row,
          oddType: type,
          gameNumber: data.Number
        }
      });
      document.dispatchEvent(event);

      // If we found a valid button index, toggle its selection state
      if (buttonIndex >= 0 && handleColorChange) {
        // Toggle the button's visual state
        handleColorChange(buttonIndex);

        // Update our internal state to reflect the removal
        setClickCounter(prev => Math.max(0, prev - 1));

        // Update the click order - remove this row from the click order
        setClickOrder(prev => prev.filter(item => item !== rowIndex));

        // Create and dispatch a custom event to ensure all components are updated
        const removeEvent = new CustomEvent('removeSelection', {
          detail: {
            buttonIndex: buttonIndex,
            buttonType: buttonType,
            rowIndex: rowIndex,
            isSingleSelection: true,
            draw: row.Draw,
            removeRelatedCombo: true,
            gameNumber: data.Number
          }
        });
        document.dispatchEvent(removeEvent);
      }

      return true;
    }

    return false;
  }, [selectedTickets, createTicketKey, handleColorChange, data]);

  // Memoize handleDispatch to prevent recreation on each render
  const handleDispatch = useCallback((params: DispatchParams) => {
    // First check if this ticket is already in the bet slip
    // If it is, checkIsSelected will remove it and return true
    // If not, it will return false and we'll add the ticket
    if (params.entry && params.oddType && !checkIsSelected(params.entry, params.oddType)) {
      // Add to local tracking
      const ticketKey = createTicketKey(params.entry, params.oddType);
      setSelectedTickets(prev => new Set(prev).add(ticketKey));

      // Add to Redux betSlip
      dispatch(
        addToBetSlip({
          selected: params.selected,
          expiry: params.expiry || 0,
          multiplier: params.multiplier,
          toWin: params.toWin,
          stake: params.toWin,
          gameId: params.gameId,
          gameType: memoizedGameType,
          draw: params.draw,
          entry: params.entry,
          stakeInformation: params.stakeInfo,
          nameofPlayer: params.nameofplayer,
          oddType: params.oddType,
          gameNumber: params.gameNumber,
          startTime: params.startTime || "",
        })
      );
    }
  }, [dispatch, memoizedGameType, checkIsSelected, createTicketKey]);

  // Optimize event listener management with memoized event handlers
  useEffect(() => {
    // Memoize event handlers inside useEffect to prevent recreation on each render
    const handleRemoveSelection = (event: any) => {
      const { buttonIndex, rowIndex: eventRowIndex, isSingleSelection, gameNumber: eventGameNumber } = event.detail;

      // Only process the event if it's for this table's game number
      if (buttonIndex >= 0 && handleColorChange && (!eventGameNumber || eventGameNumber === data.Number)) {
        // Toggle the specific button
        handleColorChange(buttonIndex);

        // Calculate the row index from the button index
        const rowIndex = eventRowIndex || Math.floor(buttonIndex / 4);

        // Batch state updates to reduce renders
        setClickCounter(prev => Math.max(0, prev - 1));
        setClickOrder(prev => prev.filter(item => item !== rowIndex));
        setchangedForm(prev => prev.filter(item => item !== rowIndex));

        // If this is a single selection removal (from betslip), also update bank selection
        if (isSingleSelection && handleBankColorChange && rowIndex === clickOrder[0]) {
          handleBankColorChange(-1);
        }
      }
    };

    // Function to handle clearing selections for a specific drop
    const handleClearDropSelections = (event: any) => {
      const { gameNumber } = event.detail;

      // Only clear selections if this table belongs to the drop that triggered the clear
      if (data && data.Number === gameNumber) {
        // Reset all selection state
        setClickCounter(0);
        setClickOrder([]);
        setchangedForm([]);
        setSelectedTickets(new Set()); // Clear local tracking
      }
    };

    // Add event listeners
    document.addEventListener('removeSelection', handleRemoveSelection);
    document.addEventListener('clearDropSelections', handleClearDropSelections);

    // Clean up
    return () => {
      document.removeEventListener('removeSelection', handleRemoveSelection);
      document.removeEventListener('clearDropSelections', handleClearDropSelections);
    };
  }, [handleColorChange, handleBankColorChange, clickOrder, data]);

  // Optimize useEffect to reduce dependencies and remove console logs
  useEffect(() => {
    if (isClearselection) {
      // Reset all selection state
      setClickCounter(0);
      setClickOrder([]);
      setchangedForm([]);
      setSelectedTickets(new Set()); // Clear local tracking

      // Reset the activated buttons
      if (handleColorChange && isActivatedtablebutton) {
        // Clear all button selections
        const buttonsToReset = Array.from(isActivatedtablebutton);
        for (const buttonIndex of buttonsToReset) {
          handleColorChange(buttonIndex);
        }
      }

      // Since we no longer track betSlip state here, we don't need to rebuild button state
      // The button state is managed by the Drop component and passed down as props
    }
  }, [isClearselection, handleColorChange, isActivatedtablebutton]);

  useEffect(() => {
    if (!isLocked || !gameType || !gameDatalist) return;

    // Immediately fetch once
    dispatch(fetchEventResult(gameDatalist.id, String(gameType)));

    // Start polling
    intervalRef.current = setInterval(() => {
      if (gameDatalist) {
        dispatch(fetchEventResult(gameDatalist.id, String(gameType)));
      }
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLocked, gameType, gameDatalist, dispatch]);

  // Stop polling if result is available
  useEffect(() => {
    if (data && data.eventResult && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [data]);

  // Memoize silk generator function for better performance
  const silkGenerator = useCallback((row: any, gameType: string, index: number) => {
    switch (gameType) {
      case "HarnessRacing":
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
      case "PreRecRealDogs":
        return `https://games2.playbetman.com/Content/Images/GreyhoundJackets/raceguimarkers0${
          index + 1
        }.png`;
      case "horseRun":
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
      case "CycleRacing":
        return `https://games2.playbetman.com/Content/Images/CyclistHelmets/silk_${
          index + 1
        }.png`;
      case "SteepleChase":
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
      case "SpeedSkating":
        return `https://games2.playbetman.com/Content/Images/SpeedSkatingFlags/Flag_0${
          index + 1
        }.png`;
      case "SingleSeaterMotorRacing":
        return `https://games2.playbetman.com/Content/Images/SingleSeaterMotorRacing/Helmet_${row.SilkNumber}.png`;
      case "MotorRacing":
        return `https://games2.playbetman.com/Content/Images/SingleSeaterMotorRacing/Helmet_${row.SilkNumber}.png`;
      case "DashingDerby":
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
      case "PlatinumHounds":
        return `https://games2.playbetman.com/Content/Images/GreyhoundJackets/raceguimarkers0${
          index + 1
        }.png`;
      default:
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
    }
  }, []);

  // Memoize the table header to prevent re-renders
  const TableHeader = React.useMemo(() => (
    <TableHead className="TableHead">
      <TableRow>
        <TableCell></TableCell>
        <TableCell align="left"></TableCell>
        <TableCell align="center">Rating</TableCell>
        <TableCell align="center">Last5</TableCell>
        <TableCell align="center">
          {memoizedHeadText === "ALT" ? "2nd" : "Win"}
        </TableCell>
        <TableCell align="center">
          {memoizedHeadText === "ALT" ? "3rd" : "Place"}
        </TableCell>
        <TableCell align="center" className="Combo">
          {memoizedHeadText === "ALT" ? "Last 3" : "Combo"}
        </TableCell>
        <TableCell align="center">
          {memoizedHeadText === "ALT" ? "Last" : "Bank"}
        </TableCell>
      </TableRow>
    </TableHead>
  ), [memoizedHeadText]);

  // hasEntries is already memoized above

  return (
    <div className="animator">
      <TableContainer
        className="tableContainer"
        style={{
          width: '100%',
          overflowX: 'auto'
        }}
      >
        <Table
          aria-label="betting table"
          className="table"
        >
          {hasEntries&&TableHeader}
          <TableBody className="tableBody">
            {hasEntries && entries.map((row, index: number) => (
              <MemoizedTableRow
                key={`${row.Name}-${index}`}
                row={row}
                index={index}
                gameType={memoizedGameType}
                isGameLocked={isGameLocked}
                winnerEntries={winnerEntries}
                isActivatedtablebutton={isActivatedtablebutton}
                clickOrder={clickOrder}
                HeadText={memoizedHeadText}
                handleClick={handleClick}
                handleColorChange={handleColorChange}
                handleDispatch={handleDispatch}
                dispatch={dispatch}
                gameDatalist={gameDatalist}
                data={data}
                silkGenerator={silkGenerator}
                isComboSelected={
                  // Combo is selected if either WIN or PLACE button for this row is selected
                  (isActivatedtablebutton?.has(index * 4) || false) || // WIN button
                  (isActivatedtablebutton?.has(index * 4 + 1) || false) // PLACE button
                }
                clickCounter={clickCounter}
                isActiveBank={isActiveBank}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default React.memo(BasicTable, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.data === nextProps.data &&
    prevProps.gameDatalist === nextProps.gameDatalist &&
    prevProps.isActivatedtablebutton === nextProps.isActivatedtablebutton &&
    prevProps.isClear === nextProps.isClear &&
    prevProps.isPastGame === nextProps.isPastGame &&
    prevProps.isActiveBank === nextProps.isActiveBank &&
    prevProps.HeadTexttoTable === nextProps.HeadTexttoTable
  );
});
