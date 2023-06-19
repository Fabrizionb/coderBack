const resetbtn = document.querySelector('#resetbtn')

function resetPassword (event) {
  event.preventDefault()
  const newPassword = document.getElementById('newPassword').value
  const confirmPassword = document.getElementById('confirmPassword').value
  const token = document.getElementById('token').value

  if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Passwords do not match',
      text: 'Please make sure both passwords are the same'
    })
    return
  }

  fetch('/api/user/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      newPassword,
      token
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'error') {
        if (data.code === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Link Expired',
            text: 'Your link has expired. You will be redirected to request a new one.',
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            window.location.href = '/forgot-password'
          })
        } else if (data.code === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'New password cannot be the same as the current password.'
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message
          })
        }
      } else if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Password Successfully Changed',
          text: 'You will be redirected to the login page in a few seconds.',
          timer: 3000,
          showConfirmButton: false
        }).then(() => {
          window.location.href = '/login'
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

resetbtn.addEventListener('click', resetPassword)
