const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('initialize')
        .setDescription('Configura il server creando categorie, canali e ruoli per la community'),
    async execute(interaction) {
        // Controlla se l'utente ha il ruolo "Owner"
        const member = interaction.member;
        const ownerRole = member.guild.roles.cache.find(role => role.name === 'Owner');
        
        if (!ownerRole || !member.roles.cache.has(ownerRole.id)) {
            return interaction.reply({ content: 'Non hai il permesso per eseguire questo comando.', ephemeral: true });
        }

        await interaction.reply('Inizializzazione del server in corso...'); // Risposta immediata

        const guild = interaction.guild;

        try {
            // Categorie e canali
            const categories = [
                {
                    name: 'Informazioni',
                    channels: [
                        { name: 'regole', type: 0, reason: 'Canale per le regole' },
                        { name: 'annunci', type: 0, reason: 'Canale per gli annunci' },
                    ],
                },
                {
                    name: 'Generale',
                    channels: [
                        { name: 'chat-generale', type: 0, reason: 'Canale per discussioni generali' },
                        { name: 'media', type: 0, reason: 'Condivisione di media' },
                        { name: 'bot-commands', type: 0, reason: 'Comandi per i bot' },
                        { name: 'voice-chat', type: 2, reason: 'Chat vocale generale' },
                    ],
                },
                {
                    name: 'Giochi',
                    channels: [
                        { name: 'gaming-chat', type: 0, reason: 'Discussioni sui giochi' },
                        { name: 'gaming-voice', type: 2, reason: 'Chat vocale per i giochi' },
                    ],
                },
                {
                    name: 'Amministrazione',
                    channels: [
                        { name: 'admin-chat', type: 0, reason: 'Discussioni tra amministratori' },
                        { name: 'mod-log', type: 0, reason: 'Log delle attività di moderazione' },
                    ],
                },
            ];

            for (const categoryData of categories) {
                const category = await guild.channels.create({
                    name: categoryData.name,
                    type: 4, // GUILD_CATEGORY
                    reason: `Categoria ${categoryData.name}`,
                });

                for (const channelData of categoryData.channels) {
                    await guild.channels.create({
                        ...channelData,
                        parent: category.id,
                    });
                }
            }

            // Ruoli
            const roles = [
                { 
                    name: 'Admin', 
                    color: '#FF0000', 
                    permissions: [PermissionsBitField.Flags.Administrator], 
                    reason: 'Ruolo amministratore' 
                },
                { 
                    name: 'Mod', 
                    color: '#00FF00', 
                    permissions: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.KickMembers], 
                    reason: 'Ruolo moderatore' 
                },
                { 
                    name: 'Member', 
                    color: '#0000FF', 
                    reason: 'Ruolo membro' 
                },
                { 
                    name: 'Guest', 
                    color: '#808080', 
                    reason: 'Ruolo ospite' 
                },
            ];

            for (const roleData of roles) {
                await guild.roles.create(roleData);
            }

            await interaction.followUp('Server inizializzato con successo!');
        } catch (error) {
            console.error(error);
            await interaction.followUp('C\'è stato un errore durante l\'inizializzazione del server.');
        }
    },
};
