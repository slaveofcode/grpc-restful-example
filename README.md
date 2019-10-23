# gRPC Restful Client-Server

Example implementation of Client-Server comunication through Restful and gRPC on the internal microservices.

Please take a note this is just an example project, for those who wants to learn gRPC on Node, further features you may modify on your own.

```

                                               +----------------------+
                                               |DB|                   |
                         +                     +--+ +--------------+  +------+
                         |                     |    |   Products   |  |      |
                         |                     |    +--------------+  +<---+ |
                         |                     |                      |    | |
                         |                     +----------------------+    | | Queries
                         |                                                 | |
                         |                                                 | |
                    [Restful]                                              | |
+-----------------+ HTTP Req    +----------------+ RPC Calls  +------------+-v+
|                 +------+----->+                +------------>               |
| External Client |      |      | Client Service |            |  gRPC Server  |
|                 <------+------+                <------------+               |
+-----------------+ HTTP Resp   +----------------+            +---------------+
                         |
                         |
                         |
                         |
                         |
                         +

```

## Project Preparation
1. Clone this project
2. There are 3 subdirectory which `server` is a server of gRPC, `client` is a server of client which provide a restful service to the user and `protos` which holds the `.proto` file for product.
3. Go to `server` directory and install dependencies via 

> npm i

4. Do the same on the `client` directory
5. Create a new Postgres database called `grpc_products` (you may configure the username / password of the DB later on `knexfile.js`)
5. Running the migration from the root directory by running

> ./node_modules/.bin/knex migrate:latest

6. Running the seed 

> ./node_modules/.bin/knex seed:run


## Run the gRPC server
Go to `server` directory and run `node index`. If everything Ok you will see a message like

> gRPC server running at http://127.0.0.1:1831

## Run the Restful server (Client of gRPC)
go to `client` directory and run `node app.js`. You should see a message like this

> Server run at 3000

## Test via Curl
### List Products
```
$ curl http://127.0.0.1:3000/api/products 

{
  "products": [
    {
      "id": 1,
      "name": "pencil",
      "price": "1.99"
    },
    {
      "id": 2,
      "name": "pen",
      "price": "2.99"
    }
  ]
}
```

### Read Product
```
$ curl http://127.0.0.1:3000/api/products/1

{
  "id": 1,
  "name": "pencil",
  "price": "1.99"
}
```

### Create new Product

```
$  -X POST -d '{"name": "lamp", "price": "18.8"}' -H "Content-Type: application/json" http://127.0.0.1:3000/api/products

{"status":"Created"}
```


## LICENSE 
MIT