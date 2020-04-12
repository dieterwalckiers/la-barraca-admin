const request = require("superagent");

(async function () {
  const options = process.argv.slice(2);
  if (options.length < 1) {
    console.log("usage: deleteDocument.js <id> <dataset-name?>");
    process.exit(1);
  }
  const [id, datasetName = "development"] = options;
  console.log("on id", id);
  console.log("on datasetName", datasetName);

  request
    .post(`https://p3ezynln.api.sanity.io/v1/data/mutate/${datasetName}`)
    .send(
      JSON.stringify({
        mutations: [
          {
            delete: {
              id,
            },
          },
        ],
      })
    )
    .set(
      "Authorization",
      "Bearer skpLdSYZiqFbjcdJxF9nu1tJQOTrSPF8KmW39xbBiDpW07jkWbTW6BiTVkcd8qS6UJsMOhhIIRTCPOEAd"
    )
    .set("Content-Type", "application/json")
    .then((res) => {
      console.log("response" + JSON.stringify(res.body));
    });
})();
