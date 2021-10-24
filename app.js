require('dotenv').config()
const axios = require('axios');
const Discord = require('discord.js');

const bot = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"]
});


let bannedWords = [
  "hola", "adios"
];
const lambdaGetEndpoint = 'https://ij705at6b0.execute-api.us-east-1.amazonaws.com/getServerWordList';
const commandPrefix = "!";

// const channel = await bot.channels.get('897207800831307796');

bot.once('ready', client => {
  console.log('================================= TUKI BOT =================================');
  console.log(client);
  // client.channels.cache.get('897207800831307796').send('TUKI BOT ready! :)'); //send message to "test" channel
});


bot.on('messageCreate', msg => {
  console.log(msg);
  //ignore messages from bot
  if (msg.author.bot) return;

  const message = msg.content;

  // ===== command handler =====
  if (message.startsWith(commandPrefix)) {
    // ===== hello world =====
    if (message == '!helloworld') {
      return msg.reply('hello to you! :)');
    }

    // --- addBannedWords
    if (message.startsWith("!addbannedwords")) {
      // extract command from the rest of the string
      const match = message.toLowerCase().match(/^(![\w\-]+) (.+)/i);
      const command = {
        command: match[1], //first word (command)
        args: match[2].split(",").map(str => str.trim()) // args cleaned up (no spaces)
      };

      //add words
      bannedWords.push(...command.args);

      //remove duplicates
      bannedWords = bannedWords.filter((item, index) => (bannedWords.indexOf(item) == index));

      console.log(bannedWords);
      return msg.reply(`updated banned words list:\n[${bannedWords.toString()}]`);
    } else if (message.toLocaleLowerCase() == "!getaxios") {
      axiosHTTPRequest();
    } else {
      return msg.reply('Tuki-sorry! This command does not exist. <:sad_frog:900930416075243550>');
    }
  }

  // ===== banned words handler =====
  const found = bannedWords.findIndex(str => message.toLowerCase().includes(str));

  if (found != -1) {
    console.log(msg);
    return msg.reply('banned word detected in message: ' + bannedWords[found]);
  }
});

function axiosHTTPRequest() {
  // Make a request for a user with a given ID
  axios.get(lambdaGetEndpoint)
    .then(function (response) {  // handle success
      console.log(response);
    })
    .catch(function (error) { // handle error
      console.log(error);
    })
    .then(function () { // always executed
      console.log('end of request');
    });
}

//This has to be last line of the script
bot.login(process.env.BOT_TOKEN);