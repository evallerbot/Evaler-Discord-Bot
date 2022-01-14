const { CommandoClient } = require('discord.js-commando');
const keepAlive = require("./server.js");
// const initClient = require('./crosis/main.js');
const path = require("path");

require('dotenv').config();

const client = new CommandoClient({
    commandPrefix: process.env.PREFIX,
    owner: ["302968847353249813", "431992878521122827", "580268737907654656"],
    nonCommandEditable: false,
    unknownCommandResponse: false
});
   
client.registry
    .registerDefaultTypes()
    .registerGroups([
	    ["dev", "Dev Commands"],
	    ["user", "User Commands"],
	    ["administrative", "Administrative Commands"]
    ])
    .registerDefaultGroups()
    /*.registerDefaultCommands()*/
    //.registerCommandsIn(
    //    path.join(__dirname, 'commands')
    //);

client.once("ready", () => {
    console.log("Logged in as " + client.user.tag);
});

client.on('error', console.error);

keepAlive();
// initClient();

client.login(process.env.TOKEN)