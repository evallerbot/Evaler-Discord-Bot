import type { Message } from 'discord.js';
import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import db from '../../../lib/db';
import Evaller from '../../../lib/evaller';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: "Saves code for sharing or evaluating later.",
})
export class UserCommand extends SubCommandPluginCommand {
	public async messageRun(message: Message, args: Args) {
		let name = await args.pick("string");
		let code = await args.pick("string");
		let lang;

		const docRef = db.collection("users").doc(message.author.id).collection("saved-code").doc(name);

		if(name.length > 16) {
			await message.reply("The name of eval cannot be larger than 16 characters.")
		}
		code = message.content.slice(message.content.search("`"));

		const arr = code.substring(3).split("\n");

		lang = Evaller.normalizeLang(arr[0].toLowerCase());
		code = arr.slice(1).join("\n").slice(0, -3);
		
		if(!lang){
			await message.reply("Please provide a language for your code.");
			return;
		}
		
		if(lang.length > 12) {
			await message.reply("Invalid language.");
			return;
		}

		await docRef.set({ lang, code, output: "", date: Date.now() });
		await message.reply("Done!");
	}
}
