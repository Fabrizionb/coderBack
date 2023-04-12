function isAdmin (req, res, next) {
  const user = req.session.user
  if (user.role !== 'admin') {
    res.redirect('/')
  } else {
    next()
  }
}

export default isAdmin
