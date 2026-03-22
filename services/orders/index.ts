import server from './server'

server(3001).then(() => { console.log('Exiting Application') }).catch((err) => { console.error(err) })
