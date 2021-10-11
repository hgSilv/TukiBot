require('dotenv').config()

const Discord = require('discord.js');

const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });


bot.once('ready', () => {
    console.log('TUKI');
    console.log(bot);
});


//This has to be last line of the script
bot.login(process.env.BOT_TOKEN);