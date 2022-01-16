import { Args, ok, SapphirePrefix } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

const defaultEmbed = (embed: MessageEmbed, prefix?: SapphirePrefix) => {
	embed
		.setDescription('Type  `' + prefix + 'help <command-name>` to view command specific help.')
		.addField('Prefix', '> The prefix for the bot is: `' + prefix + '`')
		.addField(
			'Admin Commands',
			`
>>> \`ban\` Bans a user from using the bot.
\`unban\` Unbans a user from using the bot.
    `
		)
		.addField(
			'User Commands',
			`
>>> \`eval\` Give it code and it will send back the result!
\`share\` Share your previously saved code!
\`list\` Lists all the previously saved evals!
\`del\` Deletes a previously saved eval!
\`save\` Allows you to save code without excution.
\`eval_saved\` or \`es\` for short, executes a previously saved code and re-executes the code and saves it.
    `
		)
		.setFooter({ text: 'Run on Repl.it', iconURL: 'https://i.imgur.com/89E6Sie.png' })
		.setTimestamp();
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

		if (!specificCommand.success) {
			defaultEmbed(helpPrompt, prefix);

			return await message.reply({ embeds: [helpPrompt] });
		}

		switch (specificCommand.value[0]) {
			/*
			 * EVAL *
			 */
			case 'eval':
				helpPrompt
					.setDescription('Command `eval`!')
					.addField(
						'Syntax',
						`
> eval <optional-name> 
> \\\`\\\`\\\`[language-name]
> [code]
> \\\`\\\`\\\`
Evals the [code] and shows the output. If the optional name is specified, the result is also saved and you can fetch it using the \`${process.env.PREFIX}share\` command.
Currently supported languages are,
 •Volant
 •JavaScript
 •Python
 •Java
 •C
 •C++
 •CSharp
 •Rust
 •Ruby
 •Bash
 •Sh
 •Swift
 •FSharp
 •Raku
 •Obrya
 •CookeyLang
If the language name is not specified, an error is thrown.`
					)
					.addField('\u200b', '\u200b');
				break;

			/*
			 * SHARE *
			 */
			case 'share':
				helpPrompt
					.setDescription('Command `share`!')
					.addField(
						'Syntax',
						`
> \`${process.env.PREFIX}share [name]\`
Fetches the code and output of eval named <name> if it was saved by you.
If [name] does not exist, an error is thrown. You can use the \`${process.env.PREFIX}list\` command to see your saved evals.
*Note that in order for share to run, you would need to have previously run \`${process.env.PREFIX}eval <name>\` to save your code that you want to share*
					`
					)
					.addField('\u200b', '\u200b');
				break;

			/*
			 * LIST *
			 */
			case 'list':
				helpPrompt
					.setDescription('Command `list`!')
					.addField(
						'Syntax',
						`
> \`${process.env.PREFIX}list\`
See your shared evals. That's it.
					`
					)
					.addField('\u200b', '\u200b');
				break;

			/*
			 * DEL *
			 */
			case 'del':
				helpPrompt
					.setDescription('Command `del`!')
					.addField(
						'Syntax',
						`
> \`${process.env.PREFIX}del [name]\`
Deletes the eval named [name].
					`
					)
					.addField('\u200b', '\u200b');
				break;

			/*
			 * SAVE *
			 */
			case 'save':
				helpPrompt
					.setDescription('Command `save`!')
					.addField(
						'Syntax',
						`
> \`${process.env.PREFIX}save [name] [\`\`\`[code-language] [code] \`\`\`] \`
Just saves the code that you inputed.
					`
					)
					.addField('\u200b', '\u200b');
				break;

			/*
			 * EVAL_SAVED || ES *
			 */
			case 'eval_saved':
			case 'es':
				helpPrompt
					.setDescription('Command `eval_saved`!')
					.addField(
						'Syntax',
						`
> \`${process.env.PREFIX}eval_saved [name] \`
> \`${process.env.PREFIX}es [name]\`
reruns the saved code, and overrides the previous saved result.
					`
					)
					.addField('\u200b', '\u200b');
				break;

			/*
			 * BAN *
			 */
			case 'ban':
				helpPrompt
					.setDescription('Command `ban`!')
					.addField(
						'Syntax',
						`
> \`${process.env.PREFIX}ban [name] \`
**ADMIN ONLY COMMAND**
Bans a user from using the bot.
					`
					)
					.addField('\u200b', '\u200b');
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
> \`${process.env.PREFIX}unban [name] \`
**ADMIN ONLY COMMAND**
Unbans a user from using the bot.
					`
					)
					.addField('\u200b', '\u200b');
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
