import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Last5 from "./Last5";
import BasicRating from "./Rating";
import ButtonSizes from "./Win";
import {
  Ticket,
  addPickedNumbers,
  addToBetSlip,
  clearNumbers,
  removeFromBetSlip,
} from "../features/slices/pickerSlice";
import F from "./F";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import expirySlice from "../features/slices/ticketExpiry";

import Images from "./Images";
import {
  Entry,
  GameData,
  RootEventData,
} from "../features/slices/RacingGameSlice";
import moment from "moment";

interface TableProp {
  clickCount: (val: number) => void;
  isClear?: boolean;
  isActivatedtablebutton: Set<number>;
  isActiveBank?: number;
  handleColorChange: (index: number) => void;
  handleBankColorChange: (index: number) => void;
  data: RootEventData;
  gameData: GameData;
  sortedByOdd: Entry[];
}

const BasicTable: React.FC<TableProp> = ({
  clickCount,
  isClear,
  isActivatedtablebutton,
  isActiveBank,
  handleColorChange,
  handleBankColorChange,
  data,
  gameData,
  sortedByOdd,
}) => {
  const [clickCounter, setClickCounter] = useState<number>(0);
  const [clickedindex, setClickedindex] = useState<number>(0);
  const [Addst, setAddst] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);
  const gameType = useAppSelector((state) => state.gameType.gameType);
  const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);
  const repeatState = useAppSelector((state) => state.repeat);
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);
  const betSlip = useAppSelector((state) => state.picker.betSlip);
  const currentDate = new Date().getTime();
  const [clickOrder, setClickOrder] = useState<number[]>([]);
  const [bankclickOrder, setbankClickOrder] = useState<number>();
  const [changedForm, setchangedForm] = useState<number[]>([]);
  const [sortedArray, setSortedArray] = useState<Entry[]>([]);
  const [inited, setInited] = useState(false);
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const handleClick = (Form: number, row: Entry) => {
    setClickedindex(Form);
    dispatch(addPickedNumbers(gamet));
    setClickCounter((prev) => {
      const newValue = prev + 1;
      clickCount(newValue);

      return newValue;
    });
    let newClickOrder = [...clickOrder];
    const newClickset = [...changedForm];
    if (newClickOrder.includes(index)) {
      newClickOrder = newClickOrder.filter((i) => i !== index);
    }

    changedForm.push(index);
    newClickset.push(index);
    newClickOrder.push(index);
    if (newClickOrder.length > 2) {
      setClickOrder([]);
    }

    setClickOrder(newClickOrder);
  };
  const handleBankClick = (index: number) => {
    if (index) {
      setbankClickOrder(index);
    }
  };

  useEffect(() => {
    if (sortedByOdd && !inited) {
      setInited(true);
      const sorted = sortedByOdd.sort((a, b) => {
        return parseInt(a.Form) - parseInt(b.Form);
      });
      setSortedArray(sorted);
    }
  }, [sortedByOdd]);
  useEffect(() => {
    console.log("isClear", isClear);
    if (isClear) {
      setClickCounter(0);
      setClickOrder([]);
      setbankClickOrder(0);
      setchangedForm([]);
    }
  }, [isClear]);
  const handleDispatch = (
    selected: any,
    multiplier: number,
    toWin: number,
    stake: number,
    gameId: string,
    entry: Entry,
    gameType: string,
    oddtype: string
  ) => {
    console.log(
      "BETSLIP_UPDATE_REQUESTED",
      checkIsSelected(entry, oddtype),
      oddtype
    );
    if (!checkIsSelected(entry, oddtype)) {
      dispatch(
        addToBetSlip({
          selected: selected,
          expiry: new Date(
            moment(data.AdjustedStartTime).toISOString()
          ).getTime(),
          multiplier: multiplier,
          toWin: toWin,
          stake: toWin,
          gameId: gameId,
          gameType: gameType,
          entry: entry,
          oddType: oddtype,
        })
      );
    } else {
      const index = betSlip.findIndex((value) => {
        if (value.entry === entry && value.oddType === oddtype) return true;
      });
      console.log("BETSLIP_UPDATE_REQUESTED_INDEX", index);
      dispatch(removeFromBetSlip(index));
    }
  };
  const getButtonText = (index: number): string => {
    if (clickCounter > 3) {
      return `${index + 1}`;
    }
    const orderIndex = clickOrder.indexOf(index);
    switch (orderIndex) {
      case -1:
        return `${index + 1}`;
      case 0:
        return "1st";
      case 1:
        return "2nd";
      case 2:
        return "3rd";
      default:
        return `${index + 1}`;
    }
  };
  const checkIsSelected = (row: Entry, type: string) => {
    const index = betSlip.findIndex((value) => {
      if (value.entry === row && value.oddType === type) return true;
    });

    if (index > -1) return true;
    return false;
  };

  useEffect(() => {
    console.log("BETSLIP_UPDATE", betSlip);
  }, [betSlip]);

  return (
    <TableContainer className="tableContainer">
      <Table
        sx={{
          minWidth: 400,
          "& .css-d4m83a-MuiTable-root": {
            width: "0%",
          },
        }}
        aria-label="simple table"
        className="table"
      >
        <TableHead className="TableHead">
          <TableRow>
            <TableCell align="center">No</TableCell>
            <TableCell align="left">Silk</TableCell>
            <TableCell align="left">Player Name</TableCell>
            <TableCell align="center">Rating</TableCell>
            <TableCell align="center">Last5</TableCell>
            <TableCell align="center">Win</TableCell>
            <TableCell align="center">Place</TableCell>
            <TableCell align="center" className="Combo">
              Combo
            </TableCell>
            <TableCell align="center">Bank</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="tableBody">
          {sortedArray.length > 0 &&
            sortedByOdd.length > 0 &&
            inited &&
            sortedArray.map((row, index: number) => {
              return (
                <TableRow key={row.name} className="Tablerow">
                  <TableCell align="right">{row.Draw}</TableCell>

                  <TableCell>
                    <div className="flex items-center w-full">
                      <Images
                        src={`https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="name" align="left">
                    <p className="name">{row.Name}</p>
                  </TableCell>
                  <TableCell align="right" className="tableContent f">
                    {inited &&
                      sortedByOdd.findIndex((item) => item === row) < 3 && (
                        <F />
                      )}
                  </TableCell>
                  <TableCell align="right" className="tableContent rating">
                    <BasicRating />
                  </TableCell>
                  <TableCell
                    align="right"
                    className="tableContent texts text-2xl"
                  >
                    {row.Form}
                  </TableCell>
                  <TableCell
                    align="right"
                    className="tableContent buttonsTable"
                  >
                    <ButtonSizes
                      text={row.WinOdds + ""}
                      isActive={checkIsSelected(row, "WIN")}
                      isLocked={true}
                      onClick={() => {
                        handleDispatch(
                          [parseInt(row.Form)],
                          row.WinOdds,
                          100,
                          10,
                          gameData.id,
                          row,
                          "dog",
                          "WIN"
                        );
                      }}
                      numberofClickedbuttons={clickCounter}
                      isCombo={false}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`tableContent buttonsTable`}
                  >
                    <ButtonSizes
                      text={row.PlaceOdds + ""}
                      isActive={checkIsSelected(row, "PLACE")}
                      onClick={() => {
                        handleDispatch(
                          [parseInt(row.Form)],
                          row.PlaceOdds,
                          100,
                          10,
                          gameData.id,
                          row,
                          "dog",
                          "PLACE"
                        );
                      }}
                      numberofClickedbuttons={clickCounter}
                      isCombo={false}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`tableContent buttonsTable`}
                  >
                    {
                      <ButtonSizes
                        text={row.PlaceOdds + ""}
                        isActive={
                          checkIsSelected(row, "PLACE") ||
                          checkIsSelected(row, "WIN")
                          // isActivatedtablebutton?.has(index * 4 + 1) || false
                        }
                        onClick={() => {
                          // handleDispatch("12.4", 1, 10, 12, 12, 6000);
                        }}
                        numberofClickedbuttons={clickCounter}
                        isCombo={true}
                        isChangedForm={changedForm.includes(index) || false}
                      />
                    }
                  </TableCell>
                  <TableCell
                    align="right"
                    className="tableContent bank buttonsTable"
                  >
                    {" "}
                    <ButtonSizes
                      text={
                        bankclickOrder === index + 1
                          ? `${1 + "st"}`
                          : (index + 1).toString()
                      }
                      isBankActive={isActiveBank === index || false}
                      isDesabled={
                        clickOrder.length > 0 && clickOrder.includes(index)
                          ? false
                          : true
                      }
                      onClick={() => {
                        handleBankClick(index + 1);
                        handleBankColorChange(index);
                      }}
                      isCombo={true}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
