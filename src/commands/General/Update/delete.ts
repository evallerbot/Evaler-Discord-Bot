import type { Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import db from '../../../lib/db';

@ApplyOptions<SubCommandPluginCommandOptions>({
	aliases: ["del"],
	description: "Deletes saved eval"
})
export class UserCommand extends SubCommandPluginCommand {
	public async messageRun(message: Message, args: Args) {
		const name = await args.pick("string");
		
    await db.collection("users").doc(message.author.id).collection("saved-code").doc(name).delete();
		return message.reply("Done!");
	}
}
