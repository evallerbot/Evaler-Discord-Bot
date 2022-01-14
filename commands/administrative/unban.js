const { Command } = require('discord.js-commando');
const User = require('../../util/user.js');

module.exports = class ShareCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unban',
			group: 'administrative',
			memberName: 'unban',
			description: 'Unbans a user',
            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to unban?',
                    type: 'member'
                }
            ],
            ownerOnly: true
		});
	}

    async run(msg, { member }) {
    	await (new User(member)).unban();
    	await msg.say("ok");
	}
};
