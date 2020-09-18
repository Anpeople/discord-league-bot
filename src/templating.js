const dot = require('dot')
const fs = require('fs')
const nodeHtmlToImage = require('node-html-to-image')


function generateImage (gameArray, summonerName, avgKda, winRate) {
    console.log("STarting generationg img")
    console.log('Current directory: ' + process.cwd());
    return new Promise((resolve, reject) => {
        try {
            const tableTemplate = fs.readFileSync('views/table.def').toString();
            const renderTable = dot.template(tableTemplate)
            var table = ''
            for (i in gameArray) {
                table += renderTable(gameArray[i])
            }

            const template = fs.readFileSync('views/template.def').toString();
            const result = dot.template(template)
            const renderedString = result(({summonerName, avgKda, winRate, table}))

            // fs.writeFileSync('views/rendered.html', renderedString)

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


