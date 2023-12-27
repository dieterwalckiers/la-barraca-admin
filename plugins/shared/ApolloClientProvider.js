import React, { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

function initApolloClient() {
  console.log("initting apollo client with SANITY_STUDIO_FAUNADB_SERVER_SECRET", process.env.SANITY_STUDIO_FAUNADB_SERVER_SECRET);
  const b64encodedSecret = Buffer.from(process.env.SANITY_STUDIO_FAUNADB_SERVER_SECRET + ':').toString('base64');
  const httpLink = createHttpLink({ uri: "https://graphql.eu.fauna.com/graphql" });
  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Basic ${b64encodedSecret}`,
    }
  }));

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}

const ApolloClientProvider = (props) => {
  const apolloClient = useMemo(() => initApolloClient(), []);
  const { children } = props;
  return !apolloClient ? (
    <span>loading...</span>
  ) : (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
};

export default ApolloClientProvider;
