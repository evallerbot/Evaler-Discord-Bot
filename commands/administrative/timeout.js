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
                	type: 'integer',
                	default: ''
                }
            ],
            ownerOnly: true
		});
	}

    async run(msg, { member, timeout }) {
    	
    	if(member === '' || timeout === ''){
    		return;
    	}
    	
    	const user = new User(member);
    	
    	await user.prepare();
    	
    	await user.setTimeout(timeout);
    	
    	await msg.say("ok");
	}
};
