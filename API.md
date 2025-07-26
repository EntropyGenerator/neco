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

Auth uses JWT Token.

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
    "user": {
        "username": "string",
        "group": "string[]",
        "department": "string[]",
    },
    "error": "string" // if error
}
```

#### Register

- auth

Only Admin can create accounts.

- request

`POST /auth/register`

```json
{
    "username": "string",
    "password": "string",
}
```

- response

```json
{
    "error": "string" // if error
}
```

#### User Info

- auth

Current user or Admin

- request

`GET /auth/user/:id`

- response

```json
{
    "user": {
        "username": "string",
        "group": "string[]",
        "department": "string[]",
    },
}
```

#### All User Info

- auth

Only Admin can see all users.

- request

`GET /auth/userlist`

- response

```json
{
    "users": [
        {
            "username": "string",
            "group": "string[]",
            "department": "string[]",
        },
    ],
}
```

#### Delete User

- auth

Only Admin can delete accounts.

- request

`DELETE /auth/user/:id`

- response

```json
{
    "error": "string" // if error
}
```

#### Update Password

- auth

User can update their own password. Admin can change password of others.

- request

`POST /auth/password`

```json
{
    "id": "string",
    "new_password": "string",
}
```

- response

```json
{
    "error": "string" // if error
}
```

#### Update User Info

- auth

Admin can change group and department of others.

- request

`PATCH /auth/user`

```json
{
    "username": "string",
    "group": "string[]",
    "department": "string[]",
}
```

- response

```json
{
    "error": "string" // if error
}
```

#### Logout

Remove session.

- request

`POST /auth/logout`

- response

```json
{
    "error": "string" // if error
}
```

### Activity

#### Activity List

- request

`GET /activity`

- response

TODO

### TODO