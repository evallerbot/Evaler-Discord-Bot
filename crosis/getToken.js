const fetch = require("node-fetch");

module.exports = () => {
  // You can get the replid by going to any repl, opening the browser
  // console and typing:
  // window.store.getState().plugins.infoprovider.state.repl.id
  const replId = "2a73b271-bb5c-4fd2-9cbb-0792258a082e";

  return fetch(`https://repl.it/api/v0/repls/${replId}/token`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      apiKey: process.env.CROSIS_KEY
    })
  }).then(res => res.json());
};
