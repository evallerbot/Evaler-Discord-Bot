import { ApplyOptions } from '@sapphire/decorators';import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import User from '../../lib/user';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Unbans a banned user',
	quotes: [],
	preconditions: ['OwnerOnly'],
	flags: ['async', 'hidden', 'showHidden', 'silent', 's'],
})
export class UserCommand extends SubCommandPluginCommand {
  public async messageRun(message: Message, args: Args) {
		const member = await args.pick("member");
		const user = await User.from(member.id);

		await user.unban();
		await message.reply("ok");
  }
}
