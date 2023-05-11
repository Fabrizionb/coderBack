/* eslint-disable*/
const query = new URLSearchParams(window.location.search)
function setPrev () {
  const previusPage = Number(query.get('page')) - 1
  query.set('page', previusPage)
  window.location.search = query.toString()
}
function setNext () {
  const existPage = Number(query.get('page'))
  if (existPage) {
    const nextPage = Number(query.get('page')) + 1
    query.set('page', nextPage)
    window.location.search = query.toString()
  } else {
    query.set('page', 2)
    window.location.search = query.toString()
  }
}
function setLimit (limit) {
  query.set('limit', limit)
  query.set('page', 1)
  window.location.search = query.toString()
}
function setCategory (category) {
  query.set('category', category)
  query.set('page', 1)
  window.location.search = query.toString()
}
function setOrder (field, direction) {
  query.set('sort', field)
  query.set('order', direction)
  query.set('page', 1)
  window.location.search = query.toString()
}
function setDisp (status) {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set('status', status)
  window.location.search = urlParams.toString()
}
function resetFilters () {
  query.delete('category')
  query.delete('status')
  query.delete('sort')
  query.delete('order')
  query.delete('limit')
  query.delete('page')
  window.location.search = query.toString()
}
const cartId = document.getElementById('user-data').getAttribute('data-user')
async function addProductToCart (cartId, productId) {
  const response = await fetch(`http://localhost:8080/api/cart/${cartId}/product/${productId}`, {
    method: 'POST'
  })

  Swal.fire({
    title: 'Product added to cart',
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Go to cart',
    confirmButtonClass: 'btn-go-to-cart',
    cancelButtonText: 'Continue shopping',
    position: 'top-right',
    timer: 5000,
    timerProgressBar: true,
    toast: true
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = `/view/cart/${cartId}` // redirigir al usuario al carrito
    }
  })
}
const cartBtns = document.querySelectorAll('.cart-btn')
cartBtns.forEach(function (btn) {
  btn.addEventListener('click', async function (event) {
    const productId = event.target.closest('.product').dataset.productId
    if (cartId) {
      await addProductToCart(cartId, productId)
    } else {
      Swal.fire({
        title: 'You must be logged in to add products to the cart',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Go to login',
        confirmButtonClass: 'btn-go-to-cart',
        position: 'top-right',
        timer: 5000,
        timerProgressBar: true,
        toast: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login' // redirigir al usuario al login
        }
      })
    }
  })
})



