async function uploadDocuments (event) {
  event.preventDefault()
  const documents = document.getElementById('documents')
  const formData = new FormData()

  for (let i = 0; i < documents.files.length; i++) {
    formData.append('files', documents.files[i])
  }

  const uid = getUid()
  const response = await fetch(`/api/user/${uid}/documents`, {
    method: 'POST',
    body: formData,
    headers: {}
  })
  if (response.ok) {
    Swal.fire({
      title: 'Success',
      text: 'Documents uploaded successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      window.location.href = '/profile'
    })
  } else {
    const errorMessage = await response.text() // or use response.json() if your server sends JSON response
    Swal.fire({
      title: 'Error',
      text: `An error occurred: ${errorMessage}`,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
  // Clear the selected files
  document.getElementById('documents').value = ''
}

function getUid () {
  const uid = document.getElementById('content').dataset.uid
  return uid
}
