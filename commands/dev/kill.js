const { Command } = require('discord.js-commando');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'kill',
			aliases: ['k'],
			group: 'dev',
			memberName: 'kill',
			description: 'Kills the bot',
			ownerOnly: true
		});
	}
	
	async run(msg){
        await msg.say("ok")
        const commands = this.client.registry.findCommands();
        
        for(let command of commands){
        	if(command[1].groupID === "user"){
        		this.client.registry.unregisterCommand(command[1]);
        	}
        }
    }
};