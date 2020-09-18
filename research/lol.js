const request = require('postman-request')
const moment = require('moment')

LOL_TOKEN = process.env.LOL_TOKEN

lolRegions = {
    'eun1': 'eun1.api.riotgames.com'
}



// REWRITE TO PROMISES
// THEN
// REWRITE CALLBACK HELL to THEN.THEN.
// THEN
// THEN.THEN. to await/async 


var version = "8.1.1"
function getChampName(id, callback) {
    request('http://ddragon.leagueoflegends.com/cdn/' + version + '/data/de_DE/champion.json', function (error, response, body) {
  
      let list = JSON.parse(body);
      let championList = list.data;
  
      for (var i in championList) {
  
        if (championList[i].key == id) {
          callback(undefined,championList[i].id)
        }
      }
  
    });
}



const getLastMatches = (accountId, callback) => {
    const url = `https://${lolRegions.eun1}/lol/match/v4/matchlists/by-account/${accountId}?endIndex=10&beginIndex=0&api_key=${LOL_TOKEN}`
    request({ url ,  json: true }, 
    (error, { body }) => {
        if (error) {
            callback ("Unable to connect to league api")
        }
        callback (undefined, body.matches)
    })
}

const getSummonerByName = (name, callback) => {
    const url = `https://${lolRegions.eun1}/lol/summoner/v4/summoners/by-name/${name}?api_key=${LOL_TOKEN}`
    request( { url, json: true}, (error, { body }) => {
        if (error) {
            callback ("Unable to connect to league api")
        }
        callback (undefined, body)
    })
}

const getMatchDetails = (id, callback) => {
    const url = `https://${lolRegions.eun1}/lol/match/v4/matches/${id}?api_key=${LOL_TOKEN}`
    request( { url, json: true}, (error, { body }) => {
        if (error) {
            callback ("Unable to connect to league api")
        }
        // console.log(body)
        callback (undefined, body)

    })
}


const getDetailedMatchDetails = (matches, callback) => {
    var iterationFlag = 0
    var detailedMatches = []
    matches.forEach(match => {
        detailedSingleMatch = getMatchDetails(match.gameId, (error, detailedMatch) => {
            detailedMatches.push(detailedMatch)
            iterationFlag++
            if (iterationFlag === matches.length) {
                // console.log(iterationFlag, matches.length)
                callback(undefined, detailedMatches)
            }
        })
    })
}

const generateStats = (matches, name, callback) => {
    var statArray = []
    var iterationFlag = 0
    matches.forEach(detailedMatch => {
        //getting player participant id in every match by name
        const participantId = detailedMatch.participantIdentities.filter((summoner) => {
            return summoner.player.summonerName == name
        })[0].participantId

        //getting win state
        const winState = detailedMatch.participants[participantId-1].stats.win

        statArray.push({
            mode: detailedMatch.gameMode, 
            winState,
            duration: (detailedMatch.gameDuration/60).toFixed(1),
            startedAt: moment(detailedMatch.gameCreation).format('YYYY-MM-DD hh:mm:ss'),
            kda: ((detailedMatch.participants[participantId-1].stats.kills + detailedMatch.participants[participantId-1].stats.assists)/
            detailedMatch.participants[participantId-1].stats.deaths).toFixed(1)
            })
        iterationFlag++ 
        if (statArray.length === matches.length) {
            callback(undefined, statArray)
        }
    })
}


const getStat = async (name, callback) => {
    const summoner = await getSummonerByName()
    const lastMatches = await getLastMatches(summoner)

    getSummonerByName(name, (error, summoner) => {
        getLastMatches(summoner.accountId, (error, matches) => {
            getDetailedMatchDetails(matches, (error, list) => {
                generateStats(list, name, (error, stat) => {
                    callback(undefined, stat.sort((a,b) => {
                        return moment(a.startedAt) - moment(b.startedAt)
                    }))
                })
            })
        })
    })
}

// main('Attomorphlin', (error, data) => {
//     console.log(data)
// })

module.exports = getStat 