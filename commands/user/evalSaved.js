const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const Evaller = require('../../util/evaller.js');
const User = require('../../util/user.js');
const db = require('../../db/db.js');

const evaller = new Evaller(global.client);

evaller.prepare();

module.exports = class extends Command {
	constructor(client) {
	    
		super(client, {
			name: "eval_saved",
			aliases: ["es"],
			group: "user",
			memberName: "eval_saved",
			description: "evals",
			args: [
			    {
                    key: "name",
                    type: "string",
                    prompt: "buh gib name",
			    }
			]
		});
	}
	
	async run(msg, { name }){
		const x = evaller.onIdle();

		const user = new User(msg.member);
		await user.prepare();
		
		const info = user.data();
		
		if(info.ban){
			await msg.say("You are not allowed to use this command.");
			return;
		}
		
		const docRef = db.collection('users').doc(msg.author.id).collection('saved-code').doc(name);
        
        const doc = await docRef.get();
        
        if(!doc.exists){
        	await msg.say("We couldn't find a record with that name.");
        	return;
        }
        
        const { lang, code } = doc.data();
        
        const embed = new RichEmbed;
        
        embed
        .setAuthor(msg.author.tag, msg.author.avatarURL)
        .setTitle("EVAL!")
        .setDescription("Beep! Boop! Boop! Beep!")
        .setColor("DARK_AQUA")
        .addField("Code", "```" + lang + "\n" + (code.length > 500 ? code.substring(0, 500) + "..." : code)  + "\n```")
        .addField("Output", "```sh\nCode running please wait...\n```")
        .setTimestamp();
         
        const message = await msg.say(embed);
        
        let data = "";
		
		let lastData = data;
		let editor = setInterval(() => {
			if(data != lastData) {
				message.edit(embed);
				lastData = data;
			}
		}, 750);

		const l = async (out) => {
			data += out;
            
        	if(data.length < 1024){
                embed.fields[1].value = '```sh\n' + data + '```';
            } else {
				data = data.substring(0, 1000) + "...";
                embed.fields[1].value = '```sh\n' + (data) + '```';
                evaller.off("out", l);
				clearInterval(editor);
				editor = null;
				message.edit(embed);
				await msg.say("You can't save output larger than 1024 characters.");
            }
		};

		await x;

        evaller.on("out", l);
        evaller.on("kill", () => {
        	msg.say("Your execution was killed because it was talking too much time to complete.");
        });

		const res = await evaller.exec(lang, code, info.timeout);

		if(editor) {
			clearInterval(editor);
			message.edit(embed);
		}
		
        if(!res){
            msg.say("The language you specified is not currently supported. Sorry!\n You can do `help eval` to see currently supported languages.");
			return 
		}

		if(data.trim() === ""){
			embed.fields[1].value = '```sh\nEval Successful!```';
			message.edit(embed);
		}
		
		await docRef.set({
			code, lang, 
			output: data,
			date: Date.now()
		});
	}
};