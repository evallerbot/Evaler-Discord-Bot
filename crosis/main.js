const { Client } = require("@replit/crosis");
const getToken = require('./getToken.js');

global.WebSocket = require("ws");

global.client = new Client();

module.exports = () => {
	getToken()
	.then(token => {
		return global.client.connect({ token });
	})
};