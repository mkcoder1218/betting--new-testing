import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";

export default function BasicRating() {
  const [value, setValue] = React.useState<number | null>(2);

  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <Rating
        className="Rating"
        name="text-feedback"
        value={value}
        readOnly
        precision={0.1}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />{" "}
    </Box>
  );
}
