const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Smuta un membro nel server')
        .addUserOption(option => option.setName('user').setDescription('L\'utente da smutare').setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('user');

        // Controlla se l'utente ha il permesso di amministratore
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Non hai il permesso per eseguire questo comando.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: 'Utente non trovato.', ephemeral: true });
        }

        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return interaction.reply({ content: 'Ruolo "Muted" non trovato.', ephemeral: true });
        }

        await member.roles.remove(muteRole);
        await interaction.reply({ content: `${member.user.tag} è stato smutato.` });
    },
};
