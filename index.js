// dotenv
const dotenv = require('dotenv');
dotenv.config();

// discord.js
const { Client, Events, GatewayIntentBits, ActivityType, ChannelType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ReadyEvent
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
    c.user.setPresence({ activities: [{
        name: '한국 운영체제 개발 협회',
        state: "Korea Operating System Development Research Institute",
        url: "https://discord.gg/SntF4Px9BZ",
        type: ActivityType.Watching
    }], status: 'dnd' });
});

// ThreadCreate Event => indexing
client.on(Events.ThreadCreate, async thread => {
    if (thread.parentId==="1172590526864834580") {
        
    }
});

client.login(process.env.TOKEN);