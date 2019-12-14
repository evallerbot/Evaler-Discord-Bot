const express = require("express");

const server = express();

server.use((req, res) => {
	res.send("I am alive.");
});

module.exports = server.listen.bind(0, () => {
	console.log("Express server listening successfully.");
});