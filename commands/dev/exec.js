const { Command } = require('discord.js-commando');
const { spawn } = require('child_process');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'exec',
			group: 'dev',
			memberName: 'exec',
			description: '',
			args: [
				{
					key: 'code',
					type: 'string',
					prompt: '',
					default: ''
				}
			],
			ownerOnly: true
		});
	}
	
	async run(msg, { code }){
		await ((async () => { eval(code) })());
    }
};