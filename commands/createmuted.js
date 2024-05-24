const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createmuted')
        .setDescription('Crea il ruolo "Muted" e imposta i permessi necessari'),
    async execute(interaction) {
        const guild = interaction.guild;

        // Verifica se il ruolo "Muted" esiste già
        let mutedRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (mutedRole) {
            return interaction.reply({ content: 'Il ruolo "Muted" esiste già.', ephemeral: true });
        }

        try {
            // Crea il ruolo "Muted"
            mutedRole = await guild.roles.create({
                name: 'Muted',
                color: '#808080',
                reason: 'Ruolo per mutare gli utenti',
                permissions: []
            });

            // Aggiorna i permessi di ogni canale
            guild.channels.cache.forEach(async (channel) => {
                if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                    await channel.permissionOverwrites.edit(mutedRole, {
                        SendMessages: false,
                        AddReactions: false,
                        Speak: false,
                        Stream: false,
                    });
                }
            });

            await interaction.reply({ content: 'Il ruolo "Muted" è stato creato con successo e i permessi sono stati impostati.', ephemeral: true });
        } catch (error) {
            console.error('Errore durante la creazione del ruolo "Muted":', error);
            await interaction.reply({ content: 'C\'è stato un errore durante la creazione del ruolo "Muted".', ephemeral: true });
        }
    },
};
