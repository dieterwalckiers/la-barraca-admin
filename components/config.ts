interface Config {
  sanityGraphqlEndpoint: string;
}

function isDev(): boolean {
  // Check for Sanity studio dataset env var, fallback to NODE_ENV
  const dataset = process.env.SANITY_STUDIO_DATASET;
  if (dataset) {
    return dataset === 'development';
  }
  return process.env.NODE_ENV === 'development';
}

export default function getConfig(): Config {
  return isDev() ? {
    sanityGraphqlEndpoint: "https://p3ezynln.api.sanity.io/v1/graphql/development/default",
  } : {
    sanityGraphqlEndpoint: "https://p3ezynln.api.sanity.io/v1/graphql/production/default",
  };
}
