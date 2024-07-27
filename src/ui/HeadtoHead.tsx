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
  return (
    <div className="HeadtoHeadContainer">
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
      <div className="headtoheadbuttons">
        <div className="oddeven">
          <ButtonSizes text="ODD 1.2" />
          <ButtonSizes text="EVEN 1.2" />
        </div>
        <div className="highlow">
          <ButtonSizes text="LOW 1.2" />
          <ButtonSizes text="HIGH 1.2" />
        </div>
      </div>
    </div>
  );
};

export default HeadToHead;
