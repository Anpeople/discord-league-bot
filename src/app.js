const Discord = require('discord.js')
const getStat = require('./lol_promise')
const generateImage = require('./templating')
const test = require('../research/test')
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
  var msg = '\n'
  if (name!='test') { 
    getStat(name)
    .then(data => {
      var avgKda = 0
      var winRate = 0
      data.forEach(i => {
        avgKda+=parseFloat(i.kda)
        winRate+=i.winState
        msg+="```" + i.startedAt + " | " + i.duration + "m | [" + i.mode + "] " + (i.winState === false ? "[LOSE]" : "[WIN]") + " kda: " + i.kda + ", champ: " + i.champion + "```"
      })
      avgKda/=data.length
      winRate/=data.length
      msg+="`avg KDA: " + avgKda.toFixed(1) + "` `win rate: " + winRate*100 + "%`"
      console.log('Current directory: ' + process.cwd());
      generateImage(data, name, avgKda.toFixed(1), winRate*100)
      .then(() => message.reply("Here is stat", { files: ['image.png']}))
      .catch((e) => console.log(e))
      // return message.reply(msg)
    }).catch(error => message.reply("something went wrong with checking " + name + "\n" + error)) 
  } else {
    var avgKda = 0
    var winRate = 0
    test.forEach(i => {
      avgKda+=parseFloat(i.kda)
      winRate+=i.winState
      msg+="```" + i.startedAt + " | [" + i.mode + "] " + (i.winState === false ? "[LOSE]" : "[WIN]") + " kda: " + i.kda + ", champ: " + i.champion + ", duration "+ i.duration + "m ```"
    })
    avgKda/=test.length
    winRate/=test.length
    msg+="`avg KDA: " + avgKda.toFixed(1) + "` `win rate: " + winRate*100 + "%`"
    return message.reply(msg)
  }
});

client.login(DISCORD_TOKEN);

