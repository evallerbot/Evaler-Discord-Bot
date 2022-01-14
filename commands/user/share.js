const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const db = require('../../db/db.js');

// This file contains a `share` command, this will allow the user to share their code that they previously used `save <name>` with.
// Thinking this would be used as [<prefix> -share <name>], it will show the code & the result.

module.exports = class ShareCommand extends Command {
  
	constructor(client) {
		super(client, {
			name: 'share',
			//  aliases: [''],
			group: 'user',
			memberName: 'share',
			description: 'Allows the user to share their previously named evals.',
			args: [
				{
					key: 'name',
					prompt: 'what is the name of the saved eval?',
					type: 'string',
				}
			]
		});
	}
 
  run(message, { name }) {
	// This is located in `../db/db.js` using firebase
	// Create a new collection for the user using their discord id or use old one.
	let docRef = db.collection('users').doc(message.author.id).collection('saved-code').doc(name);

	const embed = new RichEmbed;

	embed
	.setAuthor(message.author.tag, message.author.avatarURL)
	.setTimestamp()
	.setColor("GREEN");
	
	docRef.get().then(doc => {
		
		if (!doc.exists) {
			embed.setDescription('Sorry! We couldn\'t find a record with that name. You can use `' + process.env.PREFIX + 'list` command to view all your previous saves.');
			return message.embed(embed);
		}
		else{
			const data = doc.data();

			embed
			.setTitle(name)
			.setDescription("Your previous save with the name of: `" + name + "`")
			.addField("Code", "```" + data.lang + "\n" + data.code + "\n```")
			.addField("Output", "```sh\n" + data.output + "\n```")
			.addField("Online View", `https://evaller.repl.co/${message.author.id}/${name}`);
			
			return message.embed(embed);
		}
	})
	.catch(err => {
		console.log('Error getting document', err);
		return message.say('Error!');
	});
	}
};
