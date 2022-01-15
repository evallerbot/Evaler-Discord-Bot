import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import db from '../../../lib/db';

@ApplyOptions<SubCommandPluginCommandOptions>({
	aliases: ["ls"],
	description: "Lists all saved evals of the user",
})
export class UserCommand extends SubCommandPluginCommand {
	public async messageRun(message: Message) {
		const collection = db.collection("users").doc(message.author.id).collection("saved-code");
		
		const embed = new MessageEmbed()
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() || undefined })
			.setTimestamp()
			.setColor("AQUA")
			.setDescription("Here are your previously saved evals:\n```\nName            Lang        Date\n\n");

		const snap = await collection.get();
		
		snap.docs.forEach((doc) => {
			const data = doc.data();
			
			const name = doc.id + Buffer.alloc(16 - doc.id.length).fill(' ').toString();
			const lang = data.lang + Buffer.alloc(12 - data.lang.length).fill(' ').toString();
			const date = new Date(data.date).toDateString();

			embed.description += name + lang + date + "\n";
		});
		embed.description += "```\n **Total:** " + snap.docs.length;

		if(snap.docs.length === 0){
			embed.setDescription("No saved evals found");
		}

		return message.reply({ embeds: [embed] });
	}
}
