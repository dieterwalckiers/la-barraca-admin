import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from "react";
import {useRouter} from 'sanity/router'
import {Spinner} from '@sanity/ui'
import {useClient} from 'sanity'
import ReactionsOverview from "./ReactionsOverview";
import { normalizeSeason } from "../shared/helpers";
import ProductionTree from "../shared/ProductionTree/index.jsx";
import { ThemeProvider, createTheme } from "@mui/material";
import { getReactionsForProduction } from "./api";
// Removed gql import - using GROQ instead

// Import styles
import styles from "../shared/ProductionInfoPlugin.css?inline";

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

const ReactionsInner = () => {
    const router = useRouter()
    const client = useClient()
    
    const [selectedProductionSheetId, setSelectedProductionSheetId] = useState(null)
    const [seasons, setSeasons] = useState();
    const [reactions, setReactions] = useState();

    const allProductions = useMemo(() => (seasons || []).reduce((acc, season) => [...acc, ...season.productions], []));

    const handleReceiveSeasons = useCallback(
        (seasons) => {
            setSeasons(seasons.map(s => normalizeSeason(s)));
        },
        [setSeasons]
    );

    const selectedProduction = useMemo(() => {
        if (!selectedProductionSheetId || !allProductions) {
            return undefined;
        }
        return allProductions.find(p => p.sheetId === selectedProductionSheetId);
    }, [selectedProductionSheetId, allProductions]);

    const onProductionClick = useCallback(
        production => {
            setSelectedProductionSheetId(production.sheetId)
        },
        []
    );

    useEffect(() => {
        const query = `*[_type == "season"] | order(startYear desc) {
            _id,
            startYear,
            endYear,
            isCurrent,
            productions[] {
                _key,
                title,
                permalink,
                googleSheetId,
                slug
            }
        }`;
        
        client.fetch(query)
            .then(result => {
                handleReceiveSeasons(result || [])
            })
            .catch(error => {
                console.error('Error fetching seasons:', error)
            })
    }, [client, handleReceiveSeasons]);

    useEffect(() => {
        if (selectedProduction) {
            getReactionsForProduction(selectedProduction)
                .then(reactions => setReactions(reactions))
                .catch(error => {
                    console.error('Error fetching reactions:', error)
                    setReactions([])
                })
        }
    }, [selectedProduction]);

    if (!seasons) {
        return <Spinner />
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <ProductionTree
                    seasons={seasons}
                    onProductionClick={onProductionClick}
                    selectedProductionSheetId={selectedProductionSheetId}
                />
            </div>
            <div className={styles.right}>
                <h3>Reacties</h3>
                {selectedProduction && (
                    <p>
                        <b>{selectedProduction.title}</b>
                    </p>
                )}
                {reactions && (
                    <ReactionsOverview reactions={reactions} production={selectedProduction} />
                )}
            </div>
        </div>
    );
};

const Reactions = () => (
    <ThemeProvider theme={theme}>
        <ReactionsInner />
    </ThemeProvider>
);

export default Reactions;