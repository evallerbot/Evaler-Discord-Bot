const { Command } = require('discord.js-commando');
const User = require('../../util/user.js');

module.exports = class ShareCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			//  aliases: [''],
			group: 'administrative',
			memberName: 'ban',
			description: 'Allows the user to d their previously named evals.',
            args: [
                {
                    key: 'member',
                    prompt: 'Who would you like to ban?',
                    type: 'member'
                }
            ],
            ownerOnly: true
		});
	}

    async run(msg, { member }) {
    	await (new User(member)).ban();
    	await msg.say("ok");
	}
};
