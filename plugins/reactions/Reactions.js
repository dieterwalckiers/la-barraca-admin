import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from "react";
import { StateLink, withRouterHOC, IntentLink } from "part:@sanity/base/router";
import Spinner from "part:@sanity/components/loading/spinner";
import Preview from "part:@sanity/base/preview";
import client from "part:@sanity/base/client";
import schema from "part:@sanity/base/schema";
import gql from "graphql-tag";
import ReactionsOverview from "./ReactionsOverview";
import { normalizeSeason } from "../shared/helpers";
import { normalizeReaction } from "./helpers";
import { useQuery, useMutation } from "@apollo/client";
import ApolloClientProvider from "../shared/ApolloClientProvider";
import ProductionTree from "../shared/ProductionTree";
import { ThemeProvider, createTheme } from "@mui/material";

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
                '*[_type == "season"]{_id,isCurrent,startYear,endYear,"productions": productions[]{title, _key}}'
            )
            .subscribe(handleReceiveSeasons);
    }, []);

    const selectedProductionId = useMemo(
        () => router.state && router.state.selectedProductionId,
        [router]
    );

    const { data: reactionsData } = useQuery(gql`
        query ReactionsByProductionID($productionID: String!) {
            reactionsByProductionID(productionID: $productionID) {
                data {
                    _id
                    productionID
                    email
                    name
                    text
                    internalReactionText
                    score
                    created
                }
            }
        }
    `, { variables: { productionID: selectedProductionId }, skip: !selectedProductionId });

    useEffect(() => {
        if (reactionsData) {
            console.log("reactionsData", reactionsData);
            const {
                reactionsByProductionID: { data: reactionsDataRaw },
            } = reactionsData;
            const reactions = reactionsDataRaw; // .map(normalizeReaction).sort(({ date: date1 }, { date: date2 }) => date1.isBefore(date2) ? -1 : 1);
            setReactions(reactions.map(normalizeReaction));
        }
    }, [reactionsData, setReactions]);

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
                selectedProductionId={selectedProductionId}
                seasons={seasons}
            />
        );
    }, [seasons, selectedProductionId]);

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
                production={allProductions.find(p => p.id === selectedProductionId)}
                reactions={reactions}
            />
        );
    }, [reactions]);

    return (
        <div className={styles.container}>
            {renderProductionTree()}
            {selectedProductionId && renderReactions()}
        </div>
    );
};

const ReactionsWrapper = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <ApolloClientProvider>
                <Reactions {...props} />
            </ApolloClientProvider>
        </ThemeProvider>
    );
};

export default withRouterHOC(ReactionsWrapper);
