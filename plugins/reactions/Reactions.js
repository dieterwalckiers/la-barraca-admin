import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from "react";
import { StateLink, withRouterHOC, IntentLink } from "part:@sanity/base/router";
import Spinner from "part:@sanity/components/loading/spinner";
import client from "part:@sanity/base/client";
import ReactionsOverview from "./ReactionsOverview";
import { normalizeSeason } from "../shared/helpers";
import ProductionTree from "../shared/ProductionTree";
import { ThemeProvider, createTheme } from "@mui/material";
import { getReactionsForProduction } from "./api";

// Sanity uses CSS modules for styling. We import a stylesheet and get an
// object where the keys matches the class names defined in the CSS file and
// the values are a unique, generated class name. This allows you to write CSS
// with only your components in mind without any conflicting class names.
// See https://github.com/css-modules/css-modules for more info.
import styles from "../shared/ProductionInfoPlugin.css";

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

const Reactions = (props) => {
    const { router } = props;

    const [seasons, setSeasons] = useState();
    const [reactions, setReactions] = useState();

    const allProductions = useMemo(() => (seasons || []).reduce((acc, season) => [...acc, ...season.productions], []));

    const handleReceiveSeasons = useCallback(
        (seasons) => {
            setSeasons(seasons.map(s => normalizeSeason(s)));
        },
        [setSeasons]
    );

    useEffect(() => {
        client.observable
            .fetch(
                '*[_type == "season"]{_id,isCurrent,startYear,endYear,"productions": productions[]{title, _key, slug, googleSheetId}}'
            )
            .subscribe(handleReceiveSeasons);
    }, []);

    const selectedProductionSheetId = useMemo(
        () => router.state && router.state.selectedProductionSheetId,
        [router]
    );

    useEffect(() => {
        if (!selectedProductionSheetId) {
            return;
        }
        getReactionsForProduction(selectedProductionSheetId).then(reactions => {
            console.log("got reactions", reactions);
            setReactions(reactions);
        });
    }, [selectedProductionSheetId]);

    const renderProductionTree = useCallback(() => {
        if (!seasons) {
            return (
                <div className={styles.list}>
                    <Spinner message="Loading..." center />
                </div>
            );
        }
        return (
            <ProductionTree
                selectedProductionId={selectedProductionSheetId}
                seasons={seasons}
            />
        );
    }, [seasons, selectedProductionSheetId]);

    const renderReactions = useCallback(() => {
        if (!reactions) {
            return (
                <div className={styles.document}>
                    <Spinner message="Reacties worden geladen..." center />
                </div>
            );
        }
        return (
            <ReactionsOverview
                production={allProductions.find(p => p.googleSheetId === selectedProductionSheetId)}
                reactions={reactions}
            />
        );
    }, [reactions]);

    return (
        <div className={styles.container}>
            {renderProductionTree()}
            {selectedProductionSheetId && renderReactions()}
        </div>
    );
};

const ReactionsWrapper = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <Reactions {...props} />
        </ThemeProvider>
    );
};

export default withRouterHOC(ReactionsWrapper);

