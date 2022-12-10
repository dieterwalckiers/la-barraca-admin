import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from "react";

// Sanity uses CSS modules for styling. We import a stylesheet and get an
// object where the keys matches the class names defined in the CSS file and
// the values are a unique, generated class name. This allows you to write CSS
// with only your components in mind without any conflicting class names.
// See https://github.com/css-modules/css-modules for more info.
import styles from "./Stats.css"
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import ApolloClientProvider from "../shared/ApolloClientProvider";
import ApolloClientProvider from "../shared/ApolloClientProvider";
import ProductionTree from "../shared/ProductionTree";
import { ThemeProvider, createTheme } from "@mui/material";

const Stats = (props) => {
    
};


const StatsWrapper = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <ApolloClientProvider>
                <Stats {...props} />
            </ApolloClientProvider>
        </ThemeProvider>
    );
};

export default StatsWrapper;
