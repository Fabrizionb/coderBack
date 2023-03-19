/* eslint-disable */
const socket = io()

async function send (event) {
  event.preventDefault()
  const title = document.getElementById('form-title-create').value
  const description = document.getElementById('form-description-create').value
  const price = document.getElementById('form-price-create').value
  const code = document.getElementById('form-code-create').value
  const category = document.getElementById('form-cat-create').value
  const stock = document.getElementById('form-stock-create').value
  const file = document.getElementById('form-images-create')

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

  const obj = {}
  for (const [key, value] of formData.entries()) {
    if (obj[key]) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]]
      }
      obj[key].push(value)
    } else {
      obj[key] = value
    }
  }

  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData,
    headers: {}
  })
  if (response.ok) {
    response.json().then((d) => {
      const p = document.getElementById('producto-id')
      p.innerText = `producto creado ${d.id}`
      socket.emit('productCreated', obj) // Emit con los datos del nuevo producto creado
    })
  } else {
    response.json().then(formData)
  }
  // Borrar los valores de los campos del formulario
  document.getElementById('form-title-create').value = ''
  document.getElementById('form-description-create').value = ''
  document.getElementById('form-price-create').value = ''
  document.getElementById('form-code-create').value = ''
  document.getElementById('form-cat-create').value = ''
  document.getElementById('form-stock-create').value = ''
  document.getElementById('form-images-create').value = ''
}

async function sendModify (event) {
  event.preventDefault()
  const title = document.getElementById('form-title-modify').value
  const description = document.getElementById('form-description-modify').value
  const price = document.getElementById('form-price-modify').value
  const code = document.getElementById('form-code-modify').value
  const category = document.getElementById('form-cat-modify').value
  const stock = document.getElementById('form-stock-modify').value
  // const file = document.getElementById("form-images-modify");
  const id = document.getElementById('form-id-modify').value

  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  formData.append('price', price)
  formData.append('code', code)
  formData.append('category', category)
  formData.append('stock', stock)
  formData.append('id', id)
  //  formData.append('files', file)
  // for (let i = 0; i < file.files.length; i++) {
  //   formData.append("files", file.files[i]);
  // }

  const product = {}
  for (const [key, value] of formData.entries()) {
    if (product[key]) {
      if (!Array.isArray(product[key])) {
        product[key] = [product[key]]
      }
      product[key].push(value)
    } else {
      product[key] = value
    }
  }

  const bodyData = {
    id,
    product
  }
  console.log('segundo', bodyData)

  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bodyData),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    response.json().then((d) => {
      const p = document.getElementById('producto-modify')
      p.innerText = `producto modificado ${d.id}`
      socket.emit('productModify', product) // Emit con los datos del nuevo producto creado
    })
  } else {
    const p = document.getElementById('delete-id')
    p.innerText = `producto con ${id} no encontrado`
  }

  // Borrar los valores de los campos del formulario
  document.getElementById('form-title-modify').value = ''
  document.getElementById('form-description-modify').value = ''
  document.getElementById('form-price-modify').value = ''
  document.getElementById('form-code-modify').value = ''
  document.getElementById('form-cat-modify').value = ''
  document.getElementById('form-stock-modify').value = ''
  document.getElementById('form-images-modify').value = ''
  document.getElementById('form-id-modify').value = ''
}

async function sendDelete (event) {
  event.preventDefault()
  const id = document.getElementById('form-id-delete').value

  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE'
  })

  if (response.ok) {
    const p = document.getElementById('delete-id')
    p.innerText = `producto eliminado ${id}`
    console.log('Emitted productDeleted with ID:', id)
    socket.emit('productDeleted', id) // Emit del producto eliminado
  } else {
    const p = document.getElementById('delete-id')
    p.innerText = `producto con ${id} no encontrado`
  }

  // Borrar los valores de los campos del formulario
  document.getElementById('form-id-delete').value = ''
}

socket.on('productDeletedServer', (id) => {
  // Eliminar la fila con el producto eliminado de la tabla
  const rowToRemove = document.getElementById(id)
  rowToRemove.remove()
})

socket.on('productCreatedServer', (updateData) => {
  console.log('productCreatedServer escuchado')

  // obtengo la tabla y le borro elc ontenido
  const tableBody = document.getElementById('tableRealTime')
  tableBody.innerHTML = ''

  updateData.forEach((obj) => {
    const newRow = document.createElement('tr')
    newRow.id = obj.id
    newRow.innerHTML = `
      <td class=" text-center align-middle">${obj.id}</td>
      <td class=" text-center align-middle">${obj.title}</td>
      <td class=" text-center align-middle">${obj.description}</td>
      <td class=" text-center align-middle">${obj.category}</td>
      <td class=" text-center align-middle">${obj.price}</td>
      <td class=" text-center align-middle">${obj.status}</td>
      <td class=" text-center align-middle">${obj.stock}</td>
      <td class=" text-center align-middle">${obj.thumbnails}</td>
    `
    tableBody.appendChild(newRow)
    
  })
})

// Sintaxis
// socket.emit('message')
// Los de abajo listeners
// socket.on('evento_para_socket_individual', data => {
//   console.log(data)
// })
// socket.on('evento_para_todos_menos_actual', data => {
//   console.log(data)
// })
// socket.on('evento_para_todos', data => {
//   console.log(data)
// })
