const Discord = require('discord.js')
const getStat = require('./lol')
DISCORD_TOKEN = process.env.DISCORD_TOKEN

const client = new Discord.Client();
const prefix = '+++'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {

  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const name = args.shift()
  getStat(name, (error, data) => {
    var msg = '\n'
    data.forEach(i => {
      msg+=`${i.startedAt} / ${i.mode} --- win: ${i.winState}, kda: ${i.kda}, duration ${i.duration}m \n`
    });
    return message.reply(msg)
  })

});

client.login(DISCORD_TOKEN);
