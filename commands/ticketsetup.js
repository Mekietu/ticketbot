const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../config/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketsetup')
        .setDescription('Configurer le système de tickets')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Le salon où envoyer le message de ticket')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('logchannel')
                .setDescription('Le salon où envoyer les logs des tickets')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('staffrole')
                .setDescription('Le rôle du staff qui aura accès aux tickets')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('La catégorie où les tickets seront créés'))
        .addIntegerOption(option =>
            option.setName('maxtickets')
                .setDescription('Nombre maximum de tickets par utilisateur')
                .setMinValue(1)
                .setMaxValue(10))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const logChannel = interaction.options.getChannel('logchannel');
        const staffRole = interaction.options.getRole('staffrole');
        const category = interaction.options.getChannel('category') || null;
        const maxTickets = interaction.options.getInteger('maxtickets') || 3;

        // Vérifier que le bot a les permissions nécessaires dans les salons
        if (!channel.permissionsFor(interaction.guild.members.me).has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])) {
            return interaction.reply({ content: 'Je n\'ai pas les permissions nécessaires pour envoyer des messages dans le salon spécifié.', ephemeral: true });
        }
        if (!logChannel.permissionsFor(interaction.guild.members.me).has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])) {
            return interaction.reply({ content: 'Je n\'ai pas les permissions nécessaires pour envoyer des messages dans le salon de logs.', ephemeral: true });
        }

        // Enregistrer la configuration dans la base de données
        db.prepare('INSERT OR REPLACE INTO config (guildId, ticketChannelId, logChannelId, staffRoleId, categoryId, maxTickets) VALUES (?, ?, ?, ?, ?, ?)')
            .run(interaction.guild.id, channel.id, logChannel.id, staffRole.id, category ? category.id : null, maxTickets);

        // Créer le menu déroulant avec les options personnalisées
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_create')
            .setPlaceholder('Sélectionnez une option...')
            .addOptions([
                new StringSelectMenuOptionBuilder()
                    .setLabel('Candidature RP')
                    .setValue('candidature_rp')
                    .setDescription('Postez votre candidature RP dès-maintenant...')
                    .setEmoji('📜'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Candidature Staff')
                    .setValue('candidature_staff')
                    .setDescription('Postez votre candidature Staff dès-maintenant...')
                    .setEmoji('📋'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Plainte Staff')
                    .setValue('plainte_staff')
                    .setDescription('Signalez un problème avec le staff...')
                    .setEmoji('📢'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Bug IG')
                    .setValue('bug_ig')
                    .setDescription('Signalez un bug critique en jeu...')
                    .setEmoji('⚙️'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Boutique')
                    .setValue('boutique')
                    .setDescription('Problème ou question sur la boutique...')
                    .setEmoji('💰'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Collaborations')
                    .setValue('collaborations')
                    .setDescription('Notre projet vous intéresse...')
                    .setEmoji('⭐'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Autre(s)')
                    .setValue('autre')
                    .setDescription('Pour toutes autres questions...')
                    .setEmoji('🎫'),
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Créer l'embed
        const embed = new EmbedBuilder()
            .setTitle('🎫 Système de Tickets')
            .setDescription('Sélectionnez une option ci-dessous pour ouvrir un ticket.')
            .setColor('#00FF00');

        // Envoyer le message dans le salon spécifié
        try {
            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: 'Système de tickets configuré avec succès !', ephemeral: true });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message de ticket :', error);
            await interaction.reply({ content: 'Une erreur est survenue lors de la configuration du système de tickets.', ephemeral: true });
        }
    },
};