import React from "react";
import Container from "../pages/CashierplayContainer";
import "../styles/spin.css";
import Timer from "../pages/timer";
function Spin() {
  return (
    <div className="App">
      <div className="parent-container">
        <Timer />
        <Container />
      </div>
    </div>
  );
}

export default Spin;
