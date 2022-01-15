import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import db from '../../../lib/db';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: "Shows saved eval with a persistant sharable link",
})
export class UserCommand extends SubCommandPluginCommand {
	public async messageRun(message: Message, args: Args) {
		const name = await args.pick("string");
		
		const embed = new MessageEmbed()
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() || undefined })
			.setTimestamp()
			.setColor("GREEN");

		const docRef = db.collection('users').doc(message.author.id).collection("saved-code").doc(name);
		const doc = await docRef.get();

		if(!doc.exists){
			embed.setDescription("No record found with that name. Use the list command to list all your saved code.");
			return message.reply({ embeds: [embed] });
		}
		const data = <{ lang: string, code: string, output: string }>doc.data();

		embed
			.setTitle(name)
			.setDescription("Your previous save with the name of: `" + name + "`")
			.addField("Code", "```" + data.lang + "\n" + data.code + "\n```")
			.addField("Output", "```sh\n" + data.output + "\n```")
			.addField("Online View", `https://evaller.repl.co/${message.author.id}/${name}`);

		return message.reply({ embeds: [embed] });
	}
}
