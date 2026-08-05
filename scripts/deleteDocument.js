const request = require("superagent");

(async function () {
  const options = process.argv.slice(2);
  if (options.length < 1) {
    console.log("usage: deleteDocument.js <id> <dataset-name?>");
    console.log("requires SANITY_API_TOKEN in the environment");
    process.exit(1);
  }
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.log("missing SANITY_API_TOKEN environment variable");
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
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .then((res) => {
      console.log("response" + JSON.stringify(res.body));
    });
})();
