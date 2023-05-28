export default (req, res, next) => {
  res.okResponse = (data) => {
    res.status(200).send({
      status: 'success',
      payload: data
    })
  }
  res.userErrorResponse = (error) => {
    res.status(400).send({
      status: 'error',
      message: error.message,
      code: error.code
    })
  }
  res.serverErrorResponse = (error) => {
    res.status(500).send({
      status: 'error',
      message: error.message,
      code: error.code
    })
  }
  next()
}
