const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const db = require('../config/database');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu() && !interaction.isButton() && !interaction.isCommand()) return;

        // Récupérer la configuration depuis la base de données
        const config = db.prepare('SELECT * FROM config WHERE guildId = ?').get(interaction.guild.id);
        if (!config) {
            if (interaction.isCommand()) {
                await interaction.reply({ content: 'Le système de tickets n\'est pas configuré. Utilisez /ticketsetup pour le configurer.', ephemeral: true });
            }
            return;
        }

        // Gestion du menu déroulant pour créer un ticket
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_create') {
            const type = interaction.values[0]; // Récupérer la valeur sélectionnée (candidature_rp, candidature_staff, etc.)

            // Vérifier le nombre de tickets ouverts par l'utilisateur
            const userTickets = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE guildId = ? AND userId = ? AND status = ?')
                .get(interaction.guild.id, interaction.user.id, 'open').count;

            if (userTickets >= config.maxTickets) {
                return interaction.reply({ content: `Vous avez déjà atteint le nombre maximum de tickets ouverts (${config.maxTickets}).`, ephemeral: true });
            }

            // Vérifier que le bot a les permissions nécessaires pour créer un salon
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
                return interaction.reply({ content: 'Je n\'ai pas la permission de créer des salons. Veuillez vérifier mes permissions.', ephemeral: true });
            }

            // Créer le salon de ticket
            let ticketChannel;
            try {
                ticketChannel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}-${type.replace('_', '-')}`,
                    type: ChannelType.GuildText,
                    parent: config.categoryId || null,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        },
                        {
                            id: config.staffRoleId,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        },
                        {
                            id: client.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        },
                    ],
                });
            } catch (error) {
                console.error('Erreur lors de la création du salon de ticket :', error);
                return interaction.reply({ content: 'Une erreur est survenue lors de la création du salon de ticket.', ephemeral: true });
            }

            // Enregistrer le ticket dans la base de données
            const ticket = db.prepare('INSERT INTO tickets (guildId, userId, channelId, type, status) VALUES (?, ?, ?, ?, ?)')
                .run(interaction.guild.id, interaction.user.id, ticketChannel.id, type, 'open');

            // Créer l'embed pour le ticket
            const embed = new EmbedBuilder()
                .setTitle(`Ticket - ${type.replace('_', ' ').toUpperCase()}`)
                .setDescription(`Merci d'avoir ouvert un ticket ! Un membre du staff vous répondra bientôt.\n\n**Type de ticket** : ${type.replace('_', ' ').toUpperCase()}`)
                .setColor('#FFAA00');

            // Créer les boutons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket_close_${ticket.lastInsertRowid}`)
                        .setLabel('Fermer')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`ticket_lock_${ticket.lastInsertRowid}`)
                        .setLabel('Verrouiller')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`ticket_addmember_${ticket.lastInsertRowid}`)
                        .setLabel('Ajouter un membre')
                        .setStyle(ButtonStyle.Primary)
                );

            // Envoyer le message dans le salon de ticket
            try {
                await ticketChannel.send({ content: `<@&${config.staffRoleId}>`, embeds: [embed], components: [row] });
                await interaction.reply({ content: `Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message dans le salon de ticket :', error);
                await interaction.reply({ content: 'Une erreur est survenue lors de l\'envoi du message dans le salon de ticket.', ephemeral: true });
            }
        }

        // Gestion des boutons (fermer, verrouiller, ajouter un membre)
        if (interaction.isButton()) {
            const [action, ticketId] = interaction.customId.split('_').slice(1);

            const ticket = db.prepare('SELECT * FROM tickets WHERE ticketId = ?').get(ticketId);
            if (!ticket) {
                return interaction.reply({ content: 'Ticket introuvable.', ephemeral: true });
            }

            const ticketChannel = interaction.guild.channels.cache.get(ticket.channelId);
            if (!ticketChannel) {
                return interaction.reply({ content: 'Salon de ticket introuvable.', ephemeral: true });
            }

            if (action === 'close') {
                try {
                    await interaction.reply({ content: 'Le ticket sera fermé dans 5 secondes...', ephemeral: true });

                    setTimeout(async () => {
                        await ticketChannel.delete();

                        db.prepare('UPDATE tickets SET status = ? WHERE ticketId = ?').run('closed', ticketId);

                        const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
                        if (logChannel) {
                            const logEmbed = new EmbedBuilder()
                                .setTitle('Ticket Fermé')
                                .setDescription(`**Utilisateur** : <@${ticket.userId}>\n**Type** : ${ticket.type.replace('_', ' ').toUpperCase()}\n**Fermé par** : ${interaction.user}`)
                                .setColor('#FF0000');
                            await logChannel.send({ embeds: [logEmbed] });
                        }
                    }, 5000);
                } catch (error) {
                    console.error('Erreur lors de la fermeture du ticket :', error);
                    await interaction.followUp({ content: 'Une erreur est survenue lors de la fermeture du ticket.', ephemeral: true });
                }
            } else if (action === 'lock') {
                try {
                    await ticketChannel.permissionOverwrites.edit(ticket.userId, { SendMessages: false });
                    await interaction.reply({ content: 'Le ticket a été verrouillé.', ephemeral: true });
                } catch (error) {
                    console.error('Erreur lors du verrouillage du ticket :', error);
                    await interaction.reply({ content: 'Une erreur est survenue lors du verrouillage du ticket.', ephemeral: true });
                }
            } else if (action === 'addmember') {
                await interaction.reply({ content: 'Mentionnez l\'utilisateur à ajouter au ticket.', ephemeral: true });

                const filter = m => m.author.id === interaction.user.id && m.mentions.users.size > 0;
                const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });

                collector.on('collect', async m => {
                    const userToAdd = m.mentions.users.first();
                    try {
                        await ticketChannel.permissionOverwrites.edit(userToAdd.id, {
                            ViewChannel: true,
                            SendMessages: true,
                            ReadMessageHistory: true,
                        });
                        await interaction.followUp({ content: `${userToAdd} a été ajouté au ticket.`, ephemeral: true });
                    } catch (error) {
                        console.error('Erreur lors de l\'ajout d\'un membre au ticket :', error);
                        await interaction.followUp({ content: 'Une erreur est survenue lors de l\'ajout de l\'utilisateur au ticket.', ephemeral: true });
                    }
                });

                collector.on('end', collected => {
                    if (!collected.size) {
                        interaction.followUp({ content: 'Aucun utilisateur mentionné. Opération annulée.', ephemeral: true });
                    }
                });
            }
        }

        // Gestion des commandes slash
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Erreur lors de l\'exécution de la commande :', error);
                await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de la commande !', ephemeral: true });
            }
        }
    },
};