import amqp, { type Channel, type Connection, type ConsumeMessage } from 'amqplib'

const RABBITMQ_URL = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'

let connection: Connection | null = null
let channel: Channel | null = null

export async function getChannel (): Promise<Channel> {
  if (channel != null) return channel

  connection = await amqp.connect(RABBITMQ_URL)
  channel = await connection.createChannel()
  return channel
}

export async function publishEvent (queue: string, payload: unknown): Promise<void> {
  const ch = await getChannel()
  await ch.assertQueue(queue, { durable: false })
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))
}

export async function subscribeToEvent (
  queue: string,
  handler: (payload: unknown) => Promise<void> | void
): Promise<void> {
  const ch = await getChannel()
  await ch.assertQueue(queue, { durable: false })

  await ch.consume(queue, async (msg: ConsumeMessage | null) => {
    if (msg == null) return
    const payload = JSON.parse(msg.content.toString())
    await handler(payload)
    ch.ack(msg)
  })
}