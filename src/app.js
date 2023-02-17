import express from 'express'
import ProductManager from './class/productManager.js'
const app = express()
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
  const query = req.query
  const limit = query.limit
  const products = await productManager.getProducts()

  try {
    if (!products) {
      res.status(200).send({ error: 'Products not found' })
    } else {
      if (!limit) {
        res.status(200).send({ products })
      } else {
        const limited = products.slice(0, limit)
        res.status(200).send({ limited })
      }
    }
  } catch {
    res.status(500).send('Error reading file')
  }
})

app.get('/products/:pid', async (req, res) => {
  let { pid } = req.params
  pid = parseInt(req.params.pid.split('=')[1])

  try {
    const product = await productManager.getProductById(pid)
    if (!product) {
      res.status(404).send('Product not found')
    }
    res.status(200).send({ product })
  } catch {
    res.status(500).send('Error finding product')
  }
})

const port = 8080
app.listen(port, () => console.log('escuchando puerto 8080'))

const productManager = new ProductManager('./data/db.json')
