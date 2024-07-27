import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import LockIcon from "@mui/icons-material/Lock";
interface ButtonProp {
  text: string;
  SvgIconComponent?: React.ComponentType<SvgIconProps>;
  isDesabled?: boolean;
  onClick?: (val: number) => void;
  numberofClickedbuttons?: number;
  isLocked?: boolean;
  isActive?: boolean;
}
const ButtonSizes: React.FC<ButtonProp> = ({
  text,
  isActive,
  SvgIconComponent,
  isDesabled,
  onClick,
  numberofClickedbuttons,
  isLocked,
}) => {
  return (
    <Box sx={{ "& button": { m: 0 } }}>
      <div className="buttonContaiener">
        {isLocked ? <LockIcon /> : ""}
        <Button
          sx={{
            borderColor: "green",
            "&:hover": {
              borderColor: "darkgreen",
              backgroundColor: "green",
              color: "white",
            },
            backgroundColor: isActive ? "green" : "transparent",
            color: isActive ? "white" : "black",

            padding: "2px 6px",
            fontSize: "12px",
          }}
          disabled={isDesabled}
          variant="outlined"
          size="small"
          className="button"
          endIcon={SvgIconComponent ? <SvgIconComponent /> : null}
          onClick={onClick}
        >
          {text}
        </Button>
      </div>
    </Box>
  );
};
export default ButtonSizes;
