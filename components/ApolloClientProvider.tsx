import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import React, { useMemo, ReactNode } from "react";
import getConfig from "./config";

const config = getConfig();
const { sanityGraphqlEndpoint } = config;

function initApolloClient() {
  return new ApolloClient({
    uri: sanityGraphqlEndpoint,
    cache: new InMemoryCache()
  });
}

interface ApolloClientProviderProps {
  children: ReactNode;
}

const ApolloClientProvider = (props: ApolloClientProviderProps) => {
  const apolloClient = useMemo(() => initApolloClient(), []);
  const { children } = props;
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
};

export default ApolloClientProvider;
