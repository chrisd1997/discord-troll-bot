const Discord = require('discord.js');
const logger = require('winston');
const moment = require('moment');
const auth = require('../auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true,
});

const SERVER_ID = "831180398507327508";
const CHANNEL_ID = "923586623592095784";
let users = [
    {
        id: "328124330229628949",
        name: "Chris",
    },
    {
        id: "256837269984378880",
        name: "Kevin",
    },
    {
        id: "256746397242621952",
        name: "Tom",
    },
];
let timeDB = [
    {
        id: "328124330229628949",
        start: null,
        status: null,
    },
    {
        id: "256837269984378880",
        start: null,
        status: null,
    },
    {
        id: "256746397242621952",
        start: null,
        status: null,
    }
];

const bot = new Discord.Client();

bot.login(auth.token);

bot.once('ready', () => {
    logger.info('Connected');

    (async () => {
        const guild = await bot.guilds.fetch(SERVER_ID);

        users = users.map((user) => {
            const member = guild.member(user.id);

            return {
                id: user.id,
                name: member.displayName,
            };
        });
    })();

    // bot.user.setActivity("this shitty team", {
    //     type: "WATCHING",
    //     url: "https://www.youtube.com/watch?v=gkTb9GP9lVI",
    // });
});

bot.on('presenceUpdate', (oldMember, newMember) => {
    const user = users.find((user) => user.id === oldMember.userID);

    if (
        user &&
        (
            oldMember.status === 'offline' ||
            oldMember.status === 'online'
        ) &&
        (
            newMember.status === 'offline' ||
            newMember.status === 'online'
        )
    ) {
        const oldTime = timeDB.find((time) => time.id === oldMember.userID);

        if (oldTime.status !== null) {
            // logger.info("-------------");
            // logger.info(`USER: ${user.name}`);
            // logger.info(`TIME START: ${moment.unix(oldTime.start).format('DD-MM-YYYY H:mm:s')}`);
            // logger.info(`TIME NOW: ${moment().format('DD-MM-YYYY H:mm:s')}`);
            // logger.info(`ELAPSED: ${moment(oldTime.start).from(moment().unix(), true)}`);
            // logger.info(`NEW STATUS: ${newMember.status}`);
            // logger.info("-------------");

            const message = `-------------\nUSER: ${user.name}\nTIME START: ${moment.unix(oldTime.start).format('DD-MM-YYYY H:mm:s')}\nTIME NOW: ${moment().format('DD-MM-YYYY H:mm:s')}\nELAPSED: ${moment(oldTime.start).from(moment().unix(), true)}\nNEW STATUS: ${newMember.status}\n-------------`;
       
            (async () => {
                const channel = await bot.channels.fetch(CHANNEL_ID);
                channel.send(message);
            })();
        }

        timeDB = timeDB.map((time) => 
            time.id === oldMember.userID
                ? { ...time, start: moment().unix(), status: newMember.status }
                : time
        );
    }
});