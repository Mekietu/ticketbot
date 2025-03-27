const Database = require('better-sqlite3');
const db = new Database('tickets.db', { verbose: console.log });

// Créer les tables si elles n'existent pas
db.exec(`
    CREATE TABLE IF NOT EXISTS config (
        guildId TEXT PRIMARY KEY,
        ticketChannelId TEXT,
        logChannelId TEXT,
        staffRoleId TEXT,
        categoryId TEXT,
        maxTickets INTEGER DEFAULT 3
    );

    CREATE TABLE IF NOT EXISTS tickets (
        ticketId INTEGER PRIMARY KEY AUTOINCREMENT,
        guildId TEXT,
        userId TEXT,
        channelId TEXT,
        type TEXT,
        status TEXT DEFAULT 'open'
    );
`);

module.exports = db;
