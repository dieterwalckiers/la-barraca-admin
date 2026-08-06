function isDev() {
    const dev = process.env.NODE_ENV === "development";
    return dev;
}

export default () => {
    // Phase 5 of the Next.js migration guards the admin endpoints with this
    // header. Vite exposes only SANITY_STUDIO_-prefixed vars to the browser
    // bundle. Empty until the variable is set, which is harmless while the
    // server runs in AUTH_MODE=log.
    const apiKey = process.env.SANITY_STUDIO_API_KEY || "";
    return isDev() ? {
        sendFeedbackMailEndpoint: "http://localhost:8888/.netlify/functions/performances/sendFeedbackMail",
        reactionsEndpoint: "http://localhost:8888/.netlify/functions/reactions",
        performancesEndpoint: "http://localhost:8888/.netlify/functions/performances",
        apiKey,
    } : {
        sendFeedbackMailEndpoint: "https://www.labarraca.be/.netlify/functions/performances/sendFeedbackMail",
        reactionsEndpoint: "https://www.labarraca.be/.netlify/functions/reactions",
        performancesEndpoint: "https://www.labarraca.be/.netlify/functions/performances",
        apiKey,
    };
};

