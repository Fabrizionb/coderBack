console.log('cripto')
const accordionHeaders = document.querySelectorAll('.card-header')
accordionHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const targetBody = header.nextElementSibling
    targetBody.classList.toggle('collapse')
  })
})

async function createCart () {
  const response = await fetch('http://localhost:8080/api/cart', {
    method: 'POST'
  })
  const data = await response.json()
  const cartId = data.carts[0]._id
  localStorage.setItem('cartId', cartId)
}

async function addProductToCart (cartId, productId) {
  const response = await fetch(
    `http://localhost:8080/api/cart/${cartId}/product/${productId}`,
    {
      method: 'POST'
    }
  )
  const data = await response.json()
  Swal.fire({
    title: 'Product added to cart',
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: `<a href="/view/cart/${cartId}" class="btn-go-to-cart">Go to cart</a>`,
    cancelButtonText: 'Continue shopping',
    position: 'top-right',
    timer: 5000,
    timerProgressBar: true,
    toast: true
  })
}

document.addEventListener('DOMContentLoaded', function () {
  const addToCartBtn = document.getElementById('add-to-cart-btn')
  const productId = '{{data._id}}'
  const productStatus = '{{data.status}}' === 'true'
  addToCartBtn.addEventListener('click', async function () {
    if (productStatus) {
      let cartId = localStorage.getItem('cartId')
      if (!cartId) {
        await createCart()
        cartId = localStorage.getItem('cartId')
      }
      await addProductToCart(cartId, productId)
    }
  })
})
