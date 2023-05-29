import MockingService from '../Dao/mock/mocking.service.mjs'
import CustomError from '../errors/custom.error.mjs'
class MockingController {
  #mockingService
  constructor () {
    this.#mockingService = new MockingService()
  }

  generateProduct (req, res) {
    const products = Array.from({ length: 50 }, () => this.#mockingService.generateProduct())
    if (!products) {
      throw CustomError.createError({
        name: 'Error creating mock products',
        cause: new Error('Failed to create products'),
        message: 'Failed to create products',
        code: 208
      })
    }
    res.okResponse({ status: 'ok', payload: products })
  }
}

const controller = new MockingController()
export default controller
