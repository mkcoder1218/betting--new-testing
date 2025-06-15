import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BasicRating from "./Rating";
import ButtonSizes from "./Win";
import F from "./F";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addToBetSlip } from "../features/slices/pickerSlice";
import MiniHeadtoHead from "./MiniHeadtoHead";
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}
interface TableProp {
  clickCount: (val: number) => void;
}

const rows = [
  createData("Name", 159, 6.0, 24, 4.0),
  createData("Name", 237, 9.0, 37, 4.3),
  createData("Name", 262, 16.0, 24, 6.0),
  createData("Name", 305, 3.7, 67, 4.3),
  createData("Name", 356, 16.0, 49, 3.9),
];
const HeadToHead: React.FC = () => {
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

  return (
    <div
      className={`HeadtoHeadContainer ${
        gameType !== "GREYHOUND RACING" &&
        gameType !== "Jaguar" &&
        gameType !== "HORSE RACING"
          ? ""
          : "w-full"
      }`}
    >
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
            </TableRow>
          </TableHead>
          <TableBody className="tableBody">
            {rows.map((row) => (
              <TableRow key={row.name} className="Tablerow">
                <TableCell scope="row" className="HeadToHeadName">
                  {row.name}
                  <br />
                  <BasicRating />
                </TableCell>
                <TableCell align="right" className="tableContent f">
                  {" "}
                  <F />
                  <TableCell align="right" className="tableContent">
                    1,2,3,4,5,6
                  </TableCell>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="headtoheadbuttons w-full flex-col justify-center h-full">
        {gameType !== "GREYHOUND RACING" &&
        gameType !== "Jaguar" &&
        gameType !== "HORSE RACING" ? (
          <div className="w-full p-3">
            <p className="text-center uppercase p-3">Head to Head</p>
            <div className="w-full">
              <MiniHeadtoHead />
              <MiniHeadtoHead />
              <MiniHeadtoHead />
            </div>
          </div>
        ) : (
          ""
        )}
        <div>
          <p className="text-center mt-10 uppercase">The Winner Must Be An:</p>
          <div className="flex-col w-full h-full justify-center">
            <div className="oddeven flex justify-center">
              <ButtonSizes
                text="ODD 1.2"
                onClick={() => handleDispatch("12.4", 1, 10, 12, 12, 6000)}
                isHeadToHead={true}
              />
              <ButtonSizes
                text="EVEN 1.2"
                onClick={() => handleDispatch("12.4", 1, 10, 12, 12, 6000)}
                isHeadToHead={true}
              />
            </div>
            <div className="highlow flex justify-center ">
              <ButtonSizes
                text="LOW 1.2"
                isHeadToHead={true}
                onClick={() => handleDispatch("12.4", 1, 10, 12, 12, 6000)}
              />
              <ButtonSizes
                text="HIGH 1.2"
                isHeadToHead={true}
                onClick={() => handleDispatch("12.4", 1, 10, 12, 12, 6000)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadToHead;
