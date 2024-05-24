module.exports = {
    name: 'ready',
    once: true,
    execute(client, logger) {
        logger.info(`Bot è online! Loggato come ${client.user.tag}`);
    },
};
