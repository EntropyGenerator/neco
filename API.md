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

User group includes ["admin", "news_admin", "activity_admin"]. If empty, the user doesn't have permission to manage corresponding resources.

#### Login

- request

`POST /auth/login`

```json
{
    "email": "string",
    "password": "string"
}
```

- response

```json
{
    "token": "string",
    "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "group": "string[]",
        "department": "string[]",
    },
    "error": "string" // if error
}
```

#### Register

Login required after registration.

- request

`POST /auth/register`

```json
{
    "username": "string",
    "password": "string",
    "email": "string",
}
```

- response

```json
{
    "error": "string" // if error
}
```

#### User Info

- request

`GET /auth/user/:id`

- response

```json
{
    "id": "string",
    "username": "string",
    "email": "string",
}
```

### TODO