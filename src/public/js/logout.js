const logout = document.querySelector('#logout')
logout.addEventListener('click', () => {
  fetch('/api/user/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    window.location.href = '/login'
  })
})
