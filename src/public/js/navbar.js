document.addEventListener('DOMContentLoaded', function () {
  const isLoggedIn = async () => {
    try {
      const response = await fetch('/api/user/current')
      const userData = await response.json()
      return userData.user !== undefined
    } catch (error) {
      return false
    }
  }

  const updateNavbar = async () => {
    const loggedIn = await isLoggedIn()
    const logRegElements = document.querySelectorAll('.logReg')
    const logoutBtn = document.getElementById('logout')
    const profileLink = document.querySelector('a[href="/profile"]')

    if (loggedIn) {
      logRegElements.forEach(element => {
        element.style.display = 'none'
      })
      logoutBtn.style.display = 'inline-block'
      profileLink.style.display = 'block'
    } else {
      logRegElements.forEach(element => {
        element.style.display = 'inline-block'
      })
      logoutBtn.style.display = 'none'
      profileLink.style.display = 'none'
    }
  }

  updateNavbar()
})