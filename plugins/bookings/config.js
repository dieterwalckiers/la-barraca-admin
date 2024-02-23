function isDev() {
    const dev = process.env.NODE_ENV === "development";
    return dev;
}

export default () => {
    return isDev() ? {
        sendConfirmationMailEndpoint: "http://localhost:8888/.netlify/functions/performances/sendConfirmationMail",
        sendFeedbackMailEndpoint: "http://localhost:8888/.netlify/functions/performances/sendFeedbackMail",
        performancesEndpoint: "http://localhost:8888/.netlify/functions/performances",
    } : {
            sendConfirmationMailEndpoint: "https://la-barraca.netlify.app/.netlify/functions/performances/sendConfirmationMail",
            sendFeedbackMailEndpoint: "https://la-barraca.netlify.app/.netlify/functions/performances/sendFeedbackMail",
            performancesEndpoint: "https://la-barraca.netlify.app/.netlify/functions/performances",
        };
};