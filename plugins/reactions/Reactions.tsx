import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useClient } from "sanity";
import { Spinner, Flex, Text } from "@sanity/ui";
import ReactionsOverview from "./ReactionsOverview";
import { normalizeSeason } from "../shared/helpers";
import ProductionTree from "../shared/ProductionTree";
import { ThemeProvider, createTheme } from "@mui/material";
import { getReactionsForProduction } from "./api";

import styles from "../shared/ProductionInfoPlugin.module.css";

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

interface ReactionsProps {
  tool: {
    options?: Record<string, unknown>;
  };
}

interface Reaction {
  id: string;
  [key: string]: unknown;
}

const Reactions = (_props: ReactionsProps) => {
  const client = useClient({ apiVersion: '2024-01-01' });

  const [seasons, setSeasons] = useState<ReturnType<typeof normalizeSeason>[]>();
  const [reactions, setReactions] = useState<Reaction[]>();
  const [selectedProductionSheetId, setSelectedProductionSheetId] = useState<string>();

  const allProductions = useMemo(
    () => (seasons || []).reduce((acc, season) => [...acc, ...season.productions], [] as Array<{ id: string; title: string }>),
    [seasons]
  );

  const handleReceiveSeasons = useCallback(
    (seasonsData: Array<Record<string, unknown>>) => {
      setSeasons(seasonsData.map(s => normalizeSeason(s)));
    },
    [setSeasons]
  );

  useEffect(() => {
    client
      .observable
      .fetch(
        '*[_type == "season"]{_id,isCurrent,startYear,endYear,"productions": productions[]{title, _key, slug}}'
      )
      .subscribe(handleReceiveSeasons);
  }, [client, handleReceiveSeasons]);

  const handleSelectProduction = useCallback((productionId: string) => {
    setSelectedProductionSheetId(productionId);
  }, []);

  useEffect(() => {
    if (!selectedProductionSheetId) {
      return;
    }
    getReactionsForProduction(selectedProductionSheetId).then((reactionsData) => {
      console.log("got reactions", reactionsData);
      setReactions(reactionsData as Reaction[]);
    });
  }, [selectedProductionSheetId]);

  const renderProductionTree = useCallback(() => {
    if (!seasons) {
      return (
        <div className={styles.list}>
          <Flex align="center" justify="center" padding={4}>
            <Flex direction="column" align="center" gap={3}>
              <Spinner muted />
              <Text muted>Loading...</Text>
            </Flex>
          </Flex>
        </div>
      );
    }
    return (
      <ProductionTree
        selectedProductionSheetId={selectedProductionSheetId}
        seasons={seasons}
        onSelectProduction={handleSelectProduction}
      />
    );
  }, [seasons, selectedProductionSheetId, handleSelectProduction]);

  const renderReactions = useCallback(() => {
    if (!reactions) {
      return (
        <div className={styles.document}>
          <Flex align="center" justify="center" padding={4}>
            <Flex direction="column" align="center" gap={3}>
              <Spinner muted />
              <Text muted>Reacties worden geladen...</Text>
            </Flex>
          </Flex>
        </div>
      );
    }
    return (
      <ReactionsOverview
        production={allProductions.find(p => p.id === selectedProductionSheetId)}
        reactions={reactions}
      />
    );
  }, [reactions, allProductions, selectedProductionSheetId]);

  return (
    <div className={styles.container}>
      {renderProductionTree()}
      {selectedProductionSheetId && renderReactions()}
    </div>
  );
};

const ReactionsWrapper = (props: ReactionsProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Reactions {...props} />
    </ThemeProvider>
  );
};

export default ReactionsWrapper;
