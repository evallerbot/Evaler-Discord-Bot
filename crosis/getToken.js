const fetch = require("node-fetch");
const CloudflareBypasser = require('cloudflare-bypasser');

let cf = new CloudflareBypasser();

// module.exports = () => {
//   // You can get the replid by going to any repl, opening the browser
//   // console and typing:
//   // window.store.getState().plugins.infoprovider.state.repl.id
//   const replId = "2a73b271-bb5c-4fd2-9cbb-0792258a082e";

//   return fetch(`https://repl.it/api/v0/repls/${replId}/token`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       apiKey: process.env.CROSIS_KEY
//     })
//   })
//   .then(res => {
// 	  console.log(res.status);
// 	  return res;
//   })
//   .then(res => res.json());
// };

module.exports = () => {
  // You can get the replid by going to any repl, opening the browser
  // console and typing:
  // window.store.getState().plugins.infoprovider.state.repl.id
  // const replId = "2a73b271-bb5c-4fd2-9cbb-0792258a082e";
  const username = "apoorvsingal";
  const replName = "MMH";
  //return cf.request(`https://replit.com/data/repls/${replId}/get_connection_metadata`, {
  return fetch(`https://replit.com/@${username}/${replName}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: "connect.sid="+process.env.SID,
	  'X-Requested-With': 'https://replit.com',
	  Origin: 'https://replit.com',
	  'User-Agent': 'Mozilla/5.0'
    }
  })
  .then(async res => {
  	console.log(await res.text());
	const data = JSON.parse((await res.text()).split("<script id=\"__NEXT_DATA__\" type=\"application/json\">")[1].split("</script>")[0])['props']['pageProps']['connectionMetadata']
    console.log(data); //why no log??
	console.log(res.status);
    return data;
  })
  .then(res => {
    console.log(res, "owowo"); 
    return res;
  });
};
module.exports();

fetch("https://replit.com/data/repls/0c2a30b6-4d80-4f91-af72-efff2e6f690c/get_connection_metadata", {
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://replit.com/@CoolCoderSJ/evaller-16",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"captcha\":\"\",\"isEmbed\":false,\"hCaptchaSiteKey\":\"473079ba-e99f-4e25-a635-e9b661c7dd3e\",\"clientVersion\":\"33b36a6\",\"retry\":3,\"format\":\"pbuf\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
