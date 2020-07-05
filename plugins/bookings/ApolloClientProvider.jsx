import ApolloClient from "apollo-boost";
import React, { useMemo } from "react";

function initApolloClient() {
  return new ApolloClient({
    uri: "https://graphql.fauna.com/graphql",
    request: (operation) => {
      const b64encodedSecret = Buffer.from(
        "fnADsUC1yGACAMRG08nVKKK4_0oo4PzsyW-RIRKh" + ":" // weird but they // TODO: get from process.env.FAUNADB_SERVER_SECRET again (should already be set in the netlify ui)
      ).toString("base64");
      operation.setContext({
        headers: {
          Authorization: `Basic ${b64encodedSecret}`,
        },
      });
    },
  });
}

const ApolloClientProvider = (props) => {
  const apolloClient = useMemo(() => initApolloClient(), []);
  const { children } = props;
  console.log("GO FOR", apolloClient);
  return children(apolloClient);
};

export default ApolloClientProvider;
