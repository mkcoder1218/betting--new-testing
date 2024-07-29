import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import LockIcon from "@mui/icons-material/Lock";
import HeadToHead from "./HeadtoHead";
interface ButtonProp {
  text: string;
  SvgIconComponent?: React.ComponentType<SvgIconProps>;
  isDesabled?: boolean;
  onClick?: (val: number) => void;
  numberofClickedbuttons?: number;
  isLocked?: boolean;
  isActive?: boolean;
  isCombo?: boolean;
  isBankActive?: boolean;
  isHeadToHead?: boolean;
  isChangedForm?: boolean;
}
const ButtonSizes: React.FC<ButtonProp> = ({
  text,
  isActive,
  SvgIconComponent,
  isDesabled,
  onClick,
  numberofClickedbuttons,
  isLocked,
  isCombo,
  isBankActive,
  isHeadToHead,
  isChangedForm,
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
      return text;
    }
  };

  const { number, suffix } = splitText(text);
  const classNames = [
    text !== "Clear" && "button",
    isCombo ? "isCombo" : "notCombo",
    isHeadToHead && "headtohead",
    !isActive && !isCombo && "notCombo-color text-white",
    isActive && "whiteColor override",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Box sx={{ "& button": { m: 0 } }}>
      <div className="buttonContaiener" style={{}}>
        {isLocked ? <LockIcon className="z-20 lock text-black" /> : ""}
        <Button
          sx={{
            borderColor: isBankActive ? "transparent" : "green",
            padding: isCombo ? "8px -300px" : "",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              isChangedForm || (isActive && text !== "clear")
                ? "green"
                : isBankActive
                ? "	orange"
                : "transparent",
            color: isActive ||isChangedForm || isBankActive ? "white" : "gray",
          }}
          disabled={isDesabled}
          variant="outlined"
          size="small"
          className={`${classNames}`}
          endIcon={SvgIconComponent ? <SvgIconComponent /> : null}
          onClick={onClick}
        >
          {isCombo || isHeadToHead ? (
            <div
              className={`flex p-0 ${
                isHeadToHead ? "gap-8" : "gap-0"
              } justify-center items-center`}
            >
              <p
                className={`${suffix && !HeadToHead ? "text-xs" : ""}`}
                style={{ padding: "0px" }}
              >
                {number}
              </p>
              <p className="" style={{ fontSize: !isHeadToHead ? 8 : "" }}>
                {suffix}
              </p>
            </div>
          ) : (
            <p style={{ padding: "0px" }}>{text}</p>
          )}
        </Button>
      </div>
    </Box>
  );
};
export default ButtonSizes;
