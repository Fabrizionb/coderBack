const logout = document.querySelector('#logout')
logout.addEventListener('click', () => {
  fetch('/api/user/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    const url = window.location.href
    const first = url.split('/')[2]
    window.location.href = `http://${first}/profile`
  })
})
