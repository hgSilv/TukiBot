require('dotenv').config();
const discord = require('discord.js');
const bot = new discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES']
});

bot.once('ready', client => {
    console.log('================================= AUTO-POSTING =================================');
})

bot.on('messageCreate', msg => {
    //ignore messages from bot
    if (msg.author.bot) return;

    console.log('received a message');
    
})

bot.login(process.env.BOT_TOKEN);