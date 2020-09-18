const request = require('postman-request')
const moment = require('moment')

LOL_TOKEN = process.env.LOL_TOKEN

lolRegions = {
    'eun1': 'eun1.api.riotgames.com'
}


const getChampionName = (id) => {
    var version = "8.1.1"
    const url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/de_DE/champion.json`
    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, response) => {
            if (error) reject (error)
            if (response.statusCode!=200) reject ("Received bad status code during request " + response.statusCode)
            for (var i in response.body.data) {
                if (response.body.data[i].key == id) resolve (response.body.data[i].id)
            }
        })
    })
}

const getChampionNamesFromArray = (statArray) => {
    var version = "8.1.1"
    const url = `http://ddragon.leagueoflegends.com/cdn/${version}/data/de_DE/champion.json`
    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, response) => {
            if (error) reject (error)
            if (response.statusCode!=200) reject ("Received bad status code during request " + response.statusCode)
            for (var z in statArray) {
                for (var i in response.body.data) {
                    if (response.body.data[i].key == statArray[z].champion) statArray[z].champion = response.body.data[i].id
                }
            }
            resolve(statArray)
        })
    })
}

const getLastMatches = (accountId) => {
    return new Promise((resolve, reject) => {
        const url = `https://${lolRegions.eun1}/lol/match/v4/matchlists/by-account/${accountId}?endIndex=10&beginIndex=0&api_key=${LOL_TOKEN}`
        request({ url ,  json: true }, 
        (error, response) => {
            if (error) {
                reject("Unable to connect to league api")
            }
            if (response.body) {
                resolve(response.body.matches)
            }
            reject('Got empty body for last matches')
        })
    })
}

const getSummonerByName = (name) => {
    return new Promise((resolve, reject) => {
        const url = `https://${lolRegions.eun1}/lol/summoner/v4/summoners/by-name/${name}?api_key=${LOL_TOKEN}`
        request( { url, json: true}, (error, response) => {
            if (error) {
                reject("Unable to connect to league api")
            }
            if (response.body) {
                resolve(response.body)
            }
            reject('Got empty body for getSummonerByName')
            
        })
    })
}

const getMatchDetails = (id) => {
    return new Promise((resolve, reject) => {
        const url = `https://${lolRegions.eun1}/lol/match/v4/matches/${id}?api_key=${LOL_TOKEN}`
        request( { url, json: true}, (error, response) => {
            if (error) {
                reject("Unable to connect to league api")
            }
            if(response.body) {
                resolve (response.body)
            }
            reject('Got empty body for getMatchDetails')
        })
    })
}


const getDetailedMatchDetails = (matches) => {
    return new Promise((resolve, reject) => {
        try {
            let promiseArray = matches.map(match => match.gameId).map(getMatchDetails)
            Promise.all(promiseArray).then(result => resolve(result))
        } catch (e) {
            reject ("Unable to get detailed match info", e)
        }
    })
}

const generateStats = (matches, name, friendList) => {
    return new Promise((resolve, reject) => {
        try {
            var statArray = []
            var lastGame = []
            matches.forEach(detailedMatch => {
                //getting player participant id in every match by name
                const participantId = detailedMatch.participantIdentities.filter((summoner) => {
                    return summoner.player.summonerName == name
                })[0].participantId - 1 

                //getting win state
                const winState = detailedMatch.participants[participantId].stats.win
                const ratFactor = (100 - detailedMatch.participantIdentities.filter((summoner) => friendList.includes(summoner.player.summonerName)).length * (100/friendList.length)).toFixed(0)
                
                statArray.push({
                    mode: detailedMatch.gameMode, 
                    winState,
                    duration: (detailedMatch.gameDuration/60).toFixed(1),
                    startedAt: moment(detailedMatch.gameCreation).format('YYYY-MM-DD hh:mm:ss'),
                    kda: ((detailedMatch.participants[participantId].stats.kills + detailedMatch.participants[participantId].stats.assists)/
                    detailedMatch.participants[participantId].stats.deaths).toFixed(1),
                    champion: detailedMatch.participants[participantId].championId,
                    totalDamageDealt: detailedMatch.participants[participantId].stats.totalDamageDealtToChampions,
                    ratFactor
                    })
                //check if it is the last game
                if (detailedMatch.gameId === matches[0].gameId) {
                    friendList.push(name)
                    for (i in friendList) {
                        const isPlayed = detailedMatch.participantIdentities.filter((summoner) => {
                            return summoner.player.summonerName == friendList[i]}).length
                        if (isPlayed) {
                            const participantId = detailedMatch.participantIdentities.filter((summoner) => {
                                return summoner.player.summonerName == friendList[i]
                            })[0].participantId - 1 
    
                            lastGame.push({
                                summonerName: friendList[i],
                                totalDamageDealt: detailedMatch.participants[participantId].stats.totalDamageDealtToChampions, 
                                kda: ((detailedMatch.participants[participantId].stats.kills + detailedMatch.participants[participantId].stats.assists)/
                                detailedMatch.participants[participantId].stats.deaths).toFixed(1)
    
                            })
                        }
                        
                    }
                    friendList.pop()
                }
            })
            resolve([statArray, lastGame])
        } catch(e) {
            reject("Unable to generate stats " + e)
        }
    })
}

const getStat = async (name, friendList) => {

    const summonerName = await getSummonerByName(name)
    const lastMatches = await getLastMatches(summonerName.accountId)
    const detailedMatches = await getDetailedMatchDetails(lastMatches)
    const [stats, lastGame] = await generateStats(detailedMatches, name, friendList)
    const statsWithChampions = await getChampionNamesFromArray(stats)
    const sortedStatsWithChampions = statsWithChampions.sort((a,b) => {
        return moment(a.startedAt) - moment(b.startedAt)
    })

    return [sortedStatsWithChampions, lastGame]
}

module.exports = getStat 