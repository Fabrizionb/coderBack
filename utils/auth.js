function auth (req, res, next) {
  const user = req.session.passport.user
  // console.log('user desde auth', user)
  if (!user) {
    res.redirect('/login')
  } else {
    next()
  }
}

export default auth
