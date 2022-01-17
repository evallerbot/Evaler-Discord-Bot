import { Args, ok, SapphirePrefix } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { inlineCodeBlock as iCB } from '@sapphire/utilities';
import { blockQuote, quote, italic, bold } from '@discordjs/builders';
import { Languages } from '../../lib/evaller';

const defaultEmbed = (embed: MessageEmbed, prefix: SapphirePrefix | undefined) => {
	const adminCommands = blockQuote(
		`${iCB('ban')} Bans a user from using the bot.
    ${iCB('unban')} Unbans a user from using the bot.
  `
	);
	const UserCommands = blockQuote(
		`${iCB('eval')} Give it code and it will send back the result!
    ${iCB('share')} Share your previously saved code!
    ${iCB('list')} Lists all the previously saved evals!
    ${iCB('del')} Deletes a previously saved eval!
    ${iCB('save')} Allows you to save code without excution.
    ${iCB('eval_saved')} or ${iCB('es')} for short, executes a previously saved code and re-executes the code and saves it.
    `
	);

	embed
		.setDescription('Type  `' + prefix + 'help <command-name>` to view command specific help.')
		.addField('Prefix', '> The prefix for the bot is: `' + prefix + '`')
		.addField('Admin Commands', adminCommands)
		.addField('User Commands', UserCommands)
		.setFooter({ text: 'Run on Repl.it', iconURL: 'https://i.imgur.com/89E6Sie.png' })
		.setTimestamp();
};

const syntaxHeader = (name: string, prefix: SapphirePrefix | undefined) => {
	return quote(iCB(prefix + name));
};

@ApplyOptions<CommandOptions>({
	description: 'Shows help'
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const prefix = this.container.client.options.defaultPrefix;

		// Remove front spaces, lowercase, and split to get first arg only.
		const resolver = Args.make((arg) => ok(arg.trim().toLowerCase().split(' ')));
		const specificCommand = await args.restResult(resolver);

		const helpPrompt = new MessageEmbed()
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() || undefined })
			.setColor('RED')
			.setTitle(':wave: | You needed help?')
			.setFooter({ text: 'Run on Repl.it', iconURL: 'https://i.imgur.com/89E6Sie.png' })
			.setTimestamp();

		// If there are arguments then just do default
		if (!specificCommand.success) {
			defaultEmbed(helpPrompt, prefix);

			return await message.reply({ embeds: [helpPrompt] });
		}

		// Get the first argument
		switch (specificCommand.value[0]) {
			/*
			 * EVAL *
			 */
			case 'eval': {
				const syntax = `${quote('eval <optional-name>')}
          ${quote('\\`\\`\\`[language-name]')}
          ${quote('[code]')}
          ${quote('\\`\\`\\`')}`;

				const description = `Evals the [code] and shows the output.
          If the optional name is specified, the result is also saved and you can fetch it using the ${prefix + iCB('share')} command.`;

				let supportLangs = 'Currently supported languages are,\n';
				for (const key in Languages) {
					supportLangs += `• ${key}\n`;
				}
				supportLangs += 'If the language name is not specified, an error is thrown.';

				helpPrompt.setDescription('Command `eval`!').addField(
					'Syntax',
					`
          ${syntax}
          ${description}
          ${supportLangs}
          `
				);

				break;
			}
			/*
			 * SHARE *
			 */
			case 'share': {
				const body = `Fetches the code and output of eval named <name> if it was saved by you.
        If [name] does not exist, an error is thrown. You can use the ${iCB(prefix + 'list')} command to see your saved evals.`;
				const bottomBody = italic(
					`Note that in order for share to run, you would need to have previously run ${iCB(
						prefix + 'eval <name>'
					)} to save your code that you want to share`
				);

				helpPrompt.setDescription('Command `share`!').addField(
					'Syntax',
					`
          ${syntaxHeader('share [name]', prefix)}
          ${body}
          ${bottomBody}
					`
				);

				break;
			}
			/*
			 * LIST *
			 */
			case 'list': {
				helpPrompt.setDescription('Command `list`!').addField(
					'Syntax',
					`
          ${syntaxHeader('list', prefix)}
          See your shared evals. That's it.
					`
				);

				break;
			}
			/*
			 * DEL *
			 */
			case 'del': {
				helpPrompt.setDescription('Command `del`!').addField(
					'Syntax',
					`
          ${syntaxHeader('del [name]', prefix)}
          Deletes the eval named [name].
					`
				);

				break;
			}
			/*
			 * SAVE *
			 */
			case 'save': {
				const syntax = `${quote('save [name]')}
          ${quote('\\`\\`\\`[language-name]')}
          ${quote('[code]')}
          ${quote('\\`\\`\\`')}`;

				helpPrompt.setDescription('Command `save`!').addField('Syntax', syntax);

				break;
			}
			/*
			 * EVAL_SAVED || ES *
			 */
			case 'eval_saved':
			case 'es': {
				helpPrompt.setDescription('Command `eval_saved`!').addField(
					'Syntax',
					`
          ${syntaxHeader('eval_saved [name]', prefix)}
          ${syntaxHeader('es [name]', prefix)}
          Reruns the saved code, and overrides the previous saved result.
          `
				);

				break;
			}

			/*
			 * BAN *
			 */
			case 'ban':
				helpPrompt.setDescription('Command `ban`!').addField(
					'Syntax',
					`
          ${syntaxHeader('ban [name]', prefix)}
          ${bold('ADMIN ONLY COMMAND')}
          Bans a user from using the bot.
					`
				);

				break;

			/*
			 * UNBAN *
			 */
			case 'unban':
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `unban`!')
					.addField(
						'Syntax',
						`
            ${syntaxHeader('unban [name]', prefix)}
            ${bold('ADMIN ONLY COMMAND')}
            Unbans a user from using the bot.
					  `
					);

				break;

			/*
			 * DEFAULT *
			 */
			default:
				defaultEmbed(helpPrompt, prefix);
		}

		return await message.reply({ embeds: [helpPrompt] });
	}
}
