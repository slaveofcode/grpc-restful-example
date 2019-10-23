const express = require('express')
const bodyParser = require('body-parser')
const productRoutes = require('./routes/productRoutes')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', productRoutes)

app.listen(3000, () => {
  console.log('Server run at 3000')
})
