const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Cancella un numero specifico di messaggi in un canale')
        .addIntegerOption(option => option.setName('amount').setDescription('Numero di messaggi da cancellare').setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'Non hai il permesso per eseguire questo comando.', ephemeral: true });
        }

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Puoi cancellare solo tra 1 e 100 messaggi alla volta.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `${amount} messaggi sono stati cancellati.`, ephemeral: true });
    },
};
