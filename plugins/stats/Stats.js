import { ThemeProvider } from "@mui/material";

const Stats = (props) => {

};


const StatsWrapper = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <Stats {...props} />
        </ThemeProvider>
    );
};

export default StatsWrapper;
