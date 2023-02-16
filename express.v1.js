const express = require('express')
const app = express()

// req.params lleva dos puntos y el nombre del parametro
// se desestructura {unParametro} = req.params

app.get('/:unParametro', (req, res) => {
  const { unParametro } = req.params
  res.send(
    `recibio como parametro ${unParametro}`
  )
})

// multiples parametros
app.get('/:unParametro/:otroParametro', (req, res) => {
  const { unParametro, otroParametro } = req.params
  res.send(
       `se recibio como parametros ${unParametro} y ${otroParametro}`
  )
})

const port = 8080
app.listen(port, () => console.log('escuchando puerto 8080'))
