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
| `myapp`   | `localhost:6000`
| `redis`   | `localhost:6379`
| `mongodb` |  `localhost:27017`

## API Endpoints

```bash
$ Get 
$ curl http://{environment}//GetUserInfo?uid={UID}
$ # Example
$ curl http://{environment}/GetUserInfo?uid=1
```

```bash
$ # Create user 
$ data={"name":"{name}","age":{age},"city":"{city}"}
$ Encode data with JWT 
$ curl -X POST -H "Content-Type: application/json" -d '{"token":"{encrypted with JWT}"}' http://{environment}/CreateUser
$ # Example
$ curl -X POST -H "Content-Type: application/json" -d '{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYXJ5YSIsImFnZSI6MjAsImNpdHkiOiJOZXcgeW9yayJ9.HWv_0ILo0HvMoYlmX01L3rIFfKUYmFSzail0x-FDTC0"}' http://{environment}/CreateUser
```
```bash
$ Similarly other Endpoints are
$ curl -X POST -H "Content-Type: application/json" -d '{"token":"{encrypted with JWT}"}' http://{environment}/EditUser/<uid>
$ # Example
$ curl curl -X POST -H "Content-Type: application/json" -d '{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYXJ5YSIsImFnZSI6MjAsImNpdHkiOiJOZXcgeW9yayJ9.HWv_0ILo0HvMoYlmX01L3rIFfKUYmFSzail0x-FDTC0"}' http://{environment}/EditUser/3
$ curl -X POST -H "Content-Type: application/json" -d '{"token":"{encrypted with JWT}"}' http://{environment}/DeleteUser/<uid>
```