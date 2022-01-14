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
			name: "eval",
			aliases: ["e"],
			group: "user",
			memberName: "eval",
			description: "evals",
			args: [
			    {
                    key: "raw_name",
                    type: "string",
                    prompt: "",
                    default: ""
			    },
			    {
                    key: "embedded_code",
                    prompt: "",
                    type: "string",
                    default: ""
                }
			]
		});
	}
	
	async run(msg, { raw_name, embedded_code }){
        msg.say("Repl's crosis API is currently unavailable, sorry.");
        return;
        
		const x = evaller.onIdle();
		const user = new User(msg.member);
		
		await user.prepare();

		const info = user.data();
		
		if(info.ban){
			await msg.say("You are not allowed to use this command.");
			return;
		}
        const c = this.parse(embedded_code, raw_name, msg.content);
        
        switch (c){
		case 1:
			await msg.say('Please provide a valid program to run. Type `' + process.env.PREFIX + 'help eval` for help.');
			return;
		case 2:
			await msg.say('Please use a language code in your code block');
			return;
        }
        
        const { lang, code, name } = c;
        
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
				
                message.edit(embed);
				clearInterval(editor);
				
                editor = null;
				await msg.say("You can't save output larger than 1024 characters.");
            }
        };
		await x;

        evaller.on("out", l);
        evaller.on("kill", () => {
        	msg.say("Your execution was killed because it was talking too much time to complete.");
        });
        
        const res = await evaller.exec(lang, code, info.timeout);
		
        if(!res){
        	msg.say("The language you specified is not currently supported. Sorry!\n You can do `help eval` to see currently supported languages.");
			return
		}

		if(editor) {
			clearInterval(editor);
			message.edit(embed);
		}
		if(data.trim() === ""){
			embed.fields[1].value = '```sh\nEval Successful!```';
			message.edit(embed);
		}
		
		if(name && data !== undefined){
			if(name.length > 8){
				await msg.say("The name of eval cannot be larger than 16 characters.");
				return;
			}
			await this.save(msg.author.id, {
				code, lang: Evaller.languages[lang] || lang, name,
				output: data
			});
		}
	}
    parse(_code, _name, content){
    	let code = _code;
        let lang;
        let name = _name;
        
        // checks if the name is specified or not and if it is not, the name argument is treated as a part of code
        if(name.substring(0, 3) === '```'){
            code = content.substring(content.search('`'));
            name = undefined;
        }

        // if the code is not an embed
        if(code.substring(0, 3) !== '```'){
            return 1;
        }
        
        code = code.substring(3);
        code = code.split('\n');
        lang = code[0].toLowerCase();
        code = code.slice(1).join("\n").slice(0, -3);
        
        if (lang === '') return 2;
        
        return { lang, code, name };
    }
    
    async save(id, {code, output, lang, name}){
        // name is name of the file.
        let docRef = db.collection('users').doc(id).collection('saved-code').doc(name);
        await docRef.set({
			code: code,
			lang: lang,
			output: output,
			date: Date.now()
		});
    }
};