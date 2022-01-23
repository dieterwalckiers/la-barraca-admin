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
import { gql, ApolloProvider } from "apollo-boost";
import PerformanceSet from "./performanceSet";
import { normalizePerformance } from "./helpers";
import { normalizeSeason } from "../shared/helpers";
import {
  ApolloProvider as ApolloHooksProvider,
  useMutation,
  useQuery,
} from "@apollo/react-hooks";
import ApolloClientProvider from "../shared/ApolloClientProvider";
import ProductionTree from "../shared/ProductionTree";
import { ThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";

// Sanity uses CSS modules for styling. We import a stylesheet and get an
// object where the keys matches the class names defined in the CSS file and
// the values are a unique, generated class name. This allows you to write CSS
// with only your components in mind without any conflicting class names.
// See https://github.com/css-modules/css-modules for more info.
import styles from "../shared/ProductionInfoPlugin.css"

const theme = createMuiTheme();

const Bookings = (props) => {
  const { router } = props;

  const [seasons, setSeasons] = useState();
  const [allPerformances, setAllPerformances] = useState();
  const [performanceSet, setPerformanceSet] = useState();

  const allProductions = useMemo(() => seasons && seasons.reduce((acc, season) => [...acc, ...season.productions], []));

  const handleReceiveSeasons = useCallback(
    (seasons) => {
      console.log("receiving", seasons);
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
    () => router.state.selectedProductionId,
    [router]
  );
  const previousSelectedProductionId = usePrevious(selectedProductionId);
  const previousAllPerformances = usePrevious(allPerformances);

  useEffect(() => {
    if (allPerformances) {
      const selectedProductionIdChanged =
        selectedProductionId !== previousSelectedProductionId;
      const allPerformancesChanged =
        allPerformances !== previousAllPerformances;
      if (
        selectedProductionIdChanged ||
        allPerformancesChanged ||
        (selectedProductionId && !performanceSet)
      ) {
        setPerformanceSet(
          allPerformances.filter((p) => p.productionID == selectedProductionId)
        );
      }
    }
  }, [
    selectedProductionId,
    previousSelectedProductionId,
    performanceSet,
    allPerformances,
  ]);

  const { data: allPerformancesData } = useQuery(gql`
    {
      allPerformances(_size: 9999) {
        data {
          _id
          productionID
          timeID
          visitors
        }
      }
    }
  `);

  useEffect(() => {
    if (allPerformancesData) {
      console.log("allPerformancesData", allPerformancesData);
      const {
        allPerformances: { data: allPerformancesRaw },
      } = allPerformancesData;
      const allPerfs = allPerformancesRaw.map(normalizePerformance).sort(({ date: date1 }, { date: date2 }) => date1.isBefore(date2) ? -1 : 1);
      setAllPerformances(allPerfs);
    }
  }, [allPerformancesData]);

  const [UpdatePerformance, { data }] = useMutation(gql`
    mutation UpdatePerformance($id: ID!, $visitors: String) {
      updatePerformance(id: $id, data: { visitors: $visitors }) {
        _id
        productionID
        timeID
        visitors
      }
    }
  `);

  const onUpdateVisitors = useCallback(async (performanceId, visitors) => {
    console.log("update", visitors);
    await UpdatePerformance({
      variables: { id: performanceId, visitors: JSON.stringify(visitors) },
    });
  }, []);

  const renderProductionTree = useCallback(() => {
    if (!seasons) {
      return (
        <div className={styles.list}>
          <Spinner message="Loading..." center />
        </div>
      );
    }
    return (
      <ProductionTree seasons={seasons} />
    );
  }, [seasons]);

  const renderPerformances = useCallback(() => {
    console.log("rnr", performanceSet);
    if (!performanceSet) {
      return (
        <div className={styles.document}>
          <Spinner message="Reservaties worden geladen..." center />
        </div>
      );
    }
    return (
      <PerformanceSet
        production={allProductions.find(p => p.id === selectedProductionId)}
        performanceSet={performanceSet}
        onUpdateVisitors={onUpdateVisitors}
      />
    );
  }, [performanceSet]);

  return (
    <div className={styles.container}>
      {renderProductionTree()}
      {selectedProductionId && renderPerformances()}
    </div>
  );
};

const BookingsWrapper = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloClientProvider>
        {(apolloClient) => {
          console.log("render children with", apolloClient);
          return apolloClient ? (
            <ApolloHooksProvider client={apolloClient}>
              <Bookings {...props} />
            </ApolloHooksProvider>
          ) : (
            "loading"
          );
        }}
      </ApolloClientProvider>
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
