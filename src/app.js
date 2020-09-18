const Discord = require('discord.js')
const getStat = require('./league_async')
const generateImage = require('./templating')
DISCORD_TOKEN = process.env.DISCORD_TOKEN

const client = new Discord.Client();
const prefix = '+++'
const friendList = ['Gripp03', 'Gripp04', 'Villentretermert', 'Attomorphlin' ]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const getAvgs = (array) => {
  var avgKda = 0
  var winRate = 0
  array.forEach(i => {
    if (isNaN(i.kda)) i.kda = 0
    avgKda+=parseFloat(i.kda)
    winRate+=i.winState
  })
  return [ (avgKda/=array.length).toFixed(1) , (winRate/=array.length) * 100 ]
}


client.on('message', async (message) => {

  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const name = args.shift()
  const friendListFiltered = friendList.filter((requested) => requested!=name)


  try {
    const stats = await getStat(name)
    const [avgKda, winRate] = getAvgs(stats)
    await generateImage(stats, name, avgKda, winRate)
    message.reply("here is stat", { files: ['image.png']})
  } catch (e) {
    message.reply("something went wrong with checking " + name + "\n" + e)
  }
   
});

client.login(DISCORD_TOKEN);

