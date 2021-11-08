require('dotenv').config()
const axios = require('axios');
const Discord = require('discord.js');

const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

let reminders = [];
let joke;

const firebaseJokesUrl = 'https://us-central1-tukibot-proyecto-cloud-331101.cloudfunctions.net/getRandomJoke';
const firebaseRemindersUrl = 'https://us-central1-tukibot-proyecto-cloud-331101.cloudfunctions.net/getReminders';
const commandPrefix = "!";


// const channel = await bot.channels.get('897207800831307796');

bot.once('ready', client => {
    console.log('================================= AUTO-POSTING =================================');
    // client.channels.cache.get('897207800831307796').send('TUKI BOT ready! :)'); //send message to "test" channel
    // getReminders();
});


bot.on('messageCreate', msg => {
    console.log(msg);
    //ignore messages from bot
    if (msg.author.bot) return;

    const message = msg.content.toLowerCase();

    // ===== command handler =====
    if (message.startsWith(commandPrefix)) {
        // ===== get random joke =====
        if (message == '!getjoke') {
            sendRandomJoke(msg);
            return;
        }

       return msg.reply('Tuki-sorry! This command does not exist. <:sad_frog:900930416075243550>');

    }


});

function sendRandomJoke(msg) {
    axios.post(firebaseJokesUrl)
        .then((response) => {
            joke = response.data;

            let reply = (joke.text != '' && joke.imageUrl != '') ?
                `${joke.text}\n${joke.imageUrl}` :
                joke.text + joke.imageUrl;
                
            return bot.channels.cache.get(msg.channelId).send('Tuki-hello! This is a random joke. <:just_a_froggo:907077167253450764>\n' + reply);
        })
        .catch((error) => {
            console.log(error);
        })
        .then(function () {
            console.log("Success: POST request to " + firebaseJokesUrl);
        });
}

function getReminders() {
    axios.post(firebaseRemindersUrl)
        .then((response) => {
            reminders = response.data;
            console.log(reminders);
        })
        .catch((error) => {
            console.log(error);
        })
        .then(function () {
            console.log("Success: POST request to " + firebaseJokesUrl);
        });
}

//This has to be last line of the script
bot.login(process.env.BOT_TOKEN);