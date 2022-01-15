import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';

import Evaller, { Languages } from '../../../lib/evaller';
import User from '../../../lib/user';
import db from '../../../lib/db';
import { codeBlock } from '@sapphire/utilities';
import { aquire } from '../../../lib/mutex';

const evaller = new Evaller();
evaller.prepare();

@ApplyOptions<SubCommandPluginCommandOptions>({
	aliases: ["e"],
	preconditions: ["NotBannedOnly"],
	description: "Evals code",
})
export class UserCommand extends SubCommandPluginCommand {
	public async messageRun(message: Message, args: Args){
		let nameRaw: string  = await args.pick("string");
		let codeRaw = await args.pick("string").catch(_ => "");

		const user = await User.from(message.author.id);
		const parsed = this.parse(codeRaw, nameRaw, message.content);

		if(parsed.error){
			await message.reply(parsed.error);
			return;
		}
		const { lang, code, name } = parsed.data!;

		const embed = new MessageEmbed()
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() || undefined })
			.setTitle("EVAL!")
			.setDescription("Beep! Boop! Boop! Beep!")
			.setColor("DARK_AQUA")
			.addField("Code", codeBlock(lang, (code.length > 500 ? code.substring(0, 500) + "..." : code)))
			.addField("Output", codeBlock("sh", "Code running please wait..."))
			.setTimestamp();

		const msg = await message.reply({ embeds: [embed] });

		let data = "";
		let lastData = data;

		let editor = setInterval(() => {
			if(data != lastData){
				msg.edit({ embeds: [embed] });
				lastData = data;
			}
		}, 750);

		const onOutput = async (out: string) => {
			data += out;

			if(data.length < 1024){
				embed.fields![1].value = codeBlock("sh", data);
			} else {
				data = data.substring(0, 1000) + "...";
				embed.fields![1].value = codeBlock("sh", data);

				evaller.off("out", onOutput);
				clearInterval(editor);

				await msg.edit({ embeds: [embed] });
				await msg.channel.send("You can't save output larger than 1024 characters.");
			}
		};

		const onKill = () => {
			embed.fields![1].value = codeBlock("sh", "Your execution was killed because it was talking too much time to complete");
			msg.edit({ embeds: [embed] });
		};

		let res: number = 0;
		const release = await aquire("eval");

		try {
			evaller.on("out", onOutput);
			evaller.on("kill", onKill);
			
			res = await evaller.exec(Evaller.normalizeLang(lang)!, code, user.getTimeout()!);
		} finally {
			evaller.off("out", onOutput);
			evaller.off("kill", onKill);
			
			release();
		}

		if(!res){
			await msg.edit("The language you specified is not currently supported. Sorry!\n You can do `help eval` to see currently supported languages.");
			return;
		}

		if(editor){
			clearInterval(editor);
			msg.edit({ embeds: [embed] });
		}
		if(data.trim() === ""){
			embed.fields![1].value = codeBlock("sh", "Eval Successful!");
			msg.edit({ embeds: [embed] });
		}

		if(name && data !== undefined){
			if(name.length > 8){
				await msg.edit("The name of eval cannot be larger than 16 characters.");
				return;
			}
			await this.save(msg.author.id, { code, lang, name, output: data });
		}
	}
	parse(_code: string, _name: string, content: string): { error?: string, data?: { lang: keyof typeof Languages, code: string, name: string | undefined } } {
		let code: string = content.slice(content.search('`'));
		let lang: keyof typeof Languages | "" | undefined;
		let name: string | undefined = _name;

		// checks if the name is specified or not and if it is not, the name argument is treated as a part of code
		if(name.substring(0, 3) === "```"){
			name = undefined;
		}

		// if the code is not an embed
		if(code.substring(0, 3) !== "```"){
			return { error: "Invalid embed" };
		}
		const arr = code.substring(3).split("\n");

		lang = Evaller.normalizeLang(arr[0].toLowerCase());
		code = arr.slice(1).join("\n").slice(0, -3);

		if(!lang) return { error: "Invalid language name" };

		return { data: { lang, code, name } };
	}

	async save(userId: string, { code, output, lang, name }: { code: string, output: string, lang: string, name: string }){
		const docRef = db.collection('users').doc(userId).collection('saved-code').doc(name);

		await docRef.set({
			code: code,
			lang: lang,
			output: output,
			date: Date.now()
		});
	}
}
