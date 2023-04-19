/* eslint-disable*/
async function emptyCart (cid) {
  try {
    const response = await fetch(`/api/cart/${cid}`, { method: 'DELETE' })
    const data = await response.json()
    window.location.href = '/'
    //  actualizar la página o mostrar un mensaje
  } catch (error) {
    console.error(error)
    // mostrar un mensaje de error al usuario
  }
}
async function deleteProduct (cid, pid) {
  fetch(`/api/cart/${cid}/product/${pid}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        location.reload() // recargar la página después de borrar el producto
      } else {
        throw new Error('Failed to delete product from cart')
      }
    })
    .catch(error => console.error(error))
}
async function updateProductQuantity (element, change) {
  const cartId = element.getAttribute('data-cart-id')
  const productId = element.getAttribute('data-product-id')
  const productStock = parseInt(element.getAttribute('data-product-stock'))
  const quantityElement = element.closest('td').querySelector('.qty')
  let quantity = parseInt(quantityElement.textContent)
  quantity += change
  if (quantity < 1 || quantity > productStock) {
    return
  }
  try {
    const response = await fetch(`/api/cart/${cartId}/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    })
    if (response.ok) {
      // Actualizar la cantidad
      quantityElement.textContent = quantity
      // 1. Actualizar el total del producto
      const productPrice = parseFloat(element.closest('tr').querySelector('td:nth-child(5)').textContent.trim().slice(1))
      const productTotalElement = element.closest('tr').querySelector('td:nth-child(7) strong')
      productTotalElement.textContent = `$${(quantity * productPrice).toFixed(2)}`
      // 2. Recalcular el total del carrito y actualizarlo
      const allProductTotalElements = document.querySelectorAll('td:nth-child(7) strong')
      let cartTotal = 0
      for (const elem of allProductTotalElements) {
        cartTotal += parseFloat(elem.textContent.trim().slice(1))
      }
      document.querySelector('td:nth-child(2) h4 strong').textContent = `$${cartTotal.toFixed(2)}`
    } else {
      throw new Error('Failed to update product quantity')
    }
  } catch (error) {
    console.error(error)
  }
}
