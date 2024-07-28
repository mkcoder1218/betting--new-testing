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
import { RootEventData } from "../features/slices/RacingGameSlice";
function createData(
  name: string,
  calories: number,
  fat: number,
  combo: number,
  Bank: number
) {
  return { name, calories, fat, combo, Bank };
}
interface TableProp {
  clickCount: (val: number) => void;
  isClear?: boolean;
  isActivatedtablebutton: Set<number>;
  handleColorChange: (index: number) => void;
  data: RootEventData;
}

const BasicTable: React.FC<TableProp> = ({
  clickCount,
  isClear,
  isActivatedtablebutton,
  handleColorChange,
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
  const currentDate = new Date().getTime();
  const [clickOrder, setClickOrder] = useState<number[]>([]);
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const handleClick = (index: number) => {
    setClickedindex(index);
    console.log("clickedindex", clickedindex, "index", index);

    setClickCounter((prev) => {
      const newValue = prev + 1;
      clickCount(newValue);

      return newValue;
    });
    let newClickOrder = [...clickOrder];

    if (newClickOrder.includes(index)) {
      newClickOrder = newClickOrder.filter((i) => i !== index);
    }

    newClickOrder.push(index);

    if (newClickOrder.length > 2) {
      setClickOrder([]);
    }

    setClickOrder(newClickOrder);
  };

  useEffect(() => {
    console.log("isActivatedad", isActivatedtablebutton);
  }, [isActivatedtablebutton]);
  useEffect(() => {
    console.log("isClear", isClear);
    if (isClear) {
      setClickCounter(0);
      setClickOrder([]);
    }
  }, [isClear]);
  const handleDispatch = (
    selected: any,
    multiplier: number,
    toWin: number,
    expiry: number,
    stake: number,
    gameId: number
  ) => {
    for (let i = 0; i < repeatState.repeat; i++) {
      dispatch(
        addToBetSlip({
          selected: selected,
          expiry: expiryOfGame ? expiryOfGame : ticketExpiry,
          multiplier: multiplier,
          toWin: toWin,
          stake: toWin,
          gameId: gameId,
          gameType: gameType,
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
        return `${index + 1}`; // Default case: Return index + 1 as a string
      case 0:
        return "1st";
      case 1:
        return "2nd";
      case 2:
        return "3rd";
      default:
        return `${index + 1}`; // Fallback to default case
    }
  };

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
            <TableCell></TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="center">Rating</TableCell>
            <TableCell align="center">Last5</TableCell>
            <TableCell align="center">Win</TableCell>
            <TableCell align="center">Place</TableCell>
            <TableCell align="center">Combo</TableCell>
            <TableCell align="center">Bank</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="tableBody">
          {data &&
            data.eventDetail &&
            data.eventDetail.Event &&
            data.eventDetail.Event.Race &&
            data.eventDetail.Event.Race.Entries.map((row, index: number) => {
              return (
                <TableRow key={row.Name} className="Tablerow">
                  <TableCell align="center" className="f">
                    <img
                      src={`https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`}
                      style={{
                        height: "50px",
                        width: "50px",
                        marginLeft: "30px",
                      }}
                      width={50}
                    />
                  </TableCell>
                  <TableCell scope="row" className="name">
                    {row.Draw} {row.Name}
                  </TableCell>
                  <TableCell align="right" className="tableContent f">
                    {" "}
                    <F />
                  </TableCell>
                  <TableCell align="right" className="tableContent rating">
                    {" "}
                    <BasicRating />
                  </TableCell>
                  <TableCell align="right" className="tableContent">
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
                        handleColorChange(index * 4);
                        handleDispatch("12.4", 1, 10, 12, 12, 6000);
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    className="tableContent buttonsTable"
                  >
                    <ButtonSizes
                      text={row.PlaceOdds + ""}
                      isActive={
                        isActivatedtablebutton?.has(index * 4 + 1) || false
                      }
                      onClick={() => {
                        handleColorChange(index * 4 + 1);
                        handleDispatch("12.4", 1, 10, 12, 12, 6000);
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    className="tableContent buttonsTable"
                  >
                    {" "}
                    {
                      <ButtonSizes
                        text={getButtonText(index)}
                        isActive={
                          isActivatedtablebutton?.has(index * 4 + 2) || false
                        }
                        onClick={() => {
                          handleClick(index);
                          handleColorChange(index * 4 + 2);
                        }}
                        numberofClickedbuttons={clickCounter}
                      />
                    }
                  </TableCell>
                  <TableCell
                    align="right"
                    className="tableContent buttonsTable"
                  >
                    {" "}
                    <ButtonSizes
                      text={""}
                      isActive={
                        isActivatedtablebutton?.has(index * 4 + 3) || false
                      }
                      isDesabled={true}
                      onClick={() => {
                        handleColorChange(index * 4 + 3);
                      }}
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
