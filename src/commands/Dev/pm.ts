import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { codeBlock } from '@sapphire/utilities';
import type { Message } from 'discord.js';
import { spawn } from 'child_process';

@ApplyOptions<CommandOptions>({
	aliases: ['ex'],
	description: 'Evals any JavaScript code',
	quotes: [],
	preconditions: ['OwnerOnly'],
	flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
	options: ['depth']
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
    const msg = await send(message, "...");
		const cmd = await args.pick("string");

		const ps = spawn("pm2", message.content.slice(message.content.search(cmd)).split(/\s+/g), { shell: "/bin/bash" });

    let data = "";

		ps.stdout.on("data", (chunk: Buffer) => {
			if (data.length < 1997) {
				data += chunk.toString();
				msg.edit(codeBlock("bash", data));
			}
		});

		ps.stderr.on("data", (chunk: Buffer) => {
			if (data.length < 1997) {
				data += chunk.toString();
				msg.edit(codeBlock("bash", data));
			}
		});

		ps.on("exit", (code: number) => {
			if (data.length < 1990) {
        msg.edit(codeBlock("bash", data + "\nExit " + code));
			}
		});

		setTimeout(() => {
			ps.kill("SIGTERM");
		}, 5000);
	}
}
