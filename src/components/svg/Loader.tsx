import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function CircularUnderLoad() {
  return (
    <CircularProgress
      className=""
      style={{ width: "5rem", height: "5rem", color: "#38b000" }}
    />
  );
}
