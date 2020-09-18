const request = require('postman-request')
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const windowsLocalhost = process.env.WSL_HOST_IP

request(`https://${windowsLocalhost}:2999/liveclientdata/allgamedata`, (error,response) => {
    console.log(error)
    console.log(response)
})