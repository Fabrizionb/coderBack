
export default (req, res, next) => {
  res.okResponse = (data) => {
    res.status(200).send({
      status: 'success',
      payload: data
    })
  }
  res.userErrorResponse = (message) => {
    res.status(400).send({
      status: 'error',
      message
    })
  }
  res.serverErrorResponse = (message) => {
    res.status(500).send({
      status: 'error',
      message
    })
  }
  next()
}
