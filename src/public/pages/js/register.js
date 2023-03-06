
async function send (event) {
  event.preventDefault()
  const title = document.getElementById('form-title').value
  const description = document.getElementById('form-description').value
  const price = document.getElementById('form-price').value
  const code = document.getElementById('form-code').value
  const category = document.getElementById('form-cat').value
  const stock = document.getElementById('form-stock').value
  const file = document.getElementById('form-images')

  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  formData.append('price', price)
  formData.append('code', code)
  formData.append('category', category)
  formData.append('stock', stock)
  //  formData.append('files', file)
  for (let i = 0; i < file.files.length; i++) {
    formData.append('files', file.files[i])
  }

  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData,
    headers: {

    }
  })
  if (response.ok) {
    response.json().then((d) => {
      const p = document.getElementById('producto-id')
      p.innerText = `producto creado ${d.id}`
    })
  } else {
    response.json().then(formData)
  }
  // Borrar los valores de los campos del formulario
  document.getElementById('form-title').value = ''
  document.getElementById('form-description').value = ''
  document.getElementById('form-price').value = ''
  document.getElementById('form-code').value = ''
  document.getElementById('form-cat').value = ''
  document.getElementById('form-stock').value = ''
  document.getElementById('form-images').value = ''
}
