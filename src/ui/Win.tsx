import * as React from "react";
import { memo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SvgIconProps } from "@mui/material/SvgIcon";
import LockIcon from "@mui/icons-material/Lock";
import HeadToHead from "./HeadtoHead";
interface ButtonProp {
  text: string;
  text2?: string;
  SvgIconComponent?: React.ComponentType<SvgIconProps>;
  isDesabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  numberofClickedbuttons?: number;
  isLocked?: boolean;
  isActive?: boolean;
  isCombo?: boolean;
  isBankActive?: boolean;
  isHeadToHead?: boolean;
  isChangedForm?: boolean;
  isWinner?: boolean;
  selectionOrder?: number; // Add this prop for tracking selection order (1st, 2nd, 3rd)
  clickOrder?: number[]; // Add this prop to track all selections
  isReadOnly?: boolean; // Add this prop to indicate if the button is read-only
}
const ButtonSizes: React.FC<ButtonProp> = ({
  text,
  isActive,
  SvgIconComponent,
  onClick,
  isLocked,
  isCombo,
  isBankActive,
  isHeadToHead,
  isChangedForm,
  isDesabled,
  isWinner,
  selectionOrder,
  clickOrder,
  isReadOnly,
}) => {
  const splitText = (text: string) => {
    const match =
      text && isHeadToHead
        ? text.match(/([A-Za-z\s]+)(\d+\.\d+)/)
        : text.match(/(\d+)(\D*)/);
    if (isCombo || isHeadToHead) {
      if (match) {
        return { number: match[1], suffix: match[2] };
      }
      return { number: text, suffix: "" };
    } else {
      return { number: text, suffix: "" };
    }
  };

  const { number, suffix } = text ? splitText(text) : {};
  const classNames = [
    text !== "Clear" && "button",
    isCombo ? "isCombo" : "notCombo",
    isHeadToHead && "headtohead",
    !isActive && !isCombo && !isLocked && "notCombo-color text-white",
    isActive && "text-white !bg-[#257832] isActive override",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Box sx={{ "& button": { m: 0 } }}>
      <div className="buttonContaiener" style={{}}>
        {isLocked ? <LockIcon className="z-20 lock text-black" /> : ""}
        <Button
          sx={{
            borderColor: isCombo ? "green" : isBankActive ? "#FFD700" : "green",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              (isLocked && isWinner) ||
              isChangedForm ||
              (isActive && text !== "clear")
                ? "green"
                : isBankActive
                ? "#FFD700" // Golden color for active bank buttons
                : isCombo ? "transparent" : "#fff",
            color:
              isActive || isChangedForm ? "white" : isBankActive ? "black" : "black",
            minWidth: "45px",
            padding: (!isCombo && !isBankActive) ? "7px 9px" : "6px 5px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1rem",
            border: isCombo ? "0.5px solid green" : isBankActive ? "0.5px solid #FFD700" : "1px solid #ddd",
            // Add a visual indicator for read-only buttons
            opacity: isReadOnly ? 0.7 : 1,
            cursor: isReadOnly ? 'default' : 'pointer',
          }}
          disabled={isLocked || isDesabled || isReadOnly}
          variant="outlined"
          size="small"
          className={`${classNames} ${isActive && !isCombo ? "!bg-yellow-300 isActive !text-black" : ""} ${isReadOnly ? "read-only" : ""}`}
          endIcon={SvgIconComponent ? <SvgIconComponent /> : null}
          onClick={isReadOnly ? undefined : onClick}
        >
          {isCombo || isHeadToHead ? (
            <div
              className={`flex p-0 ${
                isHeadToHead ? "gap-10" : "gap-0"
              } justify-center items-center`}
            >
              {/* For combo buttons with selection order, show the order number */}
              {selectionOrder && selectionOrder > 0 ? (
                <p
                  className="font-light"
                  style={{
                    padding: "0px",
                    color: isActive || isChangedForm ? "white" : isBankActive ? "black" : "green",
                    fontWeight: isCombo || isBankActive ? "300" : "bold", // Lighter for combo and bank
                  }}
                >
                  {/* For Combo buttons, show 1st, 2nd, 3rd for first 3 selections if total <= 3 */}
                  {isCombo
                    ? (clickOrder && clickOrder.length <= 3
                      ? (selectionOrder === 1
                          ? <span>1<sup className="text-[8px] font-light">st</sup></span>
                        : selectionOrder === 2
                          ? <span>2<sup className="text-[8px] font-light">nd</sup></span>
                        : selectionOrder === 3
                          ? <span>3<sup className="text-[8px] font-light">rd</sup></span>
                        : number)
                      : number)
                    /* For Bank buttons, only show 1st for the first selection */
                    : (selectionOrder === 1
                        ? <span>1<sup className="text-[8px] font-light">st</sup></span>
                        : number)}
                </p>
              ) : (
                <>
                  <p
                    className={`${isCombo || isBankActive ? "font-light" : "font-bold"} text-black ${
                      suffix && !HeadToHead ? "text-xs" : ""
                    }`}
                    style={{
                      fontSize: isChangedForm ? 15 : "",
                      padding: "0px",
                      color: isActive || isChangedForm ? "white" : "gray",
                      fontWeight: isCombo || isBankActive ? "300" : "bold", // Lighter for combo and bank
                    }}
                  >
                    {/* For Win and Place buttons, show the row number */}
                    {number}
                  </p>
                  <p
                    className=""
                    style={{
                      fontSize: !isHeadToHead ? 5 : "",
                      color: isActive || isChangedForm ? "white" : "gray",
                      fontWeight: "bold",
                    }}
                  >
                    {suffix}
                  </p>
                </>
              )}
            </div>
          ) : (
            <span
              className=" text-[15px] !mx-2"
              style={{
                fontWeight: 550,
                color: isActive || isCombo ? "white" : "black",
              }}
            >
              {text}
            </span>
          )}
        </Button>
      </div>
    </Box>
  );
};
export default memo(ButtonSizes);
