const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')

const env = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[env]
const knex = require('knex')(config)

const productProtoPath = path.join(__dirname, '..', 'protos', 'product.proto')
const productProtoDefinition = protoLoader.loadSync(productProtoPath)
const productPackageDefinition = grpc.loadPackageDefinition(productProtoDefinition).product

// knex queries
async function listProducts(call, callback) {
  console.log("[listProduct] Called...")
  const products = await knex('products')
  callback(null, { products })
}

async function readProduct(call, callback) {
  console.log("[readProduct] Called...")
  const products = await knex('products').where({ id: parseInt(call.request.id) })
  if (products.length > 0) {
    callback(null, products[0])
  } else {
    callback('Product does not exist', { status: 'Error not Found' })
  }
}

async function createProduct(call, callback) {
  console.log("[createProduct] Called...")
  const newProduct = await knex('products').insert({
    name: call.request.name,
    price: call.request.price,
  })

  callback(null, { status: 'Created' })
}

async function updateProduct(call, callback) {
  console.log("[updateProduct] Called...")
  const updatedProduct = await knex('products').where({ id: parseInt(call.request.id) }).update({
    name: call.request.name,
    price: call.request.price,
  }).returning()

  if (updatedProduct) {
    callback(null, { status: 'Updated' })
  } else {
    callback('Product is not updated')
  }
}

async function deleteProduct(call, callback) {
  console.log("[deleteProduct] Called...")

  const deleted = await knex('products').where({ id: parseInt(call.request.id) }).delete().returning()
  if (deleted) {
    callback(null, { status: 'Deleted' })
  } else {
    callback('Unable to delete')
  }
}

function main() {
  const server = new grpc.Server()

  // registering grpc service
  server.addService(productPackageDefinition.ProductService.service, {
    listProducts,
    readProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  })

  server.bind('127.0.0.1:1831', grpc.ServerCredentials.createInsecure())
  server.start();
  console.log('gRPC server running at http://127.0.0.1:1831')
}

main()
