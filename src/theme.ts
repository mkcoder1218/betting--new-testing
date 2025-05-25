// Import from @mui/material/styles to use the correct version
import { createTheme } from '@mui/material/styles';

// Create a simple theme instance with minimal configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1CA54F',
    },
    secondary: {
      main: '#696969',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

export default theme;
