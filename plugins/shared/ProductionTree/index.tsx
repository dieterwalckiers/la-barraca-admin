import React, { useCallback, useState, useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { byKey } from "../helpers";
import styles from "../ProductionInfoPlugin.module.css"

interface Season {
  key: string;
  isCurrent: boolean;
  startYear: string;
  endYear: string;
  productions: Array<{
    id: string;
    title: string;
  }>;
}

interface ProductionTreeProps {
  selectedProductionSheetId?: string;
  seasons: Season[];
  onSelectProduction: (productionId: string) => void;
}

const ProductionTree = ({ selectedProductionSheetId, seasons, onSelectProduction }: ProductionTreeProps) => {
  const [expandedKey, setExpandedKey] = useState<string>();

  useEffect(() => {
    if (!seasons) {
      return;
    }
    const currentSeason = seasons.find(s => s.isCurrent);
    if (currentSeason) {
      setExpandedKey(currentSeason.key);
    }
  }, [seasons]);

  const handleProductionClick = useCallback((productionId: string) => {
    onSelectProduction(productionId);
  }, [onSelectProduction]);

  const renderProductions = useCallback((productions: Season['productions']) => {
    return (
      <ul className={styles.list}>
        {productions.map((prod) => {
          return (
            <li
              key={`prod${prod.id}`}
              className={selectedProductionSheetId === prod.id ? styles.listItemActive : styles.listItem}
            >
              <button
                type="button"
                onClick={() => handleProductionClick(prod.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'inherit',
                  font: 'inherit',
                  textAlign: 'left',
                }}
              >
                {prod.title}
              </button>
            </li>
          )
        })}
      </ul>
    )
  }, [selectedProductionSheetId, handleProductionClick]);

  const renderSeason = useCallback((season: Season, i: number) => {
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
