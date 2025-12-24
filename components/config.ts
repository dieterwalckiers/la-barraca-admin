interface Config {
  sanityGraphqlEndpoint: string;
}

function isDev(): boolean {
  return import.meta.env.DEV;
}

export default function getConfig(): Config {
  return isDev() ? {
    sanityGraphqlEndpoint: "https://p3ezynln.api.sanity.io/v1/graphql/development/default",
  } : {
    sanityGraphqlEndpoint: "https://p3ezynln.api.sanity.io/v1/graphql/production/default",
  };
}
