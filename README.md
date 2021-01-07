# gRPC Restful Client-Server

Example implementation of gRPC bwtween the internal microservices communications. The original request from the front-end is still using a Restful.

**Note:**
*This is just an example project, for those who wants to learn about gRPC on NodeJs.*

The illustration below is about how this project behave, so you may get the idea about how it's work under the hood.
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

## Data Flow
1. HTTP Request coming from the front-end or client via **CURL** or another RESTful client (Insomnia, Postman, etc)
2. Client Service requesting data through Rpc to the Server App
3. Server App then doing a DB query and returning the result back
4. Client Service got the result and return back to the original front-end or client.

## Project Preparation
1. Clone this project
2. There are 3 subdirectories; `server` is a server of gRPC; `client` is a server of client which provide a restful service to the user, and `protos` which holds the `.proto` file for product.
3. Go to `server` directory and install dependencies via 
```
npm i
```

4. Do the same step on the `client` directory
5. Create a new Postgres database called `grpc_products` (you may configure the username / password of the DB later on `server/knexfile.js`)
5. Running the migration from the server directory
```
npm run migrate
```

6. Also the run the seeds 
```
npm run seed
```

## Run the gRPC server
Go to `server` directory and run `npm start`. If everything Ok you will see a message like
```
> gRPC server running at http://127.0.0.1:1831

```
## Run the Restful server (Client of gRPC)
go to `client` directory and run `npm start`. You should see a message like this
```
> Server run at 3000
```

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

### Update Product
```
$ curl -X PUT -d '{"name": "Spoon", "price": "34.53"}' \
-H 'Content-Type: application/json' http://127.0.0.1:3000/api/products/3

{"status":"Updated"}
```

### Delete Product
```
$ curl -X DELETE http://127.0.0.1:3000/api/products/3

{"status":"Deleted"}
```

## LICENSE 
MIT ([more](LICENSE))
