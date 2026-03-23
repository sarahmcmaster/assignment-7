import { ObjectId } from 'mongodb'
import { type BookDatabaseAccessor } from '../database_access'
import { type Book, type BookID } from '../../adapter/assignment-4'
import { publishEvent } from '../events/rabbitmq'

export default async function createOrUpdateBook (book: Book, books: BookDatabaseAccessor): Promise<BookID | false> {
  const { books: bookCollection } = books
  const body = book

  if (typeof body.id === 'string') {
    const id = body.id
    const result = await bookCollection.replaceOne(
      { _id: { $eq: ObjectId.createFromHexString(id) } },
      {
        id,
        name: body.name,
        description: body.description,
        price: body.price,
        author: body.author,
        image: body.image
      }
    )

    if (result.modifiedCount === 1) {
      void publishEvent('book-added-orders', {
        id,
        title: body.name,
        author: body.author
      })

      void publishEvent('book-added-warehouse', {
        id,
        title: body.name,
        author: body.author
      })

      return id
    } else {
      return false
    }
  } else {
    const result = await bookCollection.insertOne({
      name: body.name,
      description: body.description,
      price: body.price,
      author: body.author,
      image: body.image
    })

    const newId = result.insertedId.toHexString()

    void publishEvent('book-added-orders', {
      id: newId,
      title: body.name,
      author: body.author
    })
    console.log('publishing book-added-warehouse')
    void publishEvent('book-added-warehouse', {
      id: newId,
      title: body.name,
      author: body.author
    })

    return newId
  }
}