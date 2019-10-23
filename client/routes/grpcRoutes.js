const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')

const productProtoPath = path.join(__dirname, '..', '..', 'protos', 'product.proto')
const productProtoDefinition = protoLoader.loadSync(productProtoPath)
const productPackageDefinition = grpc.loadPackageDefinition(productProtoDefinition).product

const client = new productPackageDefinition.ProductService('127.0.0.1:1831', grpc.credentials.createInsecure())

// handlers
const listProducts = (req, res) => {
  client.listProducts({}, (err, result) => {
    res.json(result)
  })
}

const readProduct = (req, res) => {
  client.readProduct({ id: req.params.id }, (err, result) => {
    if (err) {
      res.json('Product not found')
    } else {
      res.json(result)
    }
  })
}

const createProduct = (req, res) => {
  client.createProduct({
    name: req.body.name,
    price: req.body.price,
  }, (err, result) => {
    res.json(result)
  })
}

const updateProduct = (req, res) => {
  client.updateProduct({
    id: req.params.id,
    name: req.body.name,
    price: req.body.price,
  }, (err, result) => {
    if (err) {
      res.json('Could not update product')
    } else {
      res.json(result)
    }
  })
}

const deleteProduct = (req, res) => {
  client.deleteProduct({ id: req.params.id }, (err, result) => {
    if (err) {
      res.json('Unable to delete due to error')
    } else {
      res.json(result)
    }
  })
}

module.exports = {
  listProducts,
  readProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
