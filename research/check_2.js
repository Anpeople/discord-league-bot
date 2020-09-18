const arr = [
    {
      mode: 'ARAM',
      winState: false,
      duration: '27.0',
      startedAt: '2020-09-17 01:36:54',
      kda: '10.0',
      champion: 'Nidalee'
    },
    {
      mode: 'ARAM',
      winState: true,
      duration: '24.0',
      startedAt: '2020-09-17 02:01:03',
      kda: '7.8',
      champion: 'Nidalee'
    },
    {
      mode: 'ARAM',
      winState: true,
      duration: '15.0',
      startedAt: '2020-09-17 07:08:04',
      kda: '6.8',
      champion: 'Fiddlesticks'
    },
    {
      mode: 'ARAM',
      winState: true,
      duration: '14.1',
      startedAt: '2020-09-17 07:28:51',
      kda: '9.3',
      champion: 'Lucian'
    },
    {
      mode: 'ARAM',
      winState: false,
      duration: '22.5',
      startedAt: '2020-09-17 07:49:03',
      kda: '4.0',
      champion: 'Kalista'
    },
    {
      mode: 'ARAM',
      winState: false,
      duration: '21.8',
      startedAt: '2020-09-17 08:14:12',
      kda: '3.4',
      champion: 'Shen'
    },
    {
      mode: 'ARAM',
      winState: true,
      duration: '14.2',
      startedAt: '2020-09-17 11:13:01',
      kda: '13.0',
      champion: 'Ezreal'
    },
    {
      mode: 'ARAM',
      winState: false,
      duration: '18.7',
      startedAt: '2020-09-17 11:31:13',
      kda: '2.5',
      champion: 'Elise'
    },
    {
      mode: 'ARAM',
      winState: false,
      duration: '21.6',
      startedAt: '2020-09-17 11:54:52',
      kda: '4.6',
      champion: 'Nidalee'
    },
    {
      mode: 'ARAM',
      winState: true,
      duration: '16.8',
      startedAt: '2020-09-18 12:20:00',
      kda: '15.5',
      champion: 'Shaco'
    }
  ]
const name = 'Attomorphlin'
const avgKda = 7.69
const winRate = 0.5

const generateImage = require('../src/templating')

generateImage(arr, name, avgKda, winRate)
.then(console.log("ok"))
.catch(e => console.log(e))
