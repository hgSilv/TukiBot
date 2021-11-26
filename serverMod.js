require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');

const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

const commandPrefix = "!";

bot.once('ready', client => {
    console.log('================================= SERVER MOD =================================');
});

bot.on('messageCreate', msg => {
    if (msg.author.bot) return;

    const message = msg.content;

    if (message.startsWith(commandPrefix)){
        if (message == '!hiservermod') {
            return msg.reply('Hi! Im able to mod your server. TUKI');
        }
    }

});

//This has to be last line of the script
bot.login(process.env.BOT_TOKEN);