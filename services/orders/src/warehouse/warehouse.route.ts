import { BodyProp, Controller, Get, Path, Post, Put, Route, SuccessResponse, Request } from 'tsoa'
import { getBookInfo } from './get_book_info'
import { type ShelfId, type BookID, type OrderId, type FulfilledBooks, type OrderPlacement, type Order } from '../documented_types'
import { placeBooksOnShelf } from '../_disabled/place_on_shelf'
import { fulfilOrder } from './fulfil_order'
import { placeOrder } from './place_order'
import { listOrders } from './list_orders'
import { type ParameterizedContext, type DefaultContext, type Request as KoaRequest } from 'koa'
import { type AppWarehouseDatabaseState } from '../_disabled/warehouse_database'

@Route('order')
export class OrderRoutes extends Controller {
  /**
     * Place an order
     * @param order An array of the ordered book id's
     * @returns {OrderId}
     */
  @Post()
  @SuccessResponse(201, 'created')
  public async placeOrder (
    @BodyProp('order') order: OrderPlacement,
      @Request() request: KoaRequest
  ): Promise<OrderId> {
    const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx
    this.setStatus(201)
    try {
      const result = await placeOrder(ctx.state.warehouse, order)
      return result
    } catch (e) {
      this.setStatus(500)
      return ''
    }
  }

  /**
   * Get all the pending orders
   * @returns {Order[]}
   */
  @Get()
  public async listOrders (
    @Request() request: KoaRequest): Promise<Order[]> {
    const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx
    return await listOrders(ctx.state.warehouse)
  }
}
