import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: "Gives the server invitation link for evaller",
})
export class UserCommand extends SubCommandPluginCommand {
	public async messageRun(message: Message) {
		await message.reply('<https://discord.com/api/oauth2/authorize?client_id=650360931607511051&permissions=0&scope=bot>');
	}
}
