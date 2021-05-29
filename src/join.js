const Discord = require('discord.js');
const logger = require('winston');
const auth = require('../auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true,
});

const bot = new Discord.Client();

const users = [
    "328124330229628949",
    "256837269984378880",
    "256746397242621952",
];
const privateChannelID = "833008601027182612";

let lastSend = null;

bot.once('ready', () => {
    logger.info('Connected');
});

bot.login(auth.token);

bot.on('voiceStateUpdate', (_, e) => {
    if (
        e.channel.members.some(member => users.includes(member.id)) &&
        e.channel.id === privateChannelID
    ) {
        logger.info("Someone joined the channel!");

        const channelMembers = e.channel.members.map(member => member.user.id);
        const filteredUsers = users.filter(user => !channelMembers.includes(user));

        const ONE_HOUR = 60 * 60 * 1000;

        if (!lastSend || ((new Date) - lastSend) > ONE_HOUR) {
            lastSend = new Date().getTime();

            filteredUsers.forEach(user => {
                e.guild.members.fetch(user)
                    .then(user => {
                        user.send('kom server');
                    });
            });
        }   
    }
});