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
        sendConfirmationMailEndpoint: "http://localhost:3000/api/performances/sendConfirmationMail/",
        sendFeedbackMailEndpoint: "http://localhost:3000/api/performances/sendFeedbackMail/",
        performancesEndpoint: "http://localhost:3000/api/performances",
        apiKey,
    } : {
            sendConfirmationMailEndpoint: "https://www.labarraca.be/api/performances/sendConfirmationMail/",
            sendFeedbackMailEndpoint: "https://www.labarraca.be/api/performances/sendFeedbackMail/",
            performancesEndpoint: "https://www.labarraca.be/api/performances",
            apiKey,
        };
};