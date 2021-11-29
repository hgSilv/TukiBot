require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');
const schedule = require('node-schedule');

const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

let reminders = [];

const firebaseGetRemindersUrl = 'https://us-central1-tukibot-proyecto-cloud-331101.cloudfunctions.net/getReminders';
const firebaseNewReminderUrl = 'https://us-central1-tukibot-proyecto-cloud-331101.cloudfunctions.net/newReminder';
const firebaseDeleteReminderUrl = 'https://us-central1-tukibot-proyecto-cloud-331101.cloudfunctions.net/deleteReminder?doc=';
const commandPrefix = "!";


// const channel = await bot.channels.get('897207800831307796');

bot.once('ready', async (client) => {
    console.log('================================= REMINDERS =================================');
    // client.channels.cache.get('897207800831307796').send('TUKI BOT ready! :)'); //send message to "test" channel
    // client.channels.cache.find(c => c.name === "channel");
    await getReminders();
    reminders.forEach(r => scheduleReminder(client, r));
});


bot.on('messageCreate', async (msg) => {
    //ignore messages from bot
    if (msg.author.bot) return;

    // console.log(msg);
    const message = msg.content;

    // ===== command handler =====
    if (message.startsWith(commandPrefix)) {
        switch (true) {
            case message.toLowerCase() == '!newreminder --help':
                return msg.reply('Tuki-info! <:frog:914681652347813929> The syntax for this command is:\n!newReminder [channel] YYYY/MM/DD HH:mm [reminder]');

            case message.toLowerCase().startsWith('!newreminder'):
                const arr = message.split(" ");
                const args = arr.slice(0, 4).concat(arr.slice(4).join(" "));
                // console.log(args);

                const channel = msg.guild.channels.cache.find(c => c.name === args[1]);

                let date = new Date();
                date.setUTCFullYear(args[2].substring(0, 4));
                date.setMonth(Number(args[2].substring(5, 7)) - 1);
                date.setDate(args[2].substring(8, 10));
                date.setHours(args[3].substring(0, 2));
                date.setMinutes(args[3].substring(3, 5));
                date.setSeconds(0);

                // console.log(`${date}`);

                if (channel == undefined || date == 'Invalid Date')
                    return msg.reply('Tuki-sorry! INVALID SYNTAX <:sad_frog:900930416075243550> The syntax for this command is:\n!newReminder [channel] YYYY/MM/DD HH:mm [reminder]');

                await newReminder(msg, args[4], date, channel.id);
                break;
            
            default:
                console.log("Reminders: command doesn't exist");
                break;
                // return msg.reply('Tuki-sorry! This command does not exist. <:sad_frog:900930416075243550>');
        }
    }


});

async function getReminders() {
    try {
        let response = await axios.post(firebaseGetRemindersUrl);
        reminders = response.data.map(e => {
            return {
                id: e.id,
                date: new Date(e.data.date._seconds * 1000),
                description: e.data.description,
                channelID: e.data.channel
            }
        });
        console.log(reminders);
    } catch (error) {
        console.log(error);
    }
}

async function newReminder(msg, description, date, channelID) {

    try {
        let response = await axios.post(firebaseNewReminderUrl, {
            description: description,
            timestamp: date.getTime(),
            channel: channelID
        })

        console.log(response.data);
        scheduleReminder(msg.guild, {
            id: response.data.id,
            date: date,
            channelID: channelID,
            description: description
        });

        msg.reply('Tuki-success! Reminder created and scheduled! <:loving_frog:914395783279808533>');
        return;
    } catch (err) {
        console.log(err);
    }
}

function scheduleReminder(client, reminder) {
    console.log('enter new job');
    const job = schedule.scheduleJob(reminder.date, () => {
        client.channels.cache.get(reminder.channelID).send('Tuki-reminder! <:just_a_froggo:907077167253450764>\n----------\n' + reminder.description);
        deleteReminder(reminder.id);
    });
    // console.log(job);
}

async function deleteReminder(docId) {
    try {
        await axios.post(firebaseDeleteReminderUrl + docId);
        console.log("Reminder deleted: " + docId);
    } catch (err) {
        console.log(err);
    }

    console.log("Success: POST request to " + (firebaseDeleteReminderUrl + docId));
}

//This has to be last line of the script
bot.login(process.env.BOT_TOKEN);