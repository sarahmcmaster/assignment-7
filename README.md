

## Architecture Overview

This project was refactored into three services:
- listings (book management)
- orders (order handling)
- warehouse (inventory and fulfillment)

RabbitMQ is used for asynchronous communication between services.

Example:
- listings publishes a `book-added` event when a book is created or updated
- orders and warehouse subscribe to this event and update their local state

This reduces direct coupling between services and improves scalability.

Each service exposes its own Swagger documentation:

- listings: http://localhost:3000/docs
- orders: http://localhost:3001/docs
- warehouse: http://localhost:3002/docs

