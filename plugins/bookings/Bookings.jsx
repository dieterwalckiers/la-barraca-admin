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
// Removed gql import - using GROQ instead
import PerformanceSet from "./performanceSet";
import { buildPerformanceSet, normalizePerformance } from "./helpers";
import { normalizeSeason } from "../shared/helpers";
import ProductionTree from "../shared/ProductionTree/index.jsx";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  getPerformancesForProduction,
  createPerformance,
  updatePerformance,
} from "./api";

// Import styles
import styles from "../shared/ProductionInfoPlugin.css?inline"
import { QueryClientProvider, useQuery, QueryClient, useMutation } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false
    }
  }
});

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

function BookingsInner() {
  const router = useRouter()
  const client = useClient()
  
  const [selectedProductionSheetId, setSelectedProductionSheetId] = useState(null)

  const [loadingPerformancesState, setLoadingPerformancesState] = useState("idle"); // idle | loading | error | loaded
  const [performancesState, setPerformancesState] = useState();

  const { data, isError, isLoading } = useQuery(
    "seasons",
    async () => {
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
          slug,
          performanceCalendar
        }
      }`;
      return client.fetch(query)
    },
    { staleTime: 60000 }
  );

  const seasons = useMemo(() => {
    return data ? data.map(normalizeSeason) : []
  }, [data]);

  const productionMap = useMemo(() => {
    if (!seasons) {
      return {};
    }
    const map = {};
    seasons.forEach(season => {
      season.productions.forEach(production => {
        if (production.sheetId) {
          map[production.sheetId] = production;
        }
      });
    });
    return map;
  }, [seasons]);

  const selectedProduction = useMemo(() => {
    if (!selectedProductionSheetId || !productionMap) {
      return undefined;
    }
    return productionMap[selectedProductionSheetId];
  }, [selectedProductionSheetId, productionMap]);

  const loadPerformances = useCallback(
    async production => {
      if (!production) {
        return;
      }
      setLoadingPerformancesState("loading");
      try {
        const performances = await getPerformancesForProduction(production.sheetId);
        setPerformancesState(performances.map(normalizePerformance));
        setLoadingPerformancesState("loaded");
      } catch (e) {
        console.error("error loading performances", e);
        setLoadingPerformancesState("error");
      }
    },
    [setLoadingPerformancesState, setPerformancesState]
  );

  useEffect(() => {
    loadPerformances(selectedProduction);
  }, [selectedProduction, loadPerformances]);

  const performanceSet = useMemo(() => {
    if (!performancesState || !selectedProduction) {
      return undefined;
    }
    return buildPerformanceSet(
      selectedProduction.id,
      selectedProduction.performanceCalendar,
      performancesState
    );
  }, [performancesState, selectedProduction]);

  const onProductionClick = useCallback(
    production => {
      if (!production.sheetId) {
        return
      }
      setSelectedProductionSheetId(production.sheetId)
    },
    []
  );

  const createPerformanceMutation = useMutation(createPerformance, {
    onSuccess: () => {
      loadPerformances(selectedProduction);
    }
  });

  const updatePerformanceMutation = useMutation(updatePerformance, {
    onSuccess: () => {
      loadPerformances(selectedProduction);
    }
  });

  const savePerformance = useCallback(
    performance => {
      if (performance.id) {
        updatePerformanceMutation.mutate({
          selectedProduction,
          performance
        });
      } else {
        createPerformanceMutation.mutate({
          selectedProduction,
          performance
        });
      }
    },
    [selectedProduction, createPerformanceMutation, updatePerformanceMutation]
  );

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return <div>Error loading data</div>
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
        <h3>Reservaties</h3>
        {selectedProduction && (
          <p>
            <b>{selectedProduction.title}</b>
          </p>
        )}
        {loadingPerformancesState === "loading" && <Spinner />}
        {loadingPerformancesState === "error" && (
          <p>Er ging iets mis bij het ophalen van de gegevens.</p>
        )}
        {performanceSet && (
          <PerformanceSet
            performanceSet={performanceSet}
            savePerformance={savePerformance}
            saving={createPerformanceMutation.isLoading || updatePerformanceMutation.isLoading}
            selectedProduction={selectedProduction}
          />
        )}
      </div>
    </div>
  );
}

const Bookings = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <BookingsInner />
    </ThemeProvider>
  </QueryClientProvider>
);

export default Bookings;