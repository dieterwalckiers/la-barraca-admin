function isDev() {
    const dev = process.env.NODE_ENV === "development";
    console.log("dev?", dev);
    return dev;
}

export default () => {
    return isDev() ? {
        sanityGraphqlEndpoint: "https://p3ezynln.api.sanity.io/v1/graphql/development/default",
    } : {
        sanityGraphqlEndpoint: "https://p3ezynln.api.sanity.io/v1/graphql/production/default",
    };
};