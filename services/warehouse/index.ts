import server from './server'

server(3002).then(() => { console.log('Exiting Application') }).catch((err) => { console.error(err) })
