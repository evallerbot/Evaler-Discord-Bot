const { Command } = require('discord.js-commando');
const cp = require('child_process');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'pm',
			group: 'dev',
			memberName: 'pm',
			description: '',
			ownerOnly: true,
			args: [
				{
					key: 'arg',
					type: 'string',
					prompt: '',
					default: 'show main'
				}
			]
		});
	}
	async run(msg, { arg }){
        const mess = await msg.say("...");
        
        const ps = cp.spawn("pm2", arg.split(" "), {
        	shell: "/bin/bash"
        });
        
        let data = ">>> ```\n";
        
        ps.stdout.on("data", chunk => {
          if(data.length < 1997){
          	data += chunk.toString();
          	mess.edit(data + '```');
          }
        });
        
        ps.stderr.on("data", chunk => {
          if(data.length < 1997){
          	data += chunk.toString();
          	mess.edit(data + '```');
          }
        });
        
        ps.on("exit", code => {
          if(data.length < 1990){
          	mess.edit(data + "\nExit " + code + '```');
          }
        });
        
        setTimeout (() => {
        	ps.kill("SIGTERM");
        }, 5000);
    }
};