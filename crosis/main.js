const { Client } = require("@replit/crosis");
const getToken = require('./getToken.js');

global.WebSocket = require("ws");

module.exports = async () => {
  const client = new Client();
  await client.connect({ token: await getToken() });
  return client;
};