import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { withRouterHOC } from "part:@sanity/base/router";
import Spinner from "part:@sanity/components/loading/spinner";
import client from "part:@sanity/base/client";
import gql from "graphql-tag";
import PerformanceSet from "./performanceSet";
import { buildPerformanceSet, normalizePerformance } from "./helpers";
import { normalizeSeason } from "../shared/helpers";
import ProductionTree from "../shared/ProductionTree";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  getPerformancesForProduction,
  createPerformance,
  updatePerformance,
} from "./api";


// Sanity uses CSS modules for styling. We import a stylesheet and get an
// object where the keys matches the class names defined in the CSS file and
// the values are a unique, generated class name. This allows you to write CSS
// with only your components in mind without any conflicting class names.
// See https://github.com/css-modules/css-modules for more info.
import styles from "../shared/ProductionInfoPlugin.css"
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

/*
  Concerning overrides in MuiAccordionSummary above:
  Without these, the accordion summary's look ugly
  This is due to a combination we use of @mui and @material-ui type packages (the former being the new ones)
  The latter are deprecated. However material-table (which isn't official @mui) still depends on these (23/01/22)
  TODO as soon as material-table has ditched the deprecated @material-ui packages: upgrade and remove above style overrides for MuiAccordionSummary
*/

const Bookings = (props) => {
  const { router } = props;

  const [seasons, setSeasons] = useState();
  const [allPerformances, setAllPerformances] = useState();
  const [performanceSet, setPerformanceSet] = useState();

  const allProductions = useMemo(
    () => (seasons || []).reduce((acc, season) => [...acc, ...(season.productions || [])], []),
    [seasons]
  );

  const handleReceiveSeasons = useCallback(
    (seasons) => {
      setSeasons(seasons.map(s => normalizeSeason(s)));
    },
    []
  );

  useEffect(() => {
    client.observable
      .fetch(
        '*[_type == "season"]{_id,isCurrent,startYear,endYear,"productions": productions[]{title, slug { current }, performanceCalendar, _key, googleSheetId}}'
      )
      .subscribe(handleReceiveSeasons);
  }, []);

  const selectedProductionSheetId = useMemo(
    () => router.state.selectedProductionSheetId,
    [router.state.selectedProductionSheetId]
  );

  useEffect(() => console.log("selectedProductionSheetId", selectedProductionSheetId), [selectedProductionSheetId])

  const activeProduction = useMemo(() => {
    if (selectedProductionSheetId) {
      return allProductions.find(p => p.googleSheetId === selectedProductionSheetId);
    }
  }, [selectedProductionSheetId, allProductions]);

  const previousSelectedProductionSheetId = usePrevious(selectedProductionSheetId);
  const previousAllPerformances = usePrevious(allPerformances);

  useEffect(() => {
    if (allPerformances) {
      const selectedProductionSheetIdChanged =
        selectedProductionSheetId !== previousSelectedProductionSheetId;
      const allPerformancesChanged =
        allPerformances !== previousAllPerformances;
      if (
        selectedProductionSheetIdChanged ||
        allPerformancesChanged ||
        (selectedProductionSheetId && !performanceSet)
      ) {
        const performanceSet = activeProduction && buildPerformanceSet(
          activeProduction.id,
          activeProduction.performanceCalendar,
          allPerformances.filter((p) => p.googleSheetId == selectedProductionSheetId),
        );
        setPerformanceSet(performanceSet);
      }
    }
  }, [
    selectedProductionSheetId,
    previousSelectedProductionSheetId,
    performanceSet,
    allPerformances,
    activeProduction,
  ]);

  const { data: allPerformancesData, isLoading: queryIsLoading, isFetching: queryIsFetching } = useQuery( // isFetching is true when refetching (invalidateQueries)
    ["performancesForProduction", selectedProductionSheetId],
    () => getPerformancesForProduction(selectedProductionSheetId),
    {
      enabled: !!selectedProductionSheetId,
    }
  );

  useEffect(() => console.log("isLoading", isLoading), [isLoading]) // todo: show loader

  useEffect(() => {
    if (allPerformancesData) {
      const allPerfs = JSON.parse(allPerformancesData).map(normalizePerformance).sort(({ date: date1 }, { date: date2 }) => date1.isBefore(date2) ? -1 : 1);
      setAllPerformances(allPerfs);
    } else {
      setAllPerformances(undefined);
    }
  }, [allPerformancesData]);

  const updateVisitorsApiCall = useCallback(async ({ performanceID, timeID, production, visitors }) => {
    if (!performanceID) {
      await createPerformance(
        production.googleSheetId,
        timeID,
        visitors,
      )
      return;
    }
    await updatePerformance(selectedProductionSheetId, timeID, visitors);
  }, [selectedProductionSheetId]);

  const { mutate: onUpdateVisitors, isLoading: mutationIsLoading } = useMutation(
    updateVisitorsApiCall,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["performancesForProduction", selectedProductionSheetId]); // todo: invalidate "part of" query somehow, make the query more "granular" so we can control what to invalidate (to research)
      }
    }
  )

  const renderProductionTree = useCallback(() => {
    if (!seasons) {
      return null;
    }
    return (
      <ProductionTree
        selectedProductionSheetId={selectedProductionSheetId}
        seasons={seasons}
      />
    );
  }, [seasons, selectedProductionSheetId]);

  const renderPerformances = useCallback(() => {
    if (!performanceSet) {
      return null;
    }
    return (
      <PerformanceSet
        production={activeProduction}
        performanceSet={performanceSet}
        onUpdateVisitors={onUpdateVisitors}
      />
    );
  }, [performanceSet]);

  const isLoading = queryIsLoading || queryIsFetching || mutationIsLoading;

  return (
    <div className={styles.container}>
      {!isLoading && renderProductionTree()}
      {!isLoading && selectedProductionSheetId && renderPerformances()}
      {isLoading && (
        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner message={mutationIsLoading ? "Wijziging wordt opgeslaan" : "Reservaties worden geladen"} center />
        </div>
      )}
    </div>
  );
};

const BookingsWrapper = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Bookings {...props} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default withRouterHOC(BookingsWrapper);

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
