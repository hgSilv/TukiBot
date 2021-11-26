require('dotenv').config()
const axios = require('axios');
const Discord = require('discord.js');

const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});


var bannedWords = [
    
];


const lambdaGetEndpoint = 'https://hnumqbz3j6.execute-api.us-east-1.amazonaws.com/dev-v1/bannedwords-';
const commandPrefix = "!";



bot.once('ready', client => {
    console.log('================================= CHAT MOD =================================');
    //getBannedWords();
});


bot.on('messageCreate', msg => {
    //console.log(msg);
    //ignore messages from bot
    if (msg.author.bot) return;

    getBannedWords(msg.guildId);

    const message = msg.content;

    // ===== command handler =====
    if (message.startsWith(commandPrefix)) {
        // ===== hello world =====
        if (message == '!helloworld') {
            return msg.reply('hello to you! :)');
        }

        // --- addBannedWord
        if (message.startsWith("!addbannedword")) {
            // extract command from the rest of the string
            const match = message.toLowerCase().match(/^(![\w\-]+) (.+)/i);
            const command = {
                command: match[1], //first word (command)
                args: match[2].split(",").map(str => str.trim()) // args cleaned up (no spaces)
            };
            getBannedWords(msg.guildId);
            //add words
            bannedWords.push(...command.args);

            //remove duplicates
            bannedWords = bannedWords.filter((item, index) => (bannedWords.indexOf(item) == index));
            console.log(msg.guildId);
            updateBannedWords(msg.guildId, bannedWords); //Updates servers banned word list on the dynamoDB table
            console.log(bannedWords);
            return msg.reply(`updated banned words list:\n[${bannedWords.toString()}]`);
        }
        
        else if (message.startsWith('!deletebannedword')){
            //TODO: Implement delete word 

            const match = message.toLowerCase().match(/^(![\w\-]+) (.+)/i);
            const command = {
                command: match[1], //first word (command)
                args: match[2].split(",").map(str => str.trim()) // args cleaned up (no spaces)
            };
            getBannedWords(msg.guildId);
            // delete word
            let removed = bannedWords.pop(...command.args);
            console.log(removed);

            updateBannedWords(msg.guildId, bannedWords);
            console.log(bannedWords);
            return msg.reply(`updated banned words list:\n[${bannedWords.toString()}]`);

        }

        else if (message.startsWith('!bannedwordslist')){
            getBannedWords(msg.guildId);
            return msg.reply(`This is the banned words list:\n[${bannedWords.toString()}]`);
        }
        
        else if (message.toLocaleLowerCase() == "!getaxios") {
            axiosHTTPRequest();

            // --- deleteBannedWords : !deleteBannedWord <will delete the banned word from banned word list>
        } 
        
        else if (message.startsWith('!getJoke')) {
            //Do nothing
        }
        
        
        else {
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
    axios.get(lambdaGetEndpoint)
        .then(function (response) { // handle success
            console.log(response.data);
        })
        .catch(function (error) { // handle error
            console.log(error);
        })
        .then(function () { // always executed
            console.log('end of request');
        });
}

function getBannedWords(serverID) {
    axios({
        method: 'get',
        url: lambdaGetEndpoint + '/' + serverID,
        headers: {'Content-Type': 'application/json'}
    })
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