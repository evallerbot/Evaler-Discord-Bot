const { Command } = require('discord.js-commando');
const { spawn } = require('child_process');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			aliases: ['r'],
			group: 'dev',
			memberName: 'restart',
			description: 'Restarts the bot',
			ownerOnly: true
		});
	}
	
	async run(msg){
        await msg.say("ok");
        process.exit(1);
    }
};