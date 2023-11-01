
import React, { useCallback, useState, useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { byKey } from "../helpers";
import styles from "../ProductionInfoPlugin.css"
import { StateLink, withRouterHOC, IntentLink } from "part:@sanity/base/router";

const ProductionTree = ({ selectedProductionSlug, seasons }) => {


    const [expandedKey, setExpandedKey] = useState();

    useEffect(() => {
        if (!seasons) {
            return;
        }
        const currentSeason = seasons.find(s => s.isCurrent);
        if (currentSeason) {
            setExpandedKey(currentSeason.key);
        }
    }, [seasons]);

    const renderProductions = useCallback((productions) => {
        return (
            <ul className={styles.list}>
                {productions.map((prod) => {
                    return (
                        <li
                            key={`prod${prod.id}`}
                            className={selectedProductionSlug === prod.slug ? styles.listItemActive : styles.listItem}
                        >
                            <StateLink state={{ selectedProductionSlug: prod.slug }}>
                                {prod.title}
                            </StateLink>
                        </li>
                    )
                })}
            </ul>
        )
    }, [selectedProductionSlug]);

    const renderSeason = useCallback((season, i) => {
        const { key, productions } = season;
        return (
            <Accordion key={`acc${i}`}
                expanded={key === expandedKey}
                onChange={() => setExpandedKey(key)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    {`Seizoen ${season.startYear} - ${season.endYear}`}
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                        {renderProductions(productions)}
                    </div>
                </AccordionDetails>
            </Accordion>
        )
    }, [expandedKey, setExpandedKey, renderProductions]);

    return (
        <div className={styles.productionTreeWrapper}>
            {seasons.sort(byKey).map(renderSeason)}
        </div>
    );

};

export default ProductionTree;
