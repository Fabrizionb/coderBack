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
      const p = document.getElementById('producto-id-create')
      p.innerText = `producto creado correctamente ${d.id}`
      socket.emit('productCreated', obj, d.id) // Emit con los datos del nuevo producto creado
      console.log('productCreated emited')
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
  const _id = document.getElementById('form-id-modify').value
  const status = document.getElementById('form-status-modify').value

  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  formData.append('price', price)
  formData.append('code', code)
  formData.append('category', category)
  formData.append('stock', stock)
  formData.append('status', status)
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

  const bodyData = product
  const response = await fetch(`/api/products/${_id}`, {
    method: 'PUT',
    body: JSON.stringify(bodyData.product),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    response.json().then((d) => {
      const p = document.getElementById('producto-modify')
      p.innerText = `producto modificado ${_id}`
      socket.emit('productModify', product, _id) // Emit con los datos del nuevo producto creado
      console.log('productModify emited')
    })
  } else {
    const p = document.getElementById('producto-modify')
    p.innerText = `producto con ${_id} no encontrado`
  }

  // Borrar los valores de los campos del formulario
  document.getElementById('form-title-modify').value = ''
  document.getElementById('form-description-modify').value = ''
  document.getElementById('form-price-modify').value = ''
  document.getElementById('form-code-modify').value = ''
  document.getElementById('form-cat-modify').value = ''
  document.getElementById('form-stock-modify').value = ''
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

socket.on('productModifyServer', (updateData, id) => {
  const row = document.querySelector(`#tableRealTime tr[id='${id}']`)
  if (row) {
    const thumbnail = row.querySelectorAll('td')[8].innerHTML
    const { title, description, price, code, category, stock, status } =
      updateData
    row.querySelector(':nth-child(2)').textContent = title
    row.querySelector(':nth-child(3)').textContent = description
    row.querySelector(':nth-child(4)').textContent = category
    row.querySelector(':nth-child(5)').textContent = price
    row.querySelector(':nth-child(6)').textContent = status
    row.querySelector(':nth-child(7)').textContent = code
    row.querySelector(':nth-child(8)').textContent = stock
    const thumbnailColumn = row.querySelector(':nth-child(9)')
    thumbnailColumn.innerHTML = thumbnail
    row.querySelector(':nth-child(10) a').href = `/view/product/${id}`
  }
})

socket.on('productCreatedServer', (updateData, id) => {
  const tbody = document.querySelector('tbody')
  const row = document.createElement('tr')
  row.id = { id }

  const { title, description, price, code, category, stock } = updateData

  row.innerHTML = `
    <td class=" text-center align-middle">${id}</td>
    <td class=" text-center align-middle">${title}</td>
    <td class=" text-center align-middle">${description}</td>
    <td class=" text-center align-middle">${category}</td>
    <td class=" text-center align-middle">${price}</td>
    <td class=" text-center align-middle">True</td>
    <td class=" text-center align-middle">${code}</td>
    <td class=" text-center align-middle">${stock}</td>
    <td class=" text-center align-middle">Loading</td>
    <td class=" text-center align-middle">
    <span  style="overflow: visible; position: relative; width: 110px;">
      <a title="View product" class="btn btn-sm btn-clean btn-icon btn-icon-md"
        href="/view/product/${id}">
        <img class="icon" src="https://img.icons8.com/ultraviolet/40/null/visible.png" />
      </a>
    </span>
    </td>
  `
  tbody.appendChild(row)
})
