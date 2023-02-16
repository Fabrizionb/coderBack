// Importando Express
const express = require('express')
// Pegandole la importacion a la variable app
const app = express()
// Puerto
const port = 8080
// Escuchando el puerto 8080
app.listen(port, () => console.log('escuchando puerto 8080'))

// Rutas primer parametro la ruta, segundo un callback que recibe dos parametros, req y res.
// Res se utiliza para responder la peticion
// req.query,  y req.body
// req.params Se utiliza cuando necesitamos obtener elementos dinámicos desde la ruta que está llamando el cliente para poder definir un “parámetro” dentro de la ruta a trabajar, basta con colocar el símbolo de dos puntos : antes del parámetro, de esta manera, express reconoce que queremos que ese elemento sea dinámico.
// req.query Como su nombre lo indica, query refiere a las múltiples consultas que se pueden hacer a un determinado endpoint, basta conque en la url coloquemos el símbolo ? , entonces express reconocerá que hay que meter información al objeto req.query para poder utilizarlo en el endpoint.Cuando buscamos algo en nuestro navegador, llamamos a un endpoint haciendo un determinado query.

app.get('/bienvenida', (req, res) => {
  res.send(
    `
        <body>
            <h1 style="color:blue">Bienvenido</h1>
                    </body>
        `
  )
})

app.get('/usuario', (req, res) => {
  res.send('<h1>Hola</h1>')
})
