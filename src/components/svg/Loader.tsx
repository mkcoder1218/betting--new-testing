import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";



function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          color: theme.palette.grey[200],
          ...theme.applyStyles("dark", {
            color: theme.palette.grey[800],
          }),
        })}
        size={50}
        thickness={5}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={(theme) => ({
          color: "#008000",
          animationDuration: "1000ms",
          position: "absolute",
          zIndex: 9999,
          opacity:"1",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
          ...theme.applyStyles("dark", {
            color: "#308fe8",
          }),
        })}
        size={50}
        thickness={5}
        {...props}
      />
    </Box>
  );
}

export default function CircularUnderLoad() {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }} style={{display:'flex',justifyContent:'center',alignItems:"center",marginTop:'-20em'}}>
      <FacebookCircularProgress />
    </Stack>
  );
}
