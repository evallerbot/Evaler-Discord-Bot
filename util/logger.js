const { RichEmbed } = require("discord.js");

class Logger {
	constructor(channel){
		this.channel = channel;
	}
	
	logEval(user, {lang, code, name}){
		const embed = new RickEmbed;
		
		embed
		.setAuthor(user.tag, user.avatarURL)
		.setTitle("Eval!")
		.addField("Id", user.id)
		.addField("Lang", lang)
		.addField("Eval Name", name || "null")
		.addField("Code", "```" + lang + "\n" + code + "```")
		.setTimestamp();
		
		this.channel.send(embed);
	}
}

module.exports = Logger;