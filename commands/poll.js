const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Crea un sondaggio in un canale specifico')
        .addStringOption(option => option.setName('question').setDescription('Domanda del sondaggio').setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const embed = new EmbedBuilder()
            .setTitle('Sondaggio')
            .setDescription(question)
            .setColor('#00FF00')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('poll_yes')
                    .setLabel('Sì')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('poll_no')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger),
            );

        try {
            const pollMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

            const filter = i => i.customId === 'poll_yes' || i.customId === 'poll_no';
            const collector = pollMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'poll_yes') {
                    await i.update({ content: 'Hai votato Sì', components: [], ephemeral: true });
                } else {
                    await i.update({ content: 'Hai votato No', components: [], ephemeral: true });
                }
            });

            collector.on('end', collected => {
                console.log(`Raccolti ${collected.size} voti.`);
            });
        } catch (error) {
            console.error('Errore durante l\'esecuzione del comando /poll:', error);
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};
