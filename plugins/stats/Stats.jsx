import React from 'react'
import { ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    display: "flex !important",
                    padding: "0 20px !important"
                }
            }
        }
    }
});

const Stats = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h3>Statistics</h3>
            <p>Statistics functionality to be implemented.</p>
        </div>
    );
};

const StatsWrapper = () => {
    return (
        <ThemeProvider theme={theme}>
            <Stats />
        </ThemeProvider>
    );
};

export default StatsWrapper;