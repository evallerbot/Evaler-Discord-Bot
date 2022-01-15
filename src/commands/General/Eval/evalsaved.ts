import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';

import Evaller from '../../../lib/evaller';
import User from '../../../lib/user';
import db from '../../../lib/db';
import { codeBlock } from '@sapphire/utilities';
import { aquire } from '../../../lib/mutex';

@ApplyOptions<SubCommandPluginCommandOptions>({
	aliases: ["es"],
	preconditions: ["NotBannedOnly"],
	description: "Evals saved code",
})
export class UserCommand extends SubCommandPluginCommand {
	public async messageRun(message: Message, args: Args){
		const evaller = new Evaller();
		const name = await args.pick("string");

		const docRef = db.collection("users").doc(message.author.id).collection("saved-code").doc(name);
		const doc = await docRef.get();

		if (!doc.exists) {
			await message.reply("Couldn't find a record with that name.");
			return;
		}
		const { lang, code } = <{ lang: string, code: string }>doc.data();

		const user = await User.from(message.author.id);
		const embed = new MessageEmbed()
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() || undefined })
			.setTitle("EVAL!")
			.setDescription("Beep! Boop! Boop! Beep!")
			.setColor("DARK_AQUA")
			.addField("Code", codeBlock(lang, (code.length > 500 ? code.substring(0, 500) + "..." : code)))
			.addField("Output", codeBlock("sh", "Code running please wait..."))
			.addField("Web View", `https://evaller.repl.co/${message.author.id}/${name}`)
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

		await docRef.set({
			code: code,
			lang: lang,
			output: data,
			date: Date.now()
		});
	}
}
