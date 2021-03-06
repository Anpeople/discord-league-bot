const dot = require('dot')
const fs = require('fs')
const nodeHtmlToImage = require('node-html-to-image')


function generateImage (gameArray, summonerName, avgKda, winRate, avgRatFactor, avgDamage, lastGame) {
    console.log("Sеarting generationg img")
    return new Promise((resolve, reject) => {
        try {
            const tableTemplate = fs.readFileSync('views/stat.def').toString();
            const renderTable = dot.template(tableTemplate)
            var table = ''
            for (i in gameArray) {
                table += renderTable(gameArray[i])
            }


            const lastGameTemplate = fs.readFileSync('views/last-game.def').toString();
            const renderLastGame = dot.template(lastGameTemplate)
            var lastGameTable = ''
            for (i in lastGame) {
                lastGameTable += renderLastGame(lastGame[i])
            }

            const template = fs.readFileSync('views/template.def').toString();
            const result = dot.template(template)
            const renderedString = result(({summonerName, avgKda, winRate, avgRatFactor, avgDamage, table, lastGameTable}))


            nodeHtmlToImage({
                output: './image.png',
                html: renderedString
                })
            .then(() => resolve())
        } catch(err) {
            reject(err)
        }
        
    })
}

module.exports = generateImage


