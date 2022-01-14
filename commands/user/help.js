const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class SaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['h'],
			group: 'user',
			memberName: 'help',
			description: 'Shows help',
			args: [
				{
					key: "command",
					type: "string",
					oneOf: ["eval", "share", "del", "list", "save", "eval_saved", "es", "ban", "unban"],
					default: "default",
					prompt: ""
				}
			]
		});
	}

	run(msg, { command }) {
		const helpPrompt = new RichEmbed()

		switch (command) {
			/*
			* EVAL *
			*/
			case 'eval':
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `eval`!')
					.addField('Syntax', `
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

If the language name is not specified, an error is thrown.`)
					.addBlankField(true)
					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();
				return msg.embed(helpPrompt);

			/*
			* SHARE *
			*/
			case 'share':
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `share`!')
					.addField('Syntax', `
> \`${process.env.PREFIX}share [name]\`

Fetches the code and output of eval named <name> if it was saved by you.
If [name] does not exist, an error is thrown. You can use the \`${process.env.PREFIX}list\` command to see your saved evals.

*Note that in order for share to run, you would need to have previously run \`${process.env.PREFIX}eval <name>\` to save your code that you want to share*
					`)
					.addBlankField(true)
					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();
				return msg.embed(helpPrompt);

			/*
			* LIST *
			*/
			case "list":
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `list`!')
					.addField('Syntax', `
> \`${process.env.PREFIX}list\`

See your shared evals. That's it.
					`)
					.addBlankField(true)
					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();
				return msg.embed(helpPrompt);

			/*
			* DEL *
			*/
			case "del":
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `del`!')
					.addField('Syntax', `
> \`${process.env.PREFIX}del [name]\`

Deletes the eval named [name].
					`)
					.addBlankField(true)
					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();
				return msg.embed(helpPrompt);

			/*
			* SAVE *
			*/
			case "save":
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `save`!')
					.addField('Syntax', `
> \`${process.env.PREFIX}save [name] [\`\`\`[code-language] [code] \`\`\`] \`

Just saves the code that you inputed.
					`)
					.addBlankField(true)
					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();
				return msg.embed(helpPrompt);

			/*
			* EVAL_SAVED || ES *
			*/
			case "eval_saved": case "es":
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `eval_saved`!')
					.addField('Syntax', `
> \`${process.env.PREFIX}eval_saved [name] \`
> \`${process.env.PREFIX}es [name]\`

reruns the saved code, and overrides the previous saved result.
					`)
					.addBlankField(true)
					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();
				return msg.embed(helpPrompt);

			/*
			* BAN *
			*/
			case "ban":
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `ban`!')
					.addField('Syntax', `
> \`${process.env.PREFIX}ban [name] \`

**ADMIN ONLY COMMAND**
Bans a user from using the bot.
					`)
					.addBlankField(true)
					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();
				return msg.embed(helpPrompt);

			/*
			* UNBAN *
			*/
			case "unban":
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')
					.setDescription('Command `unban`!')
					.addField('Syntax', `
> \`${process.env.PREFIX}unban [name] \`

**ADMIN ONLY COMMAND**
Unbans a user from using the bot.
					`)
					.addBlankField(true)
					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();
				return msg.embed(helpPrompt);

			/*
			* DEFAULT *
			*/
			default:
				helpPrompt
					.setColor('RED')
					.setTitle(':wave: | You needed help?')

					.setDescription('Type `' + process.env.PREFIX + 'help <command-name>` to view command specific help.')

					.addField('Prefix', '> The prefix for the bot is: `' + process.env.PREFIX + '`')

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

					.setFooter('Run on Repl.it', 'https://i.imgur.com/89E6Sie.png')
					.setTimestamp();

				return msg.embed(helpPrompt);
		}
	}
};
