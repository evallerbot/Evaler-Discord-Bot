const { Command } = require('discord.js-commando');
const User = require('../../util/user.js');

module.exports = class ShareCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'timeout',
			group: 'administrative',
			memberName: 'timeout',
			description: 'hehe! I don\'t know what to write',
            args: [
                {
                    key: 'member',
                    prompt: '',
                    type: 'member',
                    default: ''
                },
                {
                	key: 'timeout',
                	prompt: '',
                	type: 'string',
                	default: ''
                }
            ],
            ownerOnly: true
		});
	}

    async run(msg, { member, timeout }) {
    	const user = new User(member);
    	await user.prepare();
    	
		if(timeout == ''){
			const t = await user.getTimeout();
			if(t == Infinity)
				msg.say("Infinity")
			else
				msg.say(await user.getTimeout()+"ms");
			return;
		}
		if(!Number(timeout)){
			msg.say("Timeout must be a valid number.");
		}
    	await user.setTimeout(Number(timeout));
    	await msg.say("ok");
	}
};
