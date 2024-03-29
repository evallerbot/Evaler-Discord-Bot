import './lib/setup';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import server from "./server";

const port = process.env.PORT || 9942;

const client = new SapphireClient({
	defaultPrefix: '_',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	]
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info(`logged in as ${client.user!.tag}`);
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();

server.listen(port, () => {
	client.logger.info(`server listenning successfully on port ${port}`);
});
