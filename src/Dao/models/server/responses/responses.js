export class Response {
  constructor (res, statusCode, data, status) {
    res.status(statusCode).send({
      status,
      ...data
    })
  }
}
