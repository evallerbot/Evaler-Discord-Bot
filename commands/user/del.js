const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const db = require('../../db/db.js');

module.exports = class ShareCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'del',
			//  aliases: [''],
			group: 'user',
			memberName: 'del',
			description: 'Allows the user to delete their previously named evals.',
			args: [
				{
					key: 'name',
					prompt: 'What is the name of the saved eval?',
					type: 'string',
				}
			]
		});
	}

	async run(message, { name }) {
		
		await db.collection('users').doc(message.member.id).collection('saved-code').doc(name).delete();

		const embed = new RichEmbed;

		embed
		.setAuthor(message.author.tag, message.author.avatarURL)
		.setTimestamp()
		.setDescription("`" + name + "` deleted successfully")
		.setColor("GREEN");
		
		message.embed(embed);
	}
};
