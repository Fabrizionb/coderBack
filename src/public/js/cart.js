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
async function updateProductQuantity(element, event) {
  const cartId = element.getAttribute('data-cart-id');
  const productId = element.getAttribute('data-product-id');
  const productStock = parseInt(element.getAttribute('data-product-stock'));
  let quantity = parseInt(event.target.value);

  if (quantity < 1 || quantity > productStock) {
    return;
  }

  try {
    const response = await fetch(`/api/cart/${cartId}/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    if (response.ok) {
      const productPrice = parseFloat(
        element.closest('tr').querySelector('td:nth-child(4)').textContent.trim().slice(1),
      );
      const productTotalElement = element.closest('tr').querySelector('.product-subtotal');
      productTotalElement.textContent = `$${(quantity * productPrice).toFixed(2)}`;
      
      calculateCartTotal();
    } else {
      throw new Error('Failed to update product quantity');
    }
  } catch (error) {
    console.error(error);
  }
}

function calculateCartTotal() {
  const allProductTotalElements = document.querySelectorAll('.product-subtotal');
  let cartTotal = 0;
  for (const elem of allProductTotalElements) {
    cartTotal += parseFloat(elem.textContent.trim().slice(1));
  }
  const cartTotalText = `$${cartTotal.toFixed(2)}`;
  document.querySelector('.cart-total').textContent = cartTotalText;

  // Update the "Order Summary" section
  const orderSubtotalElement = document.querySelector('#order-summary table tr:first-child th:nth-child(2)');
  const orderTotalElement = document.querySelector('#order-summary table tr:last-child th:nth-child(2)');
  
  orderSubtotalElement.textContent = cartTotalText;
  orderTotalElement.textContent = cartTotalText;
}

async function proceedToCheckout(cartId) {
  event.preventDefault()
  try {
    const response = await fetch(`/api/cart/${cartId}/purchase`, {
      method: 'POST'
    });
    console.log("Response desde el cart.js",response);
    if (response.ok) {
      //Logger.info("compra exitosa")
      console.log("compra exitosa", response);
      window.location.href = '/purchase';
    } else {
      //Logger.Error("Error", response)
      console.error('Failed to purchase',response);
      throw new Error('Failed to purchase');
    }
  } catch (error) {
    console.error(error);
  }
}