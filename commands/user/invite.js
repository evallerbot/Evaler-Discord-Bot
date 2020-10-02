const { Command } = require('discord.js-commando');

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'user',
            memberName: 'invite',
            description: 'Sends an invite for the bot'
        })
    }

    async run(msg) {
        await msg.say('<https://discord.com/api/oauth2/authorize?client_id=650360931607511051&permissions=0&scope=bot>')
    }
}