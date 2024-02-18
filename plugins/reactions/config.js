function isDev() {
    const dev = process.env.NODE_ENV === "development";
    return dev;
}

export default () => {
    return isDev() ? {
        sendFeedbackMailEndpoint: "http://localhost:8888/.netlify/functions/performances/sendFeedbackMail",
        reactionsEndpoint: "http://localhost:8888/.netlify/functions/reactions",
        performancesEndpoint: "http://localhost:8888/.netlify/functions/performances",
    } : {
        sendFeedbackMailEndpoint: "https://la-barraca.netlify.app/.netlify/functions/performances/sendFeedbackMail",
        reactionsEndpoint: "https://la-barraca.netlify.app/.netlify/functions/reactions",
        performancesEndpoint: "https://la-barraca.netlify.app/.netlify/functions/performances",
    };
};

