function isDev() {
    const dev = process.env.NODE_ENV === "development";
    console.log("dev?", dev);
    return dev;
}

export default () => {
    return isDev() ? {
        sendConfirmationMailEndpoint: "http://localhost:8888/.netlify/functions/performances/sendConfirmationMail",
    } : {
            sendConfirmationMailEndpoint: "https://la-barraca.netlify.app/.netlify/functions/performances/sendConfirmationMail",
        };
};