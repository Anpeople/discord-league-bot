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
                console.log(response)
                resolve (response.body)
            }
            reject('Got empty body for getMatchDetails')
        })
    })
}


const getDetailedMatchDetails = (matches) => {
    console.log(matches)
    return new Promise((resolve, reject) => {
        try {
            let promiseArray = matches.map(match => match.gameId).map(getMatchDetails)
            Promise.all(promiseArray).then(result => resolve(result))
        } catch {
            reject ("Unable to get detailed match info")
        }
    })
}

const generateStats = (matches, name) => {

    return new Promise((resolve, reject) => {
        try {
            var statArray = []
            matches.forEach(detailedMatch => {
                //getting player participant id in every match by name
                const participantId = detailedMatch.participantIdentities.filter((summoner) => {
                    return summoner.player.summonerName == name
                })[0].participantId - 1 

                //getting win state
                const winState = detailedMatch.participants[participantId-1].stats.win
                
                statArray.push({
                    mode: detailedMatch.gameMode, 
                    winState,
                    duration: (detailedMatch.gameDuration/60).toFixed(1),
                    startedAt: moment(detailedMatch.gameCreation).format('YYYY-MM-DD hh:mm:ss'),
                    kda: ((detailedMatch.participants[participantId].stats.kills + detailedMatch.participants[participantId-1].stats.assists)/
                    detailedMatch.participants[participantId].stats.deaths).toFixed(1),
                    champion: detailedMatch.participants[participantId].championId,
                    totalDamageDealt: detailedMatch.participants[participantId].stats.totalDamageDealtToChampions
                    })  
            })
            resolve(statArray)
        } catch {
            reject("Unable to generate stats")
        }
    })
}

const getStat = (name) => {
    return new Promise((resolve, reject) => {
            getSummonerByName(name)
            .then(summoner => getLastMatches(summoner.accountId))
            .then(matches => getDetailedMatchDetails(matches))
            .then(list => generateStats(list,name))
            .then(statArray => getChampionNamesFromArray(statArray))
            .then(result => resolve(result.sort((a,b) => {
                return moment(a.startedAt) - moment(b.startedAt)
            })))
            .catch(failure => reject(failure))  
    })
}

// getStat('Attomorphlin')
// .then(result => console.log(result))
// .catch(error => console.log(error))


// const stats = [
//     {
//       mode: 'ARAM',
//       winState: false,
//       duration: '14.3',
//       startedAt: '2020-08-25 02:00:20',
//       kda: '2.0',
//       champion: 222
//     },
//     {
//       mode: 'ARAM',
//       winState: false,
//       duration: '19.3',
//       startedAt: '2020-08-25 01:36:18',
//       kda: '3.3',
//       champion: 112
//     },
//     {
//       mode: 'ARAM',
//       winState: true,
//       duration: '24.4',
//       startedAt: '2020-08-24 09:34:10',
//       kda: '8.2',
//       champion: 145
//     },
//     {
//       mode: 'ARAM',
//       winState: false,
//       duration: '11.6',
//       startedAt: '2020-08-24 09:15:49',
//       kda: '3.3',
//       champion: 45
//     },
//     {
//       mode: 'ARAM',
//       winState: false,
//       duration: '19.9',
//       startedAt: '2020-08-24 08:52:38',
//       kda: '3.6',
//       champion: 1
//     },
//     {
//       mode: 'ARAM',
//       winState: true,
//       duration: '29.1',
//       startedAt: '2020-08-24 08:18:59',
//       kda: '3.5',
//       champion: 51
//     },
//     {
//       mode: 'ARAM',
//       winState: false,
//       duration: '23.1',
//       startedAt: '2020-08-24 07:48:43',
//       kda: '4.9',
//       champion: 57
//     },
//     {
//       mode: 'ARAM',
//       winState: true,
//       duration: '19.5',
//       startedAt: '2020-08-24 01:32:58',
//       kda: '11.0',
//       champion: 25
//     },
//     {
//       mode: 'ARAM',
//       winState: false,
//       duration: '20.5',
//       startedAt: '2020-08-24 01:08:22',
//       kda: '2.6',
//       champion: 9
//     },
//     {
//       mode: 'ARAM',
//       winState: true,
//       duration: '19.9',
//       startedAt: '2020-08-24 12:45:28',
//       kda: '4.1',
//       champion: 84
//     }
// ]

// // addChampionNamesToStat(stats).then(result => console.log(result))
// getChampionNamesFromArray(stats).then(result => console.log(result))

module.exports = getStat 