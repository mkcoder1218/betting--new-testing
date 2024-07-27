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
}

const rows = [
  createData("Name", 159, 6.0, 1, 1),
  createData("Name", 237, 9.0, 2, 2),
  createData("Name", 262, 16.0, 3, 3),
  createData("Name", 305, 3.7, 4, 4),
  createData("Name", 356, 16.0, 5, 5),
  createData("Name", 356, 16.0, 6, 6),
];

const BasicTable: React.FC<TableProp> = ({
  clickCount,
  isClear,
  isActivatedtablebutton,
  handleColorChange,
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
          {rows.map((row, index: number) => {
            return (
              <TableRow key={row.name} className="Tablerow">
                <TableCell scope="row" className="name">
                  {row.name}
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
                  1,2,3,4,5,6
                </TableCell>
                <TableCell align="right" className="tableContent buttonsTable">
                  <ButtonSizes
                    text="12.4"
                    isActive={isActivatedtablebutton?.has(index * 4) || false}
                    isLocked={true}
                    onClick={() => {
                      handleColorChange(index * 4);
                      handleDispatch("12.4", 1, 10, 12, 12, 6000);
                    }}
                  />
                </TableCell>
                <TableCell align="right" className="tableContent buttonsTable">
                  <ButtonSizes
                    text="12.4"
                    isActive={
                      isActivatedtablebutton?.has(index * 4 + 1) || false
                    }
                    onClick={() => {
                      handleColorChange(index * 4 + 1);
                      handleDispatch("12.4", 1, 10, 12, 12, 6000);
                    }}
                  />
                </TableCell>
                <TableCell align="right" className="tableContent buttonsTable">
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
                <TableCell align="right" className="tableContent buttonsTable">
                  {" "}
                  <ButtonSizes
                    text={row.Bank.toString()}
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
