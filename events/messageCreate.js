const { prefix } = require('../config.json');

module.exports = {
    name: 'messageCreate',
    execute(message, logger) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = message.client.commands.get(commandName);
        
        if (!command) return;

        try {
            command.execute(message, args);
            logger.info(`Command ${commandName} eseguito da ${message.author.tag}`);
        } catch (error) {
            logger.error(`Errore eseguendo il comando ${commandName}:`, error);
            message.reply('C\'è stato un errore durante l\'esecuzione di quel comando!');
        }
    },
};
