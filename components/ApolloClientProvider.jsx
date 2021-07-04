import ApolloClient from "apollo-boost";
import React, { useMemo } from "react";
import getConfig from "./config";
const config = getConfig();

const { sanityGraphqlEndpoint } = config;

function initApolloClient() {
  return new ApolloClient({
    uri: sanityGraphqlEndpoint,
    // request: (operation) => {
    //   const b64encodedSecret = Buffer.from(process.env.SANITY_STUDIO_FAUNADB_SERVER_SECRET + ':').toString('base64');
    //   operation.setContext({
    //     headers: {
    //       Authorization: `Basic ${b64encodedSecret}`,
    //     },
    //   });
    // },
  });
}

const ApolloClientProvider = (props) => {
  const apolloClient = useMemo(() => initApolloClient(), []);
  const { children } = props;
  console.log("GO FOR", apolloClient);
  return children(apolloClient);
};

export default ApolloClientProvider;
