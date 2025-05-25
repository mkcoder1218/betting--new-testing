import * as React from "react";
import { memo } from "react";
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
        sx={{
          color: '#e0e0e0', // Equivalent to grey[200]
        }}
        size={50}
        thickness={5}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: "#008000",
          animationDuration: "1000ms",
          position: "absolute",
          zIndex: 9999,
          opacity:"1",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={50}
        thickness={5}
        {...props}
      />
    </Box>
  );
}

function CircularUnderLoad() {
  return (
    <Stack spacing={2} className="bg-black/10 min-w-[100vw] min-h-[100vw]" sx={{ flexGrow: 1 }} style={{display:'flex',justifyContent:'center',alignItems:"center",marginTop:'-30em'}}>
      <FacebookCircularProgress />
    </Stack>
  );
}

export default memo(CircularUnderLoad);
