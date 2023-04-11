function auth (req, res, next) {
  const user = req.session.user
  // console.log('user desde auth', user)
  if (!user) {
    res.redirect('/login')
  } else {
    next()
  }
}

export default auth
