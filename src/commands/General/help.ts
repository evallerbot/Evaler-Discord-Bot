import type { Args, SapphirePrefix } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { inlineCodeBlock as iCB, codeBlock } from '@sapphire/utilities';
import { blockQuote } from '@discordjs/builders';
import { Languages } from '../../lib/evaller';

const defaultEmbed = (embed: MessageEmbed, prefix: SapphirePrefix | undefined) => {
	const commands = blockQuote(`
${iCB('eval')} - Give it code and it will send back the result.
${iCB('cat')} - Share your previously saved code.
${iCB('ls')} - Lists all the previously saved evals.
${iCB('del')} - Deletes a previously saved eval.
${iCB('save')} - Allows you to save code without excution.
${iCB('es')} - for short, executes a previously saved code and saves the updates.
	`.trim());

	embed
		.setDescription('Type  `' + prefix + 'help <command-name>` to view command specific help.')
		.addField('Prefix', '> The prefix for the bot is: `' + prefix + '`')
		.addField('Commands', commands)
		.setFooter({ text: 'Run on Repl.it', iconURL: 'https://i.imgur.com/89E6Sie.png' })
		.setTimestamp();
};

const syntaxHeader = (name: string, prefix: SapphirePrefix | undefined) => {
	return codeBlock('', prefix + name);
};

@ApplyOptions<CommandOptions>({
	description: 'Shows help'
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const prefix = this.container.client.options.defaultPrefix;
		const command = await args.pick("string").catch(() => "none");

		const helpPrompt = new MessageEmbed()
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() || undefined })
			.setColor('RED')
			.setFooter({ text: 'Run on Repl.it', iconURL: 'https://i.imgur.com/89E6Sie.png' })
			.setTimestamp();

		// If there are no arguments then just do default
		if (command == "none") {
			defaultEmbed(helpPrompt, prefix);
			return await message.reply({ embeds: [helpPrompt] });
		}

		switch (command) {
		case 'eval':
			helpPrompt
			.setTitle('Command `eval (e)`')
				.setDescription(`
Evals the \`[code]\` and returns the output.

If the optional name argument is specified, the result is saved and can be fetched using the ${iCB(prefix + 'cat')} command.`)
				.addField('Syntax:',`${syntaxHeader('eval <optional-name> \`\`\`[language-name]\n[code]\n\`\`\`', prefix)}`)
				.addField('Currently supported languages:', `${Object.keys(Languages).map(key => `• ${iCB(key)}`).join('\n')}`);
			break;

		case 'share':
		case 'cat':
			helpPrompt
			.setTitle('Command `cat (share)`')
			.setDescription(`
Fetches the code and output of a previously saved eval.

You can use the ${iCB(prefix + 'list')} command to see your saved evals, and ${iCB(prefix + 'save <name>')} and ${iCB(prefix + 'eval <name>')} commands to save evals.`)
			.addField('Syntax:', `${syntaxHeader('cat [name]', prefix)}`);
			break;

		case 'ls':
		case 'list':
			helpPrompt
				.setTitle('Command `list (ls)`')
				.setDescription('Lists your previously saved evals.')
				.addField('Syntax:', `${syntaxHeader('list', prefix)}`);
			break;

		case 'delete':
		case 'del':
			helpPrompt
				.setTitle('Command `del (delete)`')
				.setDescription('Deletes the eval named [name].')
				.addField('Syntax:', `${syntaxHeader('del [name]', prefix)}`);
			break;

		case 'save':
			helpPrompt
				.setTitle('Command `save`')
				.setDescription('Saves some code without evalling.')
				.addField('Syntax:', `${syntaxHeader('save [name]\`\`\`[language-name]\n[code]\n\`\`\`', prefix)}`);
			break;

		case 'evalsaved':
		case 'es':
			helpPrompt
				.setTitle('Command `evalsaved (es)`')
				.setDescription('Reruns the saved code, and overrides the previous saved result.')
				.addField('Syntax:', `${syntaxHeader('es [name]', prefix)}`);
			break;

		default:
			defaultEmbed(helpPrompt, prefix);
		}

		return await message.reply({ embeds: [helpPrompt] });
	}
}
