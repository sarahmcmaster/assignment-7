import server from './server'
import { subscribeToEvent } from './src/events/rabbitmq'

async function main (): Promise<void> {
  await subscribeToEvent('book-added-warehouse', async (payload) => {
    console.log('warehouse received book-added', payload)
  })

  await server(3002)
  console.log('Exiting Application')
}

void main().catch((err) => { console.error(err) })