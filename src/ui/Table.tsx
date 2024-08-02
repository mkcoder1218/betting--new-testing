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
  addToBetSlip,
  clearNumbers,
} from "../features/slices/pickerSlice";
import F from "./F";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import expirySlice from "../features/slices/ticketExpiry";

import Images from "./Images";
import { RootEventData } from "../features/slices/RacingGameSlice";

interface TableProp {
  clickCount: (val: number) => void;
  isClear?: boolean;
  isActivatedtablebutton: Set<number>;
  isActiveBank?: number;
  handleColorChange: (index: number) => void;
  handleBankColorChange: (index: number) => void;
  HeadTexttoTable?: string;
  data: RootEventData;
  selectedCombos?: (val: number) => void;
}

interface DispatchParams {
  selected: any;
  multiplier: number;
  toWin: number;
  expiry?: number;
  stake: number;
  gameId: number;
  draw?: number;
  stakeInfo?: string;
}
const BasicTable: React.FC<TableProp> = ({
  clickCount,
  isClear,
  isActivatedtablebutton,
  isActiveBank,
  handleColorChange,
  selectedCombos,
  handleBankColorChange,
  HeadTexttoTable,
  data,
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
  const HeadText = useAppSelector((state) => state.Head.Name);
  const currentDate = new Date().getTime();
  const [clickOrder, setClickOrder] = useState<number[]>([]);
  const [bankclickOrder, setbankClickOrder] = useState<number>();
  const [changedForm, setchangedForm] = useState<number[]>([]);
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const handleClick = (index: number) => {
    setClickedindex(index);
    selectedCombos(index);
    console.log("Headtext", HeadText);

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
    console.log("gamesData", data);
  }, [isActivatedtablebutton]);
  useEffect(() => {
    console.log("isClear", isClear);
    if (isClear) {
      setClickCounter(0);
      setClickOrder([]);
      setbankClickOrder(0);
      setchangedForm([]);
    }
  }, [isClear]);
  const handleDispatch = (params: DispatchParams) => {
    for (let i = 0; i < repeatState.repeat; i++) {
      dispatch(
        addToBetSlip({
          selected: params.selected,
          expiry: expiryOfGame ? expiryOfGame : ticketExpiry,
          multiplier: params.multiplier,
          toWin: params.toWin,
          stake: params.toWin,
          gameId: params.gameId,
          gameType: gameType,
          draw: params.draw,
          stakeInformation: params.stakeInfo,
        })
      );
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

  return (
    <TableContainer className="tableContainer">
      <Table aria-label="simple table" className="table">
        <TableHead className="TableHead">
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="center">Rating</TableCell>
            <TableCell align="center">Last5</TableCell>
            <TableCell align="center">
              {" "}
              {HeadText === "ALT" ? "2nd" : "Win"}
            </TableCell>
            <TableCell align="center">
              {" "}
              {HeadText === "ALT" ? "3rd" : "Place"}
            </TableCell>
            <TableCell align="center" className="Combo">
              {HeadText === "ALT" ? "Last 3" : "Combo"}
            </TableCell>
            <TableCell align="center">
              {" "}
              {HeadText === "ALT" ? "Last" : "Bank"}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="tableBody">
          {data &&
            data.eventDetail &&
            data.eventDetail.Event &&
            data.eventDetail.Event.Race &&
            data.eventDetail.Event.Race.Entries.map((row, index: number) => {
              const rating = (row.StarRating / 100) * 5;
              return (
                <TableRow key={row.Name} className="Tablerow">
                  <TableCell scope="row" className="nam">
                    <div
                      className={`flex items-center ${
                        row.Draw < 10 ? "gap-3" : "gap-1"
                      }`}
                      style={{ width: "190%" }}
                    >
                      <p className={`${row.Draw > 10 ? "-ml-1" : ""}`}>
                        {row.Draw}
                      </p>
                      {
                        <Images
                          src={`https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`}
                        />
                      }
                      <div className="flex flex-row w-full">
                        <p className="text-justify nameText">{row.Name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right" className="tableContent f">
                    {" "}
                    {row.Favorite ? <F favoritenumber={row.Favorite} /> : ""}
                  </TableCell>
                  <TableCell align="right" className="tableContent rating">
                    {" "}
                    <BasicRating rating={rating} />
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
                      isActive={isActivatedtablebutton?.has(index * 4) || false}
                      isLocked={true}
                      onClick={() => {
                        handleClick(index);
                        handleColorChange(index * 4);
                        handleDispatch({
                          selected: row.Name,
                          multiplier: row.WinOdds,
                          toWin: 10,
                          stake: 12,
                          gameId: row.ID,
                          draw: row.Draw,
                          stakeInfo: "win",
                        });
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
                      isActive={
                        isActivatedtablebutton?.has(index * 4 + 1) || false
                      }
                      onClick={() => {
                        handleClick(index);
                        handleColorChange(index * 4 + 1);
                        handleDispatch({
                          selected: row.Name,
                          multiplier: row.PlaceOdds,
                          toWin: 10,
                          stake: 12,
                          gameId: row.ID,
                          draw: row.Draw,
                          stakeInfo: "Place",
                        });
                      }}
                      numberofClickedbuttons={clickCounter}
                      isCombo={false}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`tableContent buttonsTable`}
                  >
                    {" "}
                    {
                      <ButtonSizes
                        text={HeadText === "ALT" ? "1.2" : getButtonText(index)}
                        isActive={
                          isActivatedtablebutton?.has(index * 4 + 2) || false
                        }
                        onClick={() => {
                          handleClick(index);
                          handleColorChange(index * 4 + 2);
                        }}
                        numberofClickedbuttons={clickCounter}
                        isCombo={HeadText === "ALT" ? false : true}
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
                        HeadText === "ALT"
                          ? "1.2"
                          : bankclickOrder === index + 1
                          ? `${1 + "st"}`
                          : (index + 1).toString()
                      }
                      isBankActive={
                        HeadText === "ALT"
                          ? false
                          : isActiveBank === index || false
                      }
                      isActive={
                        HeadText === "ALT"
                          ? isActivatedtablebutton?.has(index * 4 + 3) || false
                          : false
                      }
                      isDesabled={
                        (clickOrder.length > 0 && clickOrder.includes(index)) ||
                        HeadText === "ALT"
                          ? false
                          : true
                      }
                      onClick={() => {
                        HeadText === "ALT"
                          ? (handleClick(index),
                            handleColorChange(index * 4 + 3))
                          : (handleBankClick(index + 1),
                            handleBankColorChange(index));
                      }}
                      isCombo={HeadText === "ALT" ? false : true}
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
