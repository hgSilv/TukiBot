require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');

const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});


var bannedWords = [];


const lambdaGetEndpoint = 'https://hnumqbz3j6.execute-api.us-east-1.amazonaws.com/dev-v1/bannedwords-';
const commandPrefix = "!";



bot.once('ready', client => {
    console.log('================================= CHAT MOD =================================');
    //getBannedWords();
});


bot.on('messageCreate', async (msg) => {
    //console.log(msg);
    //ignore messages from bot
    if (msg.author.bot) return;

    await getBannedWords(msg.guildId);

    const message = msg.content.toLowerCase();

    // ===== command handler =====
    if (message.startsWith(commandPrefix)) {
        switch (true) {
            case message == '!helloworld': { // ===== hello world =====
                return msg.reply('hello to you! Tuki!! :)');
            }

            case message.startsWith("!addbannedword"): { // --- addBannedWord
                // remove command from the rest of the string
                const str = message.replace('!addbannedword ', '');
                const args = str.split(",").map(str => str.trim()); // args cleaned up (no spaces)

                await getBannedWords(msg.guildId);
                //add words
                bannedWords.push(...args);

                //remove duplicates
                bannedWords = bannedWords.filter((item, index) => (bannedWords.indexOf(item) == index));
                // console.log(msg.guildId);
                updateBannedWords(msg.guildId, bannedWords); //Updates servers banned word list on the dynamoDB table
                // console.log(bannedWords);

                return msg.reply(`updated banned words list:\n[${bannedWords.toString()}]`);
            }

            case message.startsWith('!deletebannedword'):
                deleteBannedWord(msg);
                return;

            case message.startsWith('!bannedwordslist'):
                await getBannedWords(msg.guildId);
                return msg.reply(`This is the banned words list:\n[${bannedWords.toString()}]`);

            case message == '!getaxios':
                axiosHTTPRequest();
                // --- deleteBannedWords : !deleteBannedWord <will delete the banned word from banned word list>
                return;
            default:
                console.log("ChatMod: command doesn't existe");
                break;
                // return msg.reply('Tuki-sorry! This command does not exist. <:sad_frog:900930416075243550>');
        };
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

async function getBannedWords(serverID) {
    try {
        let response = await axios({
            method: 'get',
            url: lambdaGetEndpoint + '/' + serverID,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        bannedWords = response.data.Item.bannedWords.SS;

    } catch (error) {
        console.log(error);
    }

}

function updateBannedWords(serverID, bannedWords) {
    axios({
            method: 'put',
            url: lambdaGetEndpoint + '/' + serverID,
            headers: {
                'Content-Type': 'application/json'
            },
            data: bannedWords
        })
        .then(function (response) {
            // console.log(response.data);
            bannedWords = response.data.Item.bannedWords.SS;
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            console.log("updated bannedwordslist");
        });
}

function deleteBannedWord(msg) {
    axios({
            method: 'get',
            url: lambdaGetEndpoint + '/' + msg.guildId,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            //   console.log(response);
            bannedWords = response.data.Item.bannedWords.SS;

            let word = msg.content.replace('!deletebannedwords ', '');
            console.log("word to remove " + word);

            bannedWords.splice(bannedWords.indexOf(word), 1);

            updateBannedWords(msg.guildId, bannedWords);
            console.log(bannedWords);
            return msg.reply(`updated banned words list: [${bannedWords.toString()}]`);
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            console.log("Got server's banned word list");
        });


}


//This has to be last line of the script
bot.login(process.env.BOT_TOKEN);