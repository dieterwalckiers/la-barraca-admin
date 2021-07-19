function isDev() {
    const dev = process.env.NODE_ENV === "development";
    console.log("dev?", dev);
    return dev;
}

export default () => {
    return isDev() ? {
        sendFeedbackMailEndpoint: "http://localhost:8888/.netlify/functions/performances/sendFeedbackMail",
    } : {
        sendFeedbackMailEndpoint: "http://la-barraca.netlify.app/.netlify/functions/performances/sendFeedbackMail",
    };
};