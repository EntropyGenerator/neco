# API Documentation

## ROOT

`/necore`

### Slogan

- request

`GET /slogan`

- response

```json
{
    "slogan": "blabla"
}
```

### Auth

#### Login

- request

`POST /auth/login`

```json
{
    "username": "string",
    "password": "string"
}
```

- response

```json
{
    "token": "string",
    "error": "string" // if error
}
```

#### Register

- request

`POST /auth/register`

```json
{
    "username": "string",
    "password": "string",
    "email": "string",
    "name": "string",
    "avatar": "string"
}
```

- response

```json
{
    "token": "string",
    "error": "string" // if error
}
```

### User

#### Get User

- request

`GET /user/:id`

- response

```json
{
    "id": "string",
    "username": "string",
    "name": "string",
    "avatar": "string",
    "email": "string",
}
```

### TODO