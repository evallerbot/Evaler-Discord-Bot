import { Args, ok } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Shows help'
})
export class UserCommand extends Command {
	public async messageRun(message: Message, args: Args) {
    const prefix = this.container.client.options.defaultPrefix;

    // Remove front spaces, lowercase, and split to get first arg only.
    const resolver = Args.make((arg) => ok(arg.trim().toLowerCase().split(' ')));
    const specificCommand = await args.restResult(resolver);

    if(!specificCommand.success) {
      const helpPrompt = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() || undefined })
        .setColor('RED')
        .setTitle(':wave: | You needed help?')
        .setDescription('Type  `' + prefix + 'help <command-name>` to view command specific help.')
        .addField('Prefix', '> The prefix for the bot is: `' + prefix + '`')
        .addField('Admin Commands', `
>>> \`ban\` Bans a user from using the bot.
\`unban\` Unbans a user from using the bot.
        `)
        .addField('User Commands', `
>>> \`eval\` Give it code and it will send back the result!
\`share\` Share your previously saved code!
\`list\` Lists all the previously saved evals!
\`del\` Deletes a previously saved eval!
\`save\` Allows you to save code without excution.
\`eval_saved\` or \`es\` for short, executes a previously saved code and re-executes the code and saves it.
        `)
        .setFooter({ text: 'Run on Repl.it', iconURL: 'https://i.imgur.com/89E6Sie.png'})
        .setTimestamp();

      return await message.reply({ embeds: [helpPrompt] });
    }

    console.log(specificCommand)
    return await message.reply("h")
	}
}