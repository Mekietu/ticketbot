const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../config/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketmanage')
        .setDescription('Gérer un ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand.setName('close')
                .setDescription('Fermer un ticket'))
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Ajouter un membre au ticket')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Utilisateur à ajouter')
                        .setRequired(true))),
    async execute(interaction, client) {
        const ticket = db.prepare('SELECT * FROM tickets WHERE channelId = ?').get(interaction.channel.id);
        if (!ticket) return interaction.reply({ content: 'Ce salon n\'est pas un ticket.', ephemeral: true });

        if (interaction.options.getSubcommand() === 'close') {
            await interaction.reply('Le ticket va être fermé dans 5 secondes...');

            // Créer une transcription
            const messages = await interaction.channel.messages.fetch();
            let transcript = `Transcription du ticket ${interaction.channel.name}\n\n`;
            messages.forEach(msg => {
                transcript += `[${msg.createdAt}] ${msg.author.tag}: ${msg.content}\n`;
            });

            // Envoyer la transcription dans le salon de logs
            const logChannelId = db.prepare('SELECT logChannelId FROM config WHERE guildId = ?').get(interaction.guild.id)?.logChannelId;
            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('Ticket fermé')
                        .setDescription(`**Utilisateur** : <@${ticket.userId}>\n**Type** : ${ticket.type}\n**Salon** : ${interaction.channel.name}`)
                        .setColor('#FF0000');
                    logChannel.send({ embeds: [logEmbed], files: [{ attachment: Buffer.from(transcript), name: `transcript-${interaction.channel.name}.txt` }] });
                }
            }

            // Mettre à jour le statut du ticket
            db.prepare('UPDATE tickets SET status = ? WHERE channelId = ?').run('closed', interaction.channel.id);

            setTimeout(() => interaction.channel.delete(), 5000);
        }

        if (interaction.options.getSubcommand() === 'add') {
            const user = interaction.options.getUser('user');
            const member = interaction.guild.members.cache.get(user.id);
            if (!member) return interaction.reply({ content: 'Utilisateur invalide.', ephemeral: true });

            await interaction.channel.permissionOverwrites.edit(member, { ViewChannel: true, SendMessages: true, ReadMessageHistory: true });
            await interaction.reply(`${member} a été ajouté au ticket.`);
        }
    },
};