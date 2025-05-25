import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  Ticket,
  clearBetSlip,
  clearNumbers,
  incrBetSlipItem,
  removeFromBetSlip,
  updateBetSlipItem,
  updateStakeForAllTickets,
} from "../features/slices/pickerSlice";
import {
  createBetSlipAndTicket,
  getLastBetSlip,
} from "../features/slices/betSlip";
import "../styles/icon.css";
import ProgressCircular from "./ProgressCircular";
import FormStatus from "./FormStatus";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
import PriceButton from "./PriceButton";
import { isPrinterUp } from "../features/slices/ticketSlice";
import PrinterDialog from "./PrinterDialog";
import { logoutUser } from "../features/slices/userSlice";
import Tickets from "../ui/Ticket";
import { CarRacing } from "./svg/CarRacing";
import { SmartPlay } from "./svg/SmartPlay";
import { Garri } from "./svg/Garri";
import { Jaguar } from "./svg/Jaguar";
import { DashingDerby } from "./svg/DashingDerby";
import { Bicycle } from "./svg/Bicycle";
import { HorseJump } from "./svg/HorseJump";
import { DogWithVideo } from "./svg/DogWithVideo";
import { CircleDraw } from "./svg/CircleDraw";
import Hockey from "./svg/Hockey";
import {
  addGameType,
  ClearSelected,
  removemessage,
  setIsClearCircle,
} from "../features/slices/gameType";
import moment from "moment";
import { getCashierNames } from "../features/slices/cashierData";
import { F1 } from "./svg/F1";

export default function BetSlip() {
  const dispatch = useAppDispatch();
  const betState = useAppSelector((state) => state.picker);
  const gameState = useAppSelector((state) => state.game);
  const userState = useAppSelector((state) => state.user);
  const oddState = useAppSelector((state) => state.odd);
  const cashier = useAppSelector((state) => state.user.shop);
  const betSlipState = useAppSelector((state) => state.betSlip);
  const [statusVisible, setStatusVisible] = useState(false);
  const currentDate = new Date().getTime();
  const [expired, setExpired] = useState(false);
  const [stakeInput, setStake] = useState<number[]>([]);
  const [totalStake, setTotalStake] = useState(10);
  const [selected, setSelected] = useState(-1);
  const [printerDialog, setPrinterDialog] = useState(false);
  const [errorBet, setBetError] = useState("");
  const balance = useAppSelector((state) => state.balance);
  const gameType = useAppSelector((state) => state.gameType.gameType);
  const removemessages = useAppSelector(
    (state) => state.gameType.removemessage
  );
  const [newTicketIndices, setNewTicketIndices] = useState<number[]>([]);
  const [previousLength, setPreviousLength] = useState(0);
  const handleClose = () => {
    setPrinterDialog(false);
  };

  const [removebetsucess, setremovebetsucess] = useState(false);
  const [betType, setBetType] = useState<"SINGLE" | "MULTIPLES">(() => {
    // Load saved preference from localStorage or default to "SINGLE"
    const savedType = localStorage.getItem('preferredBetType');
    return (savedType === "SINGLE" || savedType === "MULTIPLES") ? savedType : "SINGLE";
  });

  const handleTotalStake = (val: number, type: string) => {
    if (val <= 5000) {
      if (type === "inc") {
        totalStake >= 10 && setTotalStake((prevStake) => prevStake + val);
      } else if (type === "dec") {
        setTotalStake((prevStake) => Math.max(0, prevStake + val)); // Ensure the stake doesn't go below 0
      } else if (type === "add") {
        setTotalStake(val);
      }

      updateStakeAll(val, type);
    }
  };

  useEffect(() => {
    setSelected(-1);
  }, [betState.selected]);

  // Save bet type preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferredBetType', betType);
  }, [betType]);

  // useEffect(() => {
  //     const totalStakeVal = betState.betSlip.reduce((a, b) => a + b.stake, 0) / betState.betSlip.length;
  //     setTotalStake(totalStakeVal);
  // }, [totalStake])

  useEffect(() => {
    let newStake = betState.betSlip.map((item) => item.stake);
    setStake(newStake);

    // Track new tickets being added
    if (betState.betSlip.length > previousLength) {
      const newIndices = [betState.betSlip.length - 1]; // Assuming the newest ticket is at the end
      setNewTicketIndices(newIndices);

      // Clear animation after animation completes
      setTimeout(() => {
        setNewTicketIndices([]);
      }, 800); // Slightly longer than animation duration to ensure it completes
    }

    setPreviousLength(betState.betSlip.length);
  }, [betState.betSlip]);

  // Check every second for the expiry of the current game and clear from betslip if it did. And try to fetch the last game every 5 seconds if no game exists currently
  useEffect(() => {
    const timer = setInterval(() => {
      let hasAllBetsExpired = true;
      for (let ticket of betState.betSlip) {
        console.log("TIMER_UPDATE", currentDate > ticket.expiry);
        if (ticket.expiry - new Date().getTime() > 0) {
          hasAllBetsExpired = false;
        }
        if (hasAllBetsExpired) {
          setExpired(true);
        }
      }
    }, 1000);

    if (expired) {
      setExpired(false);
      setTimeout(() => {
        clearSlip();
        setBetError("");
      }, 2000);
    }
    return () => clearInterval(timer);
  }, []);

  const toggleStatus = (val: boolean) => {
    setStatusVisible(val);
  };

  const removeItemFromSlip = (item: number) => {
    // Store the current state of the bet slip
    const currentBetSlip = [...betState.betSlip];

    // Get the ticket information before removing it
    const ticketToRemove = currentBetSlip[item];

    // Calculate the button index based on the ticket
    let buttonIndex = -1;
    if (ticketToRemove && ticketToRemove.draw && ticketToRemove.oddType) {
      if (ticketToRemove.oddType === "WIN") {
        buttonIndex = (ticketToRemove.draw - 1) * 4;
      } else if (ticketToRemove.oddType === "Place") {
        buttonIndex = (ticketToRemove.draw - 1) * 4 + 1;
      } else if (ticketToRemove.isCombo) {
        // For combo tickets, use the combo button index
        buttonIndex = (ticketToRemove.draw - 1) * 4 + 2;
      }
    }

    console.log('Removing ticket:', {
      ticket: ticketToRemove,
      buttonIndex,
      item,
      betSlipLength: currentBetSlip.length
    });

    // Add animation class before removing
    const ticketElement = document.getElementById(`ticket-${item}`);
    if (ticketElement) {
      // Store the ticket ID to ensure we're removing the correct one
      const ticketId = item;

      ticketElement.classList.add('ticket-remove');

      // Wait for animation to complete before removing from state
      setTimeout(() => {
        // Remove the specific ticket from the bet slip
        dispatch(removeFromBetSlip(ticketId));

        // Create a custom event to notify the Table component to update the specific button
        if (buttonIndex >= 0) {
          // Determine the button type based on the ticket
          let buttonType = 'combo';
          if (ticketToRemove.oddType === "WIN") {
            buttonType = 'win';
          } else if (ticketToRemove.oddType === "Place") {
            buttonType = 'place';
          }

          // Get the row index from the button index
          const rowIndex = Math.floor(buttonIndex / 4);

          // Create and dispatch a custom event with the button index, type, row index, and game number
          const event = new CustomEvent('removeSelection', {
            detail: {
              buttonIndex: buttonIndex,
              buttonType: buttonType,
              rowIndex: rowIndex,
              // Include information about whether this is a single or multiple selection
              isSingleSelection: true,
              draw: ticketToRemove.draw,
              // Add a flag to indicate that we should also remove related combo selections
              removeRelatedCombo: true,
              // Include the game number to identify which drop this selection belongs to
              gameNumber: ticketToRemove.gameNumber
            }
          });
          document.dispatchEvent(event);

          // If this is a win or place selection, also remove the related combo selection
          if (buttonType === 'win' || buttonType === 'place') {
            // Calculate the combo button index for this row
            const comboButtonIndex = (rowIndex * 4) + 2;

            // Create and dispatch another event to remove the combo selection
            const comboEvent = new CustomEvent('removeSelection', {
              detail: {
                buttonIndex: comboButtonIndex,
                buttonType: 'combo',
                rowIndex: rowIndex,
                isSingleSelection: false,
                draw: ticketToRemove.draw,
                removeRelatedCombo: false, // Prevent infinite loop
                // Include the game number to identify which drop this selection belongs to
                gameNumber: ticketToRemove.gameNumber
              }
            });
            document.dispatchEvent(comboEvent);

            // Also remove any combo tickets from the betslip that match this row
            const comboTicketsToRemove: number[] = [];
            currentBetSlip.forEach((ticket, idx) => {
              if (ticket.isCombo && ticket.draw === ticketToRemove.draw) {
                comboTicketsToRemove.push(idx);
              }
            });

            // Remove the combo tickets in reverse order to avoid index shifting issues
            comboTicketsToRemove.reverse().forEach(idx => {
              if (idx !== item) { // Don't remove the current ticket again
                dispatch(removeFromBetSlip(idx));
              }
            });

            console.log('Also removed related combo tickets:', comboTicketsToRemove);
          }
        }
      }, 300); // Match animation duration
    } else {
      // If element not found, just remove immediately
      dispatch(removeFromBetSlip(item));

      // Create a custom event to notify the Table component
      if (buttonIndex >= 0) {
        // Determine the button type based on the ticket
        let buttonType = 'combo';
        if (ticketToRemove.oddType === "WIN") {
          buttonType = 'win';
        } else if (ticketToRemove.oddType === "Place") {
          buttonType = 'place';
        }

        // Get the row index from the button index
        const rowIndex = Math.floor(buttonIndex / 4);

        // Create and dispatch a custom event with the button index, type, row index, and game number
        const event = new CustomEvent('removeSelection', {
          detail: {
            buttonIndex: buttonIndex,
            buttonType: buttonType,
            rowIndex: rowIndex,
            // Include information about whether this is a single or multiple selection
            isSingleSelection: true,
            draw: ticketToRemove.draw,
            // Add a flag to indicate that we should also remove related combo selections
            removeRelatedCombo: true,
            // Include the game number to identify which drop this selection belongs to
            gameNumber: ticketToRemove.gameNumber
          }
        });
        document.dispatchEvent(event);

        // If this is a win or place selection, also remove the related combo selection
        if (buttonType === 'win' || buttonType === 'place') {
          // Calculate the combo button index for this row
          const comboButtonIndex = (rowIndex * 4) + 2;

          // Create and dispatch another event to remove the combo selection
          const comboEvent = new CustomEvent('removeSelection', {
            detail: {
              buttonIndex: comboButtonIndex,
              buttonType: 'combo',
              rowIndex: rowIndex,
              isSingleSelection: false,
              draw: ticketToRemove.draw,
              removeRelatedCombo: false, // Prevent infinite loop
              // Include the game number to identify which drop this selection belongs to
              gameNumber: ticketToRemove.gameNumber
            }
          });
          document.dispatchEvent(comboEvent);

          // Also remove any combo tickets from the betslip that match this row
          const comboTicketsToRemove: number[] = [];
          currentBetSlip.forEach((ticket, idx) => {
            if (ticket.isCombo && ticket.draw === ticketToRemove.draw) {
              comboTicketsToRemove.push(idx);
            }
          });

          // Remove the combo tickets in reverse order to avoid index shifting issues
          comboTicketsToRemove.reverse().forEach(idx => {
            if (idx !== item) { // Don't remove the current ticket again
              dispatch(removeFromBetSlip(idx));
            }
          });

          console.log('Also removed related combo tickets:', comboTicketsToRemove);
        }
      }
    }
  };

  const changeIndividualSlipStake = (index: number, stake: number) => {
    dispatch(updateBetSlipItem({ index, changes: { stake: stake } }));
  };

  const changeIndividualSlipStakeIncr = (index: number, stake: number) => {
    dispatch(incrBetSlipItem({ index, changes: { stake: stake } }));
  };

  const handleIndividualItemStake = (index: number, val: number, type: string) => {
    if (val <= 5000) {
      const currentStake = stakeInput[index] || 10;

      if (type === "inc") {
        currentStake >= 10 && changeIndividualSlipStake(index, currentStake + val);
      } else if (type === "dec") {
        changeIndividualSlipStake(index, Math.max(0, currentStake + val)); // Ensure the stake doesn't go below 0
      } else if (type === "add") {
        changeIndividualSlipStake(index, val);
      }
    }
  };

  const updateStakeAll = (stake: number, type: string) => {
    dispatch(updateStakeForAllTickets({ value: stake, type: type }));
  };
  useEffect(() => {
    if (betSlipState.message === "Bet successfully placed!")
      dispatch(getCashierNames(userData.user?.Cashier.shopId));
  }, [betSlipState.message]);

  // Add event listener for clearing betslip items for specific games
  useEffect(() => {
    const handleClearBetSlipForGame = (event: any) => {
      const { gameNumber } = event.detail;

      if (gameNumber) {
        // Find and remove all betslip items that belong to this game
        const currentBetSlip = [...betState.betSlip];

        // Loop through the betslip in reverse order to avoid index shifting issues when removing items
        for (let i = currentBetSlip.length - 1; i >= 0; i--) {
          const ticket = currentBetSlip[i];
          if (ticket.gameNumber === gameNumber) {
            // Remove this ticket from the betslip
            dispatch(removeFromBetSlip(i));
            console.log('Removed betslip item for game number:', gameNumber, 'ticket index:', i);
          }
        }
      }
    };

    const handleRemoveTicketFromBetSlip = (event: any) => {
      const { entry, oddType, gameNumber } = event.detail;

      if (entry && oddType) {
        // Find and remove the specific ticket from the betslip
        const currentBetSlip = [...betState.betSlip];

        // Loop through the betslip in reverse order to avoid index shifting issues when removing items
        for (let i = currentBetSlip.length - 1; i >= 0; i--) {
          const ticket = currentBetSlip[i];
          if (ticket.entry?.Form === entry.Form &&
              ticket.oddType === oddType &&
              ticket.draw === entry.Draw &&
              ticket.gameNumber === gameNumber) {
            // Remove this ticket from the betslip
            dispatch(removeFromBetSlip(i));
            console.log('Removed specific ticket from betslip:', {
              form: entry.Form,
              oddType,
              draw: entry.Draw,
              gameNumber,
              index: i
            });
            break; // Only remove the first match
          }
        }
      }
    };

    // Add event listeners
    document.addEventListener('clearBetSlipForGame', handleClearBetSlipForGame);
    document.addEventListener('removeTicketFromBetSlip', handleRemoveTicketFromBetSlip);

    // Clean up
    return () => {
      document.removeEventListener('clearBetSlipForGame', handleClearBetSlipForGame);
      document.removeEventListener('removeTicketFromBetSlip', handleRemoveTicketFromBetSlip);
    };
  }, [betState.betSlip, dispatch]);
  const clearSlip = () => {
    // Clear the bet slip in Redux
    dispatch(clearBetSlip());
    dispatch(clearNumbers());
    dispatch(ClearSelected(true));
    dispatch(setIsClearCircle(true));
    setBetError("");

    // Create a custom event to notify that all selections should be cleared
    // This is used by the global clear button in the bet slip
    const event = new CustomEvent('clearAllSelections', {
      detail: {
        clearAll: true
      }
    });
    document.dispatchEvent(event);

    console.log("Clearing all selections for game type:", gameType);
  };
  const userData = useAppSelector((state) => state.user);

  const handleCreateTicket = async () => {
    if (balance.data && balance.data.length > 0 && balance.data[0].limitMet) {
      return;
    }
    setBetError("");
    dispatch(setIsClearCircle(true));
    dispatch(ClearSelected(true));
    dispatch(removemessage(true));
    const getBiggest = betState.betSlip.filter(
      (item) => item.stake > 2000 || item.stake * item.multiplier <= 50000
    );
    const findExpired = betState.betSlip.findIndex((ticket) => {
      return ticket.expiry - new Date().getTime() < 0;
    });
    if (findExpired > -1) {
      setBetError("One or More Bets Expired");
      return;
    }

    if (getBiggest.length > 0) {
      const biggetsFirst = getBiggest[0].stake;
      if (biggetsFirst > 2000) {
        setBetError(
          "The stake on one or more of your bets is not within the allowed betting limits"
        );
        return;
      }
    }
    console.log("betState,", betState.totalToWin);
    if (betState.totalToWin > 500000) {
      setBetError(
        "The stake on one or more of your bets is not within the allowed betting limits"
      );
      return;
    }

    // const checkPrinter = await isPrinterUp();
    // console.log("CHECKER", checkPrinter);

    // if (checkPrinter) {
    //   // setPrinterDialog(checkPrinter);
    //   // return;
    // }

    let newTicketToSend = [];
    const otherGameData: any = [];
    let minWin = 0;

    for (let ticket of betState.betSlip) {
      otherGameData.push(ticket.selected);
      console.log("SpinData:", ticket);
      let ticketItem = {
        toWin: Math.floor(ticket.toWin),
        stake: ticket.stake,
        maxWin: Math.floor(ticket.multiplier * ticket.stake),
        nums:
          ticket.gameType === "SmartPlayKeno" ||
          ticket.gameType === "SpinAndWin"
            ? ticket.selected
            : [ticket.selected],
        gameId: ticket.gameId + "",
        oddId: oddState.odd?.id,
        isCombo: ticket.isCombo,
        oddType: ticket.oddType ? ticket.oddType : "",
        entry:
          ticket.gameType !== "SmartPlayKeno" &&
          ticket.gameType !== "SpinAndWin"
            ? {
                Draw: ticket.entry?.Draw,
                PlaceOdds: ticket.entry?.PlaceOdds,
                WinOdds: ticket.entry?.WinOdds,
                Name: ticket.entry?.Name,
              }
            : {},
        nameOfplayer: ticket.nameofPlayer,
        gameType: ticket.gameType,
        gameStartTime: ticket.startTime,
        gameNumber: ticket.gameNumber,
        time: ticket.startTime,
      };
      console.log("TIcketas:", ticketItem);
      newTicketToSend.push(ticketItem);
      let _ticket_min;
      if (
        ticket.gameType === "SmartPlayKeno" ||
        ticket.gameType === "SpinAndWin"
      ) {
        _ticket_min = Math.min(...newTicketToSend.map((item) => item.stake));
      } else {
        _ticket_min = Math.min(
          ...newTicketToSend
            .filter(
              (_ticket) =>
                _ticket.gameType !== "SmartPlayKeno" &&
                _ticket.gameType !== "SpinAndWin"
            )
            .map((item) => {
              console.log("_MIN_WIN", item);
              return item.oddType === "WIN"
                ? item.stake * (item.entry?.WinOdds || 0)
                : item.stake * (item.entry?.PlaceOdds || 0);
            })
        );
      }
      if (minWin === 0) {
        minWin = _ticket_min;
      } else if (_ticket_min < minWin) {
        minWin = _ticket_min;
      }
    }

    // const minWin = Math.min(...newTicketToSend.map((item) => item.stake));

    const maxWin = newTicketToSend.reduce((a, b) => a + b.maxWin, 0);

    const requestPayload = {
      minWin: minWin,
      maxWin: betState.maxWin.toFixed(2),
      cashierCreateId: userState.user?.Cashier.id,
      shopId: userState.user?.Cashier.shopId,
      ticketData: newTicketToSend,
      shopName: cashier?.name,
      cashierName: userState.user?.username,
    };

    // return;
    dispatch(
      createBetSlipAndTicket(
        requestPayload,
        refreshBetSlipNumber,
        clearSlip,
        toggleStatus,
        clearNumberSelection,
        removebetsucess
      )
    );
  };

  const clearNumberSelection = () => {
    dispatch(clearNumbers());
  };

  const refreshBetSlipNumber = () => {};

  const changeItemStake = (a: number, b: number) => {
    let newCopyStake = [...stakeInput];
    newCopyStake[b] = a;
    setStake(newCopyStake);

    if (a >= 1 && a <= 5000) {
      changeIndividualSlipStake(b, a);
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <div
      className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 right containerBetslip relative ml-0 sm:ml-2 flex items-center justify-center flex-col drop-shadow-md"
      onClick={(e) => {
        // Check if the click is directly on this container and not on a child element
        if (e.target === e.currentTarget) {
          setSelected(-1);
        }
      }}
    >
      <PrinterDialog
        open={printerDialog}
        handleClose={handleClose}
        logout={logout}
      />
      <div className="font-thin text-green-600 mt-3 flex items-center justify-center text-center">
        Betslip
      </div>

      <div className="right-slip-content min-h-[50px] w-full flex flex-col items-center mt-2 overflow-y-auto">
        <div className="slip-right-head mb-2 flex items-center justify-center bg-[#09b517] rounded-sm p-0.5">
          <div
            onClick={() => setBetType("SINGLE")}
            className={`left cursor-pointer ${betType === "SINGLE" ? "bg-[#09b517] text-white" : "bg-white text-gray-500"} pr-3 pl-4 text-sm rounded-sm transition-colors h-4 flex items-center`}
          >
            SINGLE
          </div>
          <div
            onClick={() => setBetType("MULTIPLES")}
            className={`left cursor-pointer ${betType === "MULTIPLES" ? "bg-[#09b517] text-white" : "bg-white text-gray-500"} pr-3 pl-4 text-sm rounded-sm transition-colors h-4 flex items-center`}
          >
            MULTIPLES
          </div>
        </div>
        {/* <Tickets Icon={CarRacing} isSmall={true} /> */}
        {betType === "SINGLE" && betState.betSlip.length < 1 && (
          <div className={`text-center mt-2 mb-2 text-gray-400 text-md`}>
            Add more bets
          </div>
        )}

        {!betSlipState.loading && betSlipState.error && (
          <FormStatus type="error" content={betSlipState.error} />
        )}
        {!betSlipState.loading && betSlipState.message && removemessages && (
          <FormStatus type="success" content={betSlipState.message} />
        )}

        {currentDate > betState?.betSlip[0]?.expiry && (
          <div className="p-1 w-full flex items-center justify-between mt-2 text-center text-s bg-red-400 text-white">
            <p className="ml-3">Expired Bets</p>
            <BsCheck2All className="mr-3" size={24} />
          </div>
        )}
        <div
          className="overflow-y-auto w-full px-2"
          style={{ maxHeight: "400px" }}
          onClick={(e) => {
            // Only deselect if clicking directly on the container, not on a child element
            if (e.target === e.currentTarget) {
              setSelected(-1);
            }
          }}
        >
          {betType === "SINGLE" && betState.betSlip.map((item, index) => {
            return (
              <>
                {" "}
                <div
                  id={`ticket-${index}`}
                  data-ticket-index={index}
                  onClick={() =>  setSelected(index) }
                  style={{
                    backgroundColor: `${
                      currentDate > item.expiry ? "#fc4242" : selected === index ? "#969696" : "#969696"
                    }`,
                    width: "100%",
                    borderRadius: "3px",
                  }}
                  key={`ticket-item-${index}-${item.draw}-${item.oddType}`}
                  className={`selected-nums-con text-white font-bold ${newTicketIndices.includes(index) ? 'ticket-pop' : ''} mb-2`}
                >
                  <div className="ml-2 flex rounded-md justify-between mt-1 items-center">
                    <div className="flex gap-1 items-center ">
                      <div className="p-0.5">
                        {item.gameType === "SmartPlayKeno" ? (
                          <SmartPlay isSmall={true} />
                        ) : item.gameType === "HarnessRacing" ? (
                          <Garri isSmall={true} />
                        ) : item.gameType === "MotorRacing" ? (
                          <CarRacing isSmall={true} />
                        ) : item.gameType === "PlatinumHounds" ? (
                          <Jaguar isSmall={true} />
                        ) : item.gameType === "DashingDerby" ? (
                          <DashingDerby isSmall={true} />
                        ) : item.gameType === "CycleRacing" ? (
                          <Bicycle isSmall={true} />
                        ) : item.gameType === "SteepleChase" ? (
                          <HorseJump isSmall={true} />
                        ) : item.gameType === "PreRecRealDogs" ? (
                          <DogWithVideo isSmall={true} />
                        ) : gameType === "SpinAndWin" ? (
                          <CircleDraw />
                        ) :
                        gameType === "SingleSeaterMotorRacing" ? (
                          <F1 isSmall={true}  />
                        ) : gameType === "SpeedSkating" ? (
                          <Hockey isSmall={true} isWhite={true}/>
                        ) : (
                          ""
                        )}
                      </div>
                      <p className="text-xs flex items-center ">
                        {item.stakeInformation?.split(" ")[0] === "Neighbors"
                          ? item.stakeInformation.split(" ")[0]
                          : item.oddType === "Heads" ||
                            item.oddType === "Tails" ||
                            item.oddType === "Evens"
                          ? "Head and Tails"
                          : item.stakeInformation}
                      </p>
                    </div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent click event
                        e.preventDefault(); // Prevent default behavior
                        console.log('Remove button clicked for index:', index);
                        // Use a small timeout to ensure the event is processed correctly
                        setTimeout(() => {
                          removeItemFromSlip(index);
                        }, 10);
                      }}
                      className="h-2 flex items-center justify-center w-4 border text-md text-gray-700 border-none font-bold cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  </div>
                  <div className="flex">
                    <p
                      className="flex gap-1 ml-7 "
                      style={{  fontSize: 13 }}
                    >
                      <p>
                        {item.draw}
                        {!item.isCombo &&
                        item.gameType !== "SmartPlayKeno" &&
                        item.gameType !== "SpinAndWin" &&
                        item.stakeInformation?.split(" ")[0] !== "Neighbors" &&
                        item.stakeInformation !== "Selector(color)"
                          ? "."
                          : ""}
                      </p>
                      {item.oddType === "Heads"
                        ? "Heads"
                        : item.oddType === "Tails"
                        ? "Tails"
                        : item.oddType === "Evens"
                        ? "Even"
                        : item.gameType === "SmartPlayKeno"
                        ? item.selected.join(", ")
                        : gameType === "SpinAndWin" &&
                          item.selected.length > 0 &&
                          item.stakeInformation === "Selector(color)"
                        ? item.selected.join("/")
                        : item.oddType === "Column"
                        ? "2 to 1"
                        : item.oddType === "Dozens1"
                        ? "1st 12"
                        : item.oddType === "Dozens2"
                        ? "2nd 12"
                        : item.oddType === "Dozens3"
                        ? "3rd 12"
                        : item.oddType === "High/low1"
                        ? "1-18"
                        : item.oddType === "High/low2"
                        ? "19-36"
                        : item.oddType === "Even/odd1"
                        ? "Even"
                        : item.oddType === "Even/odd2"
                        ? "Odd"
                        : item.oddType === "Color1"
                        ? "Red"
                        : item.oddType === "Color2"
                        ? "Black"
                        : item.stakeInformation?.split(" ")[0] === "Neighbors"
                        ? item.selected.join("/")
                        : item.selected.length === 0 || item.oddType === "Win"
                        ? item.selected
                        : item.nameofPlayer}
                      {!item.isCombo ? (
                        <span
                          className={`${"bg-green-700 border border-green-400 h-3 mt-1  flex items-center justify-center"} p-1 text-white text-[10px]`}
                        >
                          {!item.isCombo ? item.multiplier : "[1-2]"}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                  <p className="ml-8 mr-8 text-xs">
                    {`${new Date(item.expiry).getFullYear()}/${
                      new Date(item.expiry).getMonth() + 1
                    }/${new Date(item.expiry).getDate()}`}{" "}
                    {new Date(item.expiry).toLocaleTimeString("en-US", {
                      hourCycle: "h24",
                    })}{" "}
                    ID|{item.gameNumber}
                  </p>
                  {item.isCombo ? (
                    <div className="flex gap-1 items-center ml-7">
                      <p className="" style={{ fontSize: 13 }}>
                        [1-2]
                      </p>
                      <p
                        className="bg-green-700 text-sm border-2 border-green-500 h-3 flex items-center justify-center"
                        style={{ fontSize: 12 }}
                      >
                        2.21 (min)
                      </p>
                      <p className="" style={{ fontSize: 13 }}>
                        [3-4]
                      </p>
                      <p
                        className="bg-green-700 text-sm border-2 border-green-500 h-3 flex items-center justify-center"
                        style={{ fontSize: 12 }}
                      >
                        1(max)
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {
                    /*currentDate < betState.betSlip[0].expiry &&*/ <>
                      <div
                        className={`ml-8 ${
                          stakeInput[index] > 2000 ||
                          item.stake * item.multiplier > 50000
                            ? "bg-red-600 text-white"
                            : "bg-white"
                        } mr-8 inc-dec flex items-center max-w-[90%] sm:max-w-[80%] justify-between flex-shrink-0`}
                      >
                        <div
                          className="hover:bg-gray-400 h-6 flex items-center justify-center w-6"
                          style={{ backgroundColor: "#C7C7C7" }}
                        >
                          <FaMinus
                            onClick={() =>
                              changeIndividualSlipStake(
                                index,
                                item.stake >= 20 ? item.stake - 10 : 10
                              )
                            }
                            className="text-white cursor-pointer transition-all h-2 w-2 justify-center dec font-bold rounded-sm flex items-center text-sm"
                          />
                        </div>
                        <div className="flex items-center text-sm">
                          <input
                            className={`num input-picker ${
                              (stakeInput[index] > 2000 ||
                                item.stake * item.multiplier > 50000) &&
                              "bg-red-600 text-white"
                            } text-gray-800 text-end border-none !max-w-[50px] px-1 font-light focus:border-none active:border-none`}
                            value={stakeInput[index]}
                            defaultValue={10}
                            onChange={(e) =>
                              parseInt(e.target.value) <= 5000 &&
                              parseInt(e.target.value) >= 1 &&
                              changeItemStake(parseInt(e.target.value), index)
                            }
                            onClick={(e) =>
                              (e.target as HTMLInputElement).select()
                            }
                            type="number"
                            style={{
                              border: "none",
                            }}
                            max={5000}
                            min={1}
                            required
                          />
                          <div
                            className="hover:bg-gray-400 h-6 flex items-center justify-center w-6"
                            style={{ backgroundColor: "#C7C7C7" }}
                          >
                            <FaPlus
                              onClick={() =>
                                changeIndividualSlipStake(
                                  index,
                                  item.stake + 10
                                )
                              }
                              className="text-white cursor-pointer transition-all h-4 w-4 justify-center inc font-bold rounded-sm flex items-center text-sm roun"
                            />
                          </div>
                        </div>
                      </div>


                      {selected === index && betState.betSlip.length > 1 && (
                        <div className="btn-container-bet w-full p-1 flex flex-wrap gap-2 justify-stretch items-center">
                          <button
                            style={{
                              backgroundColor: "#C9580F",
                              height: "36px",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              fontSize: "16px",
                              fontWeight: "bold"
                            }}
                            onClick={(e) =>{
                              e.preventDefault();
                              e.stopPropagation()

                              stakeInput[index] === 10
                                ? handleIndividualItemStake(index, 10, "add")
                                : handleIndividualItemStake(index, 10, "inc")
                            }}
                            className="hover:opacity-75 relative !sm:text-[1.5vh] !text-[1vw] border border-white  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
                          >
                            <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                            10
                          </button>
                          <button
                            style={{
                              backgroundColor: "#C93362",
                              height: "36px",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              fontSize: "16px",
                              fontWeight: "bold"
                            }}
                            onClick={(e) =>{
                              e.preventDefault();
                              e.stopPropagation()

                              stakeInput[index] === 10
                                ? handleIndividualItemStake(index, 20, "add")
                                : handleIndividualItemStake(index, 20, "inc")
                            } }
                            className="hover:opacity-75 relative !sm:text-[1.5vh] border border-white/70 !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
                          >
                            <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                            20
                          </button>
                          <button
                            style={{
                              backgroundColor: "#8830AD",
                              height: "36px",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              fontSize: "16px",
                              fontWeight: "bold"
                            }}
                            onClick={(e) =>{
                              e.preventDefault();
                              e.stopPropagation()

                              stakeInput[index] === 10
                                ? handleIndividualItemStake(index, 50, "add")
                                : handleIndividualItemStake(index, 50, "inc")
                            } }
                            className="hover:opacity-75 relative !sm:text-[1.5vh] border border-white/70 !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
                          >
                            <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                            50
                          </button>
                          <button
                            style={{
                              backgroundColor: "#5A95F0",
                              height: "36px",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              fontSize: "16px",
                              fontWeight: "bold"
                            }}
                            onClick={(e) =>{
                              e.preventDefault();
                              e.stopPropagation()

                              stakeInput[index] === 10
                                ? handleIndividualItemStake(index, 100, "add")
                                : handleIndividualItemStake(index, 100, "inc")
                            }}
                            className="hover:opacity-75 relative !sm:text-[1.5vh] border border-white/70 !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
                          >
                            <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                            100
                          </button>
                          <button
                            style={{
                              backgroundColor: "#688A37",
                              height: "36px",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              fontSize: "16px",
                              fontWeight: "bold"
                            }}
                            onClick={(e) =>{
                              e.preventDefault();
                              e.stopPropagation()

                              stakeInput[index] === 10
                                ? handleIndividualItemStake(index, 150, "add")
                                : handleIndividualItemStake(index, 150, "inc")
                            }  }
                            className="hover:opacity-75 relative !sm:text-[1.5vh] border border-white/70 !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
                          >
                            <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                            150
                          </button>
                        </div>
                      )}
                        {!item.isCombo ? (
                        <p
                          className={`ml-8 mr-8 text-white text-xs text-right `}
                        >
                          <span className="font-light">To Win</span>: Br. {(item.stake * item.multiplier).toFixed(2)}
                        </p>
                      ) : (
                        <p className="ml-8 mr-8 text-white text-xs text-right "></p>
                      )}
                    </>
                  }

                </div>
              </>
            );
          })}
          {/* {betType === "MULTIPLES" && betState.betSlip.length === 0 && (
            <div className="text-center mt-2 mb-2 text-gray-400 text-md">
              Add selections to create multiple bets
            </div>
          )} */}
          {/* {betType === "MULTIPLES" && betState.betSlip.length > 0 && (
            <div className="w-full p-4 bg-gray-100 rounded-md mb-2">
              <h3 className="text-gray-700 font-medium mb-2">Multiple Bet Options</h3>
              <div className="flex flex-col gap-2">
                {betState.betSlip.length >= 2 && (
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-sm">Double ({betState.betSlip.length} selections)</span>
                    <span className="text-sm font-medium">x{betState.betSlip.length}</span>
                  </div>
                )}
                {betState.betSlip.length >= 3 && (
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-sm">Treble ({betState.betSlip.length} selections)</span>
                    <span className="text-sm font-medium">x{betState.betSlip.length}</span>
                  </div>
                )}
                {betState.betSlip.length >= 4 && (
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-sm">4-Fold ({betState.betSlip.length} selections)</span>
                    <span className="text-sm font-medium">x{betState.betSlip.length}</span>
                  </div>
                )}
              </div>
            </div>
          )} */}
        </div>

        {betState.betSlip.length > 0 && (
          /*currentDate <= betState.betSlip[0].expiry && */ <>
            <div className="btn-container-bet w-full p-1 flex flex-wrap gap-2 justify-stretch items-center">
              <button
                style={{
                  backgroundColor: "#C9580F",
                  height: "36px",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
                onClick={() =>
                  totalStake === 10
                    ? handleTotalStake(10, "add")
                    : handleTotalStake(10, "inc")
                }
                className="hover:opacity-75 relative !sm:text-[1.5vh] !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
              >
                <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                10
              </button>
              <button
                style={{
                  backgroundColor: "#C93362",
                  height: "36px",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
                onClick={() =>
                  totalStake === 10
                    ? handleTotalStake(20, "add")
                    : handleTotalStake(20, "inc")
                }
                className="hover:opacity-75 relative !sm:text-[1.5vh] !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
              >
                <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                20
              </button>
              <button
                style={{
                  backgroundColor: "#8830AD",
                  height: "36px",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
                onClick={() =>
                  totalStake === 10
                    ? handleTotalStake(50, "add")
                    : handleTotalStake(50, "inc")
                }
                className="hover:opacity-75 relative !sm:text-[1.5vh] !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
              >
                <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                50
              </button>
              <button
                style={{
                  backgroundColor: "#5A95F0",
                  height: "36px",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
                onClick={() =>
                  totalStake === 10
                    ? handleTotalStake(100, "add")
                    : handleTotalStake(100, "inc")
                }
                className="hover:opacity-75 relative !sm:text-[1.5vh] !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
              >
                <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                100
              </button>
              <button
                style={{
                  backgroundColor: "#688A37",
                  height: "36px",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
                onClick={() =>
                  totalStake === 10
                    ? handleTotalStake(150, "add")
                    : handleTotalStake(150, "inc")
                }
                className="hover:opacity-75 relative !sm:text-[1.5vh] !text-[1vw]  transition-all flex-1 flex justify-center items-center text-white !max-w-[5vw]"
              >
                <sup className="text-[8px] font-light absolute top-2 left-1 self-start">Br.</sup>
                150
              </button>
            </div>

            {betState.betSlip && betState.betSlip.length > 1 && (
              <>
                <p className="text-left w-full px-4 mr-4">STAKE</p>
                <div className="inc-dec w-[90%] sm:w-3/4 mr-4 mb-2 flex bg-white items-center justify-between flex-shrink-0">
                  <FaMinus
                    style={{ backgroundColor: "#C7C7C7" }}
                    onClick={() => handleTotalStake(-10, "inc")}
                    className="text-white hover:bg-gray-400 cursor-pointer transition-all h-6 w-6 justify-center dec font-bold rounded-sm flex items-center text-3xl"
                  />
                  <div className="flex items-center">
                    <input
                      className="num input-picker text-gray-500 text-end border-none focus:border-none active:border-none"
                      type="number"
                      value={totalStake}
                      onChange={(e) =>
                        parseInt(e.target.value) > 9 &&
                        handleTotalStake(parseInt(e.target.value), "add")
                      }
                    />
                    <div className="mr-2">.00</div>
                    <FaPlus
                      style={{ backgroundColor: "#C7C7C7" }}
                      onClick={() => handleTotalStake(10, "inc")}
                      className="text-white hover:bg-gray-400 cursor-pointer transition-all h-6 w-6 justify-center inc font-bold rounded-sm flex items-center text-4xl"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="amounts w-full p-2 text-black">
              <div className="sm:text-[1.5vh] text-[3vw]  font-medium text-gray-500 flex justify-between items-center">
                <p>TOTAL STAKE</p>
                <p>{betState.totalStake}.00 BR</p>
              </div>
              <div className="sm:text-[1.5vh] text-[3vw]  font-bold text-gray-400 flex justify-between items-center">
                <p>TOTAL "TO WIN"</p>
                <p>{Math.floor(betState.totalToWin)}.00 BR</p>
              </div>
            </div>

            {errorBet !== "" && (
              <div
                style={{ width: "98%", margin: "auto" }}
                className="p-1 text-center text-sm bg-red-700 text-white"
              >
                {errorBet.toLowerCase().includes("the stake")
                  ? errorBet
                  : " Network is slow, please try again "}
              </div>
            )}

            {betSlipState.loading && <ProgressCircular />}
          </>
        )}

        <div className="confirm-cancel mb-4 w-full text-white mt-2 flex justify-betweenn gap-0.5 items-center">
          <button
            disabled={
              betState.betSlip.length < 1
              /*currentDate > betState.betSlip[0].expiry*/
            }
            onClick={clearSlip}
            className="disabled:bg-red-200 disabled:opacity-50 p-2 sm:p-4 flex-grow sm:text-[1.5vh] !text-[1vw]  hover:opacity-75 transition-opacity bg-red-500"
          >
            CLEAR
          </button>
          <button
            disabled={
              betState.betSlip.length < 1 ||
              betSlipState.loading ||
              currentDate > betState.betSlip[0].expiry
            }
            onClick={handleCreateTicket}
            className={`disabled:bg-[#09b517] disabled:opacity-30 p-2 sm:p-3 flex items-center justify-center sm:text-[1.5vh] !text-[1vw]  gap-2 flex-grow hover:opacity-75 transition-opacity basis-2/3 ${
              betState.betSlip.length > 0 ? "bg-[#09b517]" : "bg-green-200"
            }`}
          >
            <p>PLACE BET</p>
            <p
             className={`${betState.betSlip.length < 1 ||
              betSlipState.loading ||
              currentDate > betState.betSlip[0].expiry?'bg-opacity-0':""} bg-[#0ac419] p-1 `}>
              {betState.betSlip.length > 0
                ? "BR " + betState.totalStake + ".00"
                : '10.00'}
            </p>
          </button>
        </div>
        {balance.data && balance.data[0] && balance.data[0].limitMet && (
          <div
            style={{
              height: 30,
              backgroundColor: "red",
              color: "white",
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            Cashier Limit has exceeded the shops set Limit
            {/* {balance.data[0].creditAmount}.00 Br */}
          </div>
        )}
      </div>
    </div>
  );
}
