# RentRipple Backend

[![forthebadge made-with-javascript](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://nodejs.org/en/)


## Prerequisites
- Docker
- Git


## Setup 
```bash
# Get repository
$ git clone https://github.com/RentRipple/RentRipple-Backend.git & cd RentRipple-Backend/

# Run application
$ docker-compose up

App will run on http://127.0.0.1:6000
 ```
 ## Redis
 ```bash
 To run redis cli
 $ docker exec -it rentripple-backend-redis-1 redis-cli
 ```

  ## MongoDB
 ```bash
 To run MongoDB cli
 $ docker exec -it rentripple-backend-mongo-1 mongosh
 ```

 ## 
| Parameter | Example 
| - | - 
| `myapp`   | `localhost:8000`
| `redis`   | `localhost:6379`
| `mongodb` |  `localhost:27017`

## API Endpoints Documents

```bash
$ Get 
$ curl http://{environment}//api-docs
$ # Example
$ curl http://localhost:8000/api-docs
```