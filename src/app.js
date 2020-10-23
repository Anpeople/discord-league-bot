const Discord = require('discord.js')
const getStat = require('./leagueAsync')
const generateImage = require('./createTemplate')
DISCORD_TOKEN = process.env.DISCORD_TOKEN

const client = new Discord.Client();
const prefix = '+++'
const friendList = ['Gripp04', 'Villentretermert', 'Attomorphlin', 'StariBukaka' ]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const getAvgs = (array) => {
  var avgKda = 0
  var winRate = 0
  var avgRatFactor = 0
  var avgDamage = 0
  array.forEach(i => {
    if (isNaN(i.kda)) i.kda = 0
    avgKda+=parseFloat(i.kda)
    avgRatFactor+=parseFloat(i.ratFactor)
    avgDamage+=parseFloat(i.totalDamageDealt)
    winRate+=i.winState
  })
  return [ (avgKda/=array.length).toFixed(1) , (winRate/=array.length) * 100, (avgRatFactor/=array.length).toFixed(0), (avgDamage/=array.length).toFixed(0) ]
}


client.on('message', async (message) => {

  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const name = args.shift()
  const friendListFiltered = friendList.filter((requested) => requested!=name)


  try {
    const [stats, lastGame] = await getStat(name, friendListFiltered)
    const [avgKda, winRate, avgRatFactor, avgDamage] = getAvgs(stats)
    console.log(lastGame)
    await generateImage(stats, name, avgKda, winRate, avgRatFactor, avgDamage, lastGame)
    message.reply("here is stat", { files: ['image.png'] })
  } catch (e) {
    message.reply("something went wrong with checking " + name + "\n" + e)
  }
   
});

client.login(DISCORD_TOKEN);

