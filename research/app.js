const Discord = require('discord.js')
const getStat = require('./lol_promise')
const generateImage = require('../src/templating')
const test = require('./test')
DISCORD_TOKEN = process.env.DISCORD_TOKEN

const client = new Discord.Client();
const prefix = '+++'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const getAvgs = (array) => {
  var avgKda = 0
    var winRate = 0
    array.forEach(i => {
      avgKda+=parseFloat(i.kda)
      winRate+=i.winState
    })
  return [ (avgKda/=array.length).toFixed(1) , winRate/=array.length * 100 ]
}


client.on('message', message => {

  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const name = args.shift()
  
  getStat(name)
  .then(data => {
    [avgKda, winRate] = getAvgs(data)
    generateImage(data, name, avgKda, winRate)
  })
  .then(() => message.reply("here is stat", { files: ['image.png']}))
  .catch(error => message.reply("something went wrong with checking " + name + "\n" + error)) 
});

client.login(DISCORD_TOKEN);

