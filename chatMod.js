require('dotenv').config()
const axios = require('axios');
const Discord = require('discord.js');

const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});


var bannedWords = [
    "hola", "adios"
];


const lambdaGetEndpoint = 'https://hnumqbz3j6.execute-api.us-east-1.amazonaws.com/dev-v1/bannedwords-';
const commandPrefix = "!";


// const channel = await bot.channels.get('897207800831307796');

bot.once('ready', client => {
    console.log('================================= CHAT MOD =================================');
    //console.log(client);
    // client.channels.cache.get('897207800831307796').send('TUKI BOT ready! :)'); //send message to "test" channel
    getBannedWords();
});


bot.on('messageCreate', msg => {
    //console.log(msg);
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
            console.log(msg.guildId);
            updateBannedWords(msg.guildId, bannedWords); //Updates servers banned word list on the dynamoDB table
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
        //console.log(msg);
        return msg.reply('banned word detected in message: ' + bannedWords[found]);
    }
});

function axiosHTTPRequest() {
    // Make a request for a user with a given ID
    axios({
        method: 'get',
        url: lambdaGetEndpoint
    })
        .then(function (response) { // handle success
            console.log(response.data.body);
        })
        .catch(function (error) { // handle error
            console.log(error);
        })
        .then(function () { // always executed
            console.log('end of request');
        });
}

function getBannedWords() {
    axios.get(lambdaGetEndpoint)
        .then(function (response) {
            //   console.log(response);
            bannedWords = response.data.Item.bannedWords.SS;
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            console.log("Got server's banned word list");
        });
}

function updateBannedWords(serverID, bannedWords) {
    axios({
        method: 'put',
        url: lambdaGetEndpoint + '/' + serverID,
        headers: {'Content-Type': 'application/json'},
        data: bannedWords
    })
        .then(function (response) {
               console.log(response.data);
            //bannedWords = response.data.Item.bannedWords.SS;
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            console.log("updated bannedwordslist");
        });
}


//This has to be last line of the script
bot.login(process.env.BOT_TOKEN);