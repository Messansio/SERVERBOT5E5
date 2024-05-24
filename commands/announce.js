const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Manda un annuncio in un canale specifico')
        .addChannelOption(option => option.setName('channel').setDescription('Canale in cui mandare l\'annuncio').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Messaggio da annunciare').setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        // Controlla se l'utente ha il permesso di amministratore
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'Non hai il permesso per eseguire questo comando.', ephemeral: true });
        }

        // Format the message as a quote and add @everyone
        const announcement = `> ${message}\n\n||@everyone||`;

        try {
            await channel.send(announcement);
            await interaction.reply({ content: 'Annuncio inviato con successo.', ephemeral: true });
        } catch (error) {
            console.error('Errore durante l\'invio dell\'annuncio:', error);
            await interaction.reply({ content: 'C\'è stato un errore durante l\'invio dell\'annuncio.', ephemeral: true });
        }
    },
};
