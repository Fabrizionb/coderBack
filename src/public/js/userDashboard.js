console.log('cargo el userDah')
async function changeUserRole (userId) {
  const response = await fetch(`/api/user/premium/${userId}`, {
    method: 'POST'
  })
  if (response.ok) {
    const responseData = await response.json()
    Swal.fire({
      title: 'Success!',
      text: responseData.message,
      icon: 'success',
      confirmButtonText: 'OK'
    })
    location.reload()
  } else {
    const errorData = await response.json()
    Swal.fire({
      title: 'Error!',
      text: errorData.message,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
}
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
