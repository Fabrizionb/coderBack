console.log('cargo el userDah')

async function deleteUser (userId) {
  const confirmation = confirm('Are you sure you want to delete this user?')
  if (confirmation) {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      location.reload()
    } else {
      alert('Failed to delete user.')
    }
  }
}

async function deleteInactiveUsers () {
  const confirmation = confirm('Are you sure you want to delete all inactive users?')
  if (confirmation) {
    const response = await fetch('/api/user', {
      method: 'DELETE'
    })
    if (response.ok) {
      location.reload()
    } else {
      alert('Failed to delete inactive users.')
    }
  }
}
