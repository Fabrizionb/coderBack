const logout = document.querySelector('#logout')
logout.addEventListener('click', () => {
  fetch('/api/user/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(() => {
    document.cookie = 'AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;' // Eliminar la cookie "AUTH" en el cliente
    window.location.href = '/login'
  })
})
