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
import { normalizeProduction } from "../shared/helpers";
import {
  ApolloProvider as ApolloHooksProvider,
  useMutation,
  useQuery,
} from "@apollo/react-hooks";
import ApolloClientProvider from "../shared/ApolloClientProvider";

// Sanity uses CSS modules for styling. We import a stylesheet and get an
// object where the keys matches the class names defined in the CSS file and
// the values are a unique, generated class name. This allows you to write CSS
// with only your components in mind without any conflicting class names.
// See https://github.com/css-modules/css-modules for more info.
import styles from "../shared/ProductionInfoPlugin.css"

const Bookings = (props) => {
  const { router } = props;

  const [productions, setProductions] = useState();
  const [allPerformances, setAllPerformances] = useState();
  const [performanceSet, setPerformanceSet] = useState();

  const handleReceiveSeasons = useCallback(
    (seasons) => {
      console.log("receiving", seasons);
      const prods = seasons.reduce((reduced, season) => {
        return [...reduced, ...season.productions.map(normalizeProduction)];
      }, []);
      setProductions(prods);
    },
    [setProductions]
  );

  useEffect(() => {
    //fetchAllPerformances();
    client.observable
      .fetch(
        '*[_type == "season"]{_id,"productions": productions[]{title, _key}}'
      )
      .subscribe(handleReceiveSeasons);
    // If we have a document ID as part of our route, load that document as well
  }, []);

  // useEffect(() => {
  //   if (!allPerformances) {
  //     fetchAllPerformances();
  //   }
  // }, [allPerformances, fetchAllPerformances]);

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

  const renderProductions = useCallback(() => {
    if (!productions) {
      return (
        <div className={styles.list}>
          <Spinner message="Loading..." center />
        </div>
      );
    }
    return (
      <ul className={styles.list}>
        {productions.map((prod) => (
          <li key={prod.id} className={styles.listItem}>
            <StateLink state={{ selectedProductionId: prod.id }}>
              {prod.title}
            </StateLink>
          </li>
        ))}
      </ul>
    );
  }, [productions]);

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
        production={productions.find(p => p.id === selectedProductionId)}
        performanceSet={performanceSet}
        onUpdateVisitors={onUpdateVisitors}
      />
    );
  }, [performanceSet]);

  return (
    <div className={styles.container}>
      {renderProductions()}
      {selectedProductionId && renderPerformances()}
    </div>
  );
};

const BookingsWrapper = (props) => {
  return (
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
