const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Connecté en tant que ${client.user.tag}`);

        // Déployer les commandes slash
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        const commands = [];
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        try {
            console.log('Déploiement des commandes slash...');
            await rest.put(
                Routes.applicationCommands('1354618089269887048'),
                { body: commands }
            );
            console.log('Commandes slash déployées avec succès !');
        } catch (error) {
            console.error('Erreur lors du déploiement des commandes :', error);
        }
    },
};