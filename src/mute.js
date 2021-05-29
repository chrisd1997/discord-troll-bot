const Discord = require('discord.js');
const logger = require('winston');
const auth = require('../auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true,
});

const bot = new Discord.Client();

const whiteListed = "328124330229628949";
const botID = "847889383301447741";

bot.once('ready', () => {
    logger.info('Connected');
});

bot.login(auth.token);

bot.on('voiceStateUpdate', (_, e) => {
    if (! e.channel.members.array().some(m => m.id === botID)) {
        e.channel.join()
        .then(d => {
            d.on('speaking', (member, speaking) => {
                if (member.id === whiteListed && speaking.bitfield) {
                    for (const [userID, user] of e.channel.members) {
                        if (userID !== whiteListed) {
                            user.voice.setMute(true);
                        }
                    }
                }

                if (member.id === whiteListed && !speaking.bitfield) {
                    setTimeout(() => {
                        for (const [userID, user] of e.channel.members) {
                            if (userID !== whiteListed) {
                                user.voice.setMute(false);
                            }
                        }
                    }, 200);
                }
            })
        });
    }
});