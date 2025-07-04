import * as React from "react";
import { memo } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";

interface Rating {
  isHeadToHead?: boolean;
  rating?: number;
}
function BasicRating(Props: Rating) {
  const [value, setValue] = React.useState<number | null>(
    Props.rating ? Props.rating : 2
  );

  return (
    <Box
      sx={{
        "& > legend": {},
        padding: 0,
      }}
    >
      <Rating
        className="Rating p-0"
        name="text-feedback"
        value={value}
        readOnly
        precision={0.1}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />{" "}
    </Box>
  );
}

export default memo(BasicRating);
