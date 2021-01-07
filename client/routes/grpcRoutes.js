const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')

const productProtoPath = path.join(__dirname, '..', '..', 'protos', 'product.proto')
const productProtoDefinition = protoLoader.loadSync(productProtoPath)
const productPackageDefinition = grpc.loadPackageDefinition(productProtoDefinition).product

const client = new productPackageDefinition.ProductService('127.0.0.1:1831', grpc.credentials.createInsecure(), {
  // See more options here: https://grpc.github.io/grpc/core/group__grpc__arg__keys.html
  'grpc.keepalive_time_ms': 1000, // sending keep-alive ping every 1 sec
  'grpc.keepalive_timeout_ms': 60000, // timeout for keep-alive ping if server still not responding, 60secs
  'grpc.keepalive_permit_without_calls': 1
})

// handlers
const listProducts = (req, res) => {
  client.listProducts({}, (err, result) => {
    res.json(result)
  })
}

const readProduct = (req, res) => {
  client.readProduct({ id: req.params.id }, (err, result) => {
    if (err) {
      // 14 code indicates server down
      // see: https://github.com/grpc/grpc-node/blob/57428bf6fa1fd98b42de43f0002a0fc47bf9a49b/packages/grpc-js-xds/src/generated/envoy/config/filter/accesslog/v2/GrpcStatusFilter.ts
      if (err.code && err.code === 14) {
        return res.json('Service Unavailable')
      }
      console.error('readProduct Error: ', err)
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
