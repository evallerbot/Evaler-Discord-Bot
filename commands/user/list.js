const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

const db = require('../../db/db.js');

module.exports = class ShareCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'list',
			group: 'user',
			memberName: 'list',
			description: 'Allows the user to list all their previously named evals.'
		});
	}

	run(msg) {
		const collection = db.collection('users').doc(msg.author.id).collection('saved-code');

		const embed = new RichEmbed;

		embed
		.setAuthor(msg.author.tag, msg.author.avatarURL)
		.setTimestamp()
		.setColor("AQUA");
		
		collection.get({})
		.then(snap => {
			
			let i = 0;
			
			embed.setDescription("**Name		Lang		Date**");
				
			snap.forEach(doc => {
				const data = doc.data();
				i++;

				const name = "```" + doc.id + Buffer.alloc(16 - doc.id.length).fill(' ').toString();
				const lang = data.lang + Buffer.alloc(12 - data.lang.length).fill(' ').toString();
				const date = new Date(data.date).toLocaleString();

				embed.addField('Saved Eval #' + i, name + lang + date + "```");
			});
			
			if(i === 0){
				embed.setDescription("You haven't saved any evals yet. Type `" + process.env.PREFIX + "help eval` to see how to save evals.");
			}
			else {
				embed.setTitle("Here are your previously saved evals.");
			}
			
			return msg.channel.send(embed);
		})
		.catch(err => {
			console.log('Error getting document', err);
			return msg.say('Error!');
		});
	}
};
