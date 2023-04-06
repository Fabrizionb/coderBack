// const v = 4
// import(`./express.v${v}.js`)
// import fs from 'fs'
import('./app.js')

// const categories = [{ name: 'T-shirts', titlePrefix: 'T-shirt', descPrefix: 'This is a T-shirt' }, { name: 'Pants', titlePrefix: 'Pants', descPrefix: 'This is a pair of pants' }, { name: 'Sweaters', titlePrefix: 'Sweater', descPrefix: 'This is a sweater' }, { name: 'Dresses', titlePrefix: 'Dress', descPrefix: 'This is a dress' }, { name: 'Jackets', titlePrefix: 'Jacket', descPrefix: 'This is a jacket' }]

// function generateCode (num) {
//   return 'abc' + ('000' + num).slice(-3)
// }

// function generateProduct (num) {
//   const category = categories[Math.floor(Math.random() * categories.length)]
//   const title = category.titlePrefix + ' ' + generateCode(num).slice(3) // Se quita el prefijo "abc"
//   const description = category.descPrefix + ' ' + generateCode(num).slice(3) // Se quita el prefijo "abc"
//   const price = Math.floor(Math.random() * 476) + 25 // Entre 25 y 500
//   const code = generateCode(num)
//   const stock = Math.floor(Math.random() * 101) // Entre 0 y 100
//   const status = (stock > 0)
//   const thumbnails = ['product-img1.jpg', 'product-img2.jpg', 'product-img3.jpg']

//   return {
//     title,
//     description,
//     price,
//     code,
//     category: category.name,
//     stock,
//     status,
//     thumbnails
//   }
// }

// const products = []
// for (let i = 1; i <= 200; i++) {
//   products.push(generateProduct(i))
// }

// // Mezclamos los índices aleatoriamente
// const indices = Array.from({ length: 200 }, (_, i) => i)
// for (let i = indices.length - 1; i > 0; i--) {
//   const j = Math.floor(Math.random() * (i + 1));
//   [indices[i], indices[j]] = [indices[j], indices[i]]
// }

// // Cambiamos los primeros 50 índices en la lista mezclada a productos con status false
// for (let i = 0; i < 50; i++) {
//   const index = indices[i]
//   products[index].status = false
//   products[index].stock = 0
// }

// fs.writeFile('products.json', JSON.stringify(products), (err) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   console.log('Products file created.')
// })
