const { Client, IntentsBitField, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env

// Vérifier que le token est bien défini
if (!process.env.DISCORD_TOKEN) {
    console.error('Erreur : Le token Discord n\'est pas défini dans le fichier .env. Ajoute une ligne DISCORD_TOKEN=ton_token dans le fichier .env.');
    process.exit(1); // Arrêter le programme si le token est manquant
}

// Créer le client Discord avec les intents nécessaires
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers,
    ],
});

// Collection pour stocker les commandes
client.commands = new Collection();

// Charger les commandes
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`Commande chargée : ${command.data.name}`);
}

// Charger les événements
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`Événement chargé : ${event.name}`);
}

// Connexion du bot
client.login(process.env.DISCORD_TOKEN);