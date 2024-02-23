import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import React, { useMemo } from "react";
import getConfig from "./config";
const config = getConfig();

const { sanityGraphqlEndpoint } = config;

function initApolloClient() {
  return new ApolloClient({
    uri: sanityGraphqlEndpoint,
    cache: new InMemoryCache()
  });
}

const ApolloClientProvider = (props) => {
  const apolloClient = useMemo(() => initApolloClient(), []);
  const { children } = props;
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
};

export default ApolloClientProvider;
