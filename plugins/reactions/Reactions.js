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
import ReactionTable from "./ReactionTable";
import { normalizeProduction } from "../shared/helpers";
import { normalizeReaction } from "./helpers";
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

const Reactions = (props) => {
    const { router } = props;

    const [productions, setProductions] = useState();
    const [reactions, setReactions] = useState();

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
        client.observable
            .fetch(
                '*[_type == "season"]{_id,"productions": productions[]{title, _key}}'
            )
            .subscribe(handleReceiveSeasons);
    }, []);

    const selectedProductionId = useMemo(
        () => router.state.selectedProductionId,
        [router]
    );
    const previousSelectedProductionId = usePrevious(selectedProductionId);
    const previousAllReactions = usePrevious(reactions);

    // useEffect(() => {
    //     if (reactions) {
    //         const selectedProductionIdChanged =
    //             selectedProductionId !== previousSelectedProductionId;
    //         const allPerformancesChanged =
    //             reactions !== previousAllReactions;
    //         if (
    //             selectedProductionIdChanged ||
    //             allPerformancesChanged ||
    //             (selectedProductionId && !reactionsSet)
    //         ) {
    //             setReactionsSet(
    //                 reactions.filter((p) => p.productionID == selectedProductionId)
    //             );
    //         }
    //     }
    // }, [
    //     selectedProductionId,
    //     previousSelectedProductionId,
    //     reactionsSet,
    //     reactions,
    // ]);

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

    const renderReactions = useCallback(() => {
        if (!reactions) {
            return (
                <div className={styles.document}>
                    <Spinner message="Reacties worden geladen..." center />
                </div>
            );
        }
        return (
            <ReactionTable
                production={productions.find(p => p.id === selectedProductionId)}
                reactions={reactions}
            />
        );
    }, [reactions]);

    return (
        <div className={styles.container}>
            {renderProductions()}
            {selectedProductionId && renderReactions()}
        </div>
    );
};

const ReactionsWrapper = (props) => {
    return (
        <ApolloClientProvider>
            {(apolloClient) => {
                console.log("render children with", apolloClient);
                return apolloClient ? (
                    <ApolloHooksProvider client={apolloClient}>
                        <Reactions {...props} />
                    </ApolloHooksProvider>
                ) : (
                    "loading"
                );
            }}
        </ApolloClientProvider>
    );
};

export default withRouterHOC(ReactionsWrapper);

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}
