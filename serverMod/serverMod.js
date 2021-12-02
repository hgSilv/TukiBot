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
    // console.log(msg);
    if (msg.author.bot) return;

    const message = msg.content.toLowerCase();

    if (message.startsWith(commandPrefix)) {
        if (message == '!hiservermod') {
            return msg.reply('Tuki-hi! Im able to mod your server. TUKI <:just_a_froggo:907077167253450764>');
        }
        if (!message.startsWith('!mute') &&
            !message.startsWith('!unmute') &&
            !message.startsWith('!warn') &&
            !message.startsWith('!ban '))
            return;

        // check permissions
        const senderRoles = msg.member.roles.cache.map(role => role.name);
        if (!senderRoles.includes('Devs'))
            return msg.reply("Tuki-forbidden! <:frog_with_gun:914704409739546694> You don't have permissions to execute this command.");

        let args = message.split(' ');
        if (args.length != 2)
            return msg.reply('Tuki-sorry! INVALID SYNTAX <:sad_frog:900930416075243550>');

        const memberId = args[1].replace('<@!', '').replace('>', '');
        const receiver = msg.guild.members.cache.get(memberId);
        if (receiver == undefined)
            return msg.reply("Tuki-sorry! Couldn't find member <:sad_frog:900930416075243550>");

        const receiverRoles = receiver.roles.cache.map(role => role.name);
        // console.log(receiverRoles);
        if (receiverRoles.includes('Devs'))
            return msg.reply("Tuki-forbidden! <:frog_with_gun:914704409739546694> You can't execute this command on them.");

        switch (true) {
            case message.startsWith('!mute'):
                try {
                    receiver.voice.setMute(true);
                } catch (err) {
                    console.log(err);
                }
                break;

            case message.startsWith('!unmute'):
                try {
                    receiver.voice.setMute(false);
                } catch (err) {
                    console.log(err);
                }
                break;

            case message.startsWith('!warn'):
                msg.reply(`Tuki-warn! <:angry_frog:914723036916240414> Lower the eggs, <@!${memberId}>.`);
                return msg.author.send(`You warned <@!${memberId}> <:just_a_froggo:907077167253450764>`);

            case message.startsWith('!ban'): {
                try {
                    receiver.ban();
                } catch (err) {
                    console.log(err);
                }
                break;
            }

            default:
                console.log("ServerMod: command doesn't exist");
                break;
                // return msg.reply('Tuki-sorry! This command does not exist. <:sad_frog:900930416075243550>');
        }

    }

});

//This has to be last line of the script
bot.login(process.env.BOT_TOKEN);