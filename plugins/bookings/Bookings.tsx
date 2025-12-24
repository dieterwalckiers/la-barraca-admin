import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useClient } from "sanity";
import { Spinner, Flex, Text } from "@sanity/ui";
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

import styles from "../shared/ProductionInfoPlugin.module.css";
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

interface BookingsProps {
  tool: {
    options?: Record<string, unknown>;
  };
}

const Bookings = (_props: BookingsProps) => {
  const client = useClient({ apiVersion: '2024-01-01' });

  const [seasons, setSeasons] = useState<ReturnType<typeof normalizeSeason>[]>();
  const [allPerformances, setAllPerformances] = useState<ReturnType<typeof normalizePerformance>[]>();
  const [performanceSet, setPerformanceSet] = useState<ReturnType<typeof buildPerformanceSet>>();
  const [selectedProductionSheetId, setSelectedProductionSheetId] = useState<string>();

  const allProductions = useMemo(
    () => (seasons || []).reduce((acc, season) => [...acc, ...(season.productions || [])], [] as Array<{ id: string; title: string; performanceCalendar: string }>),
    [seasons]
  );

  const handleReceiveSeasons = useCallback(
    (seasonsData: Array<Record<string, unknown>>) => {
      setSeasons(seasonsData.map(s => normalizeSeason(s)));
    },
    []
  );

  useEffect(() => {
    client
      .observable
      .fetch(
        '*[_type == "season"]{_id,isCurrent,startYear,endYear,"productions": productions[]{title, slug { current }, performanceCalendar, _key}}'
      )
      .subscribe(handleReceiveSeasons);
  }, [client, handleReceiveSeasons]);

  const handleSelectProduction = useCallback((productionId: string) => {
    setSelectedProductionSheetId(productionId);
  }, []);

  const activeProduction = useMemo(() => {
    if (selectedProductionSheetId) {
      return allProductions.find(p => p.id === selectedProductionSheetId);
    }
    return undefined;
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
        const newPerformanceSet = activeProduction && buildPerformanceSet(
          activeProduction.id,
          activeProduction.performanceCalendar,
          allPerformances.filter((p) => p.productionKey === selectedProductionSheetId),
        );
        setPerformanceSet(newPerformanceSet || undefined);
      }
    }
  }, [
    selectedProductionSheetId,
    previousSelectedProductionSheetId,
    performanceSet,
    allPerformances,
    activeProduction,
    previousAllPerformances,
  ]);

  const { data: allPerformancesData, isLoading: queryIsLoading, isFetching: queryIsFetching } = useQuery(
    ["performancesForProduction", selectedProductionSheetId],
    () => getPerformancesForProduction(selectedProductionSheetId!),
    {
      enabled: !!selectedProductionSheetId,
    }
  );

  useEffect(() => {
    if (allPerformancesData) {
      const allPerfs = JSON.parse(allPerformancesData).map(normalizePerformance).sort(({ date: date1 }: { date: { isBefore: (d: unknown) => boolean } }, { date: date2 }: { date: unknown }) => date1.isBefore(date2) ? -1 : 1);
      setAllPerformances(allPerfs);
    } else {
      setAllPerformances(undefined);
    }
  }, [allPerformancesData]);

  const updateVisitorsApiCall = useCallback(async ({ performanceID, timeID, production, visitors }: { performanceID?: string; timeID: string; production: { id: string }; visitors: number }) => {
    if (!performanceID) {
      await createPerformance(
        production.id,
        timeID,
        visitors,
      )
      return;
    }
    await updatePerformance(selectedProductionSheetId!, timeID, visitors);
  }, [selectedProductionSheetId]);

  const { mutate: onUpdateVisitors, isLoading: mutationIsLoading } = useMutation(
    updateVisitorsApiCall,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["performancesForProduction", selectedProductionSheetId]);
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
        onSelectProduction={handleSelectProduction}
      />
    );
  }, [seasons, selectedProductionSheetId, handleSelectProduction]);

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
  }, [performanceSet, activeProduction, onUpdateVisitors]);

  const isLoading = queryIsLoading || queryIsFetching || mutationIsLoading;

  return (
    <div className={styles.container}>
      {!isLoading && renderProductionTree()}
      {!isLoading && selectedProductionSheetId && renderPerformances()}
      {isLoading && (
        <Flex align="center" justify="center" style={{ width: "100vw", height: "100vh" }}>
          <Flex direction="column" align="center" gap={3}>
            <Spinner muted />
            <Text muted>{mutationIsLoading ? "Wijziging wordt opgeslaan" : "Reservaties worden geladen"}</Text>
          </Flex>
        </Flex>
      )}
    </div>
  );
};

const BookingsWrapper = (props: BookingsProps) => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Bookings {...props} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default BookingsWrapper;

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
