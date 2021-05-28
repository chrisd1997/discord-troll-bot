const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true,
});

const bot = new Discord.Client();

const users = [
    "328124330229628949",
    "256837269984378880",
];

const blocked = "256746397242621952";

bot.once('ready', () => {
    logger.info('Connected');
});

bot.login(auth.token);

bot.on('voiceStateUpdate', e => {
    const channels = e.guild.channels.cache.filter(c => c.type === 'voice');
    
    for (const [channelID, channel] of channels) {
        if (
            channel.members.some(member => member.id === blocked) &&
            channel.members.some(member => users.includes(member.id))
        ) {
            logger.info("Both blocked and user(s) are in channel!");

            const filteredChannels = channels.filter(c => c.id !== channelID);
            const randomChannel = filteredChannels.random().id;

            for (const [userID, member] of channel.members) {
                if (users.includes(userID)) {
                    member.voice.setChannel(randomChannel);
                }
            }
        }

        
    }
});