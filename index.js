// dotenv
const dotenv = require('dotenv');
dotenv.config();

// discord.js
const { Client, Events, GatewayIntentBits, ActivityType, UserManager } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// sqlite
const sqlite3 = require('sqlite3').verbose();
let db;

// config.json
const { forumChannel } = require('./config.json');

// ReadyEvent
client.once(Events.ClientReady, c => {
	console.log(`[Discord] Login Success! ${c.user.tag}`);
    c.user.setPresence({ activities: [{
        name: '한국 운영체제 개발 협회',
        state: "Korea Operating System Development Research Institute",
        url: "https://discord.gg/SntF4Px9BZ",
        type: ActivityType.Watching
    }], status: 'dnd' });

    db = new sqlite3.Database('./forumDB.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('[SQLite] Connect Success!');
    })
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('[SQLite] Close Success!');
        }
    });
});

// ThreadCreate Event => indexing
client.on(Events.ThreadCreate, async thread => {
    if (thread.parentId===forumChannel) {
        console.log("[LOG] Post Thread in Discord");
        console.log("[LOG] Try to index post info");
        console.log("[LOG] Check the user exist in DB");
        let createUser = true;
        db = new sqlite3.Database('./forumDB.db', (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('[SQLite] Connect Success!');
        });
        db.all(`SELECT id FROM user WHERE id = ${thread.ownerId}`, 
        (error, row) => {
            if (row.length) {
                console.log("[LOG] Exist!");
                createUser=false;
            } else {
                console.log("[LOG] Not Exist!");
            }
        });
        if(createUser){
            console.log(thread.ownerId);
            //db.all(`INSERT INTO user(id, name, tos, register, profile_pic) VALUES (${thread.ownerId},"${UserManager.resolve(thread.ownerId).tag.split('#')[0]}",1,date(),"${thread.ownerId.avatar}")`, 
            //(error, row) => {
            //    console.log(row)
            //});
        }
    }
});

client.login(process.env.TOKEN);