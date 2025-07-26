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

### Intro

#### Get Intro List

- request

`GET /intro/list`

- response

```json
[
    {
        "title": "string",
        "description": "string",
        "image": "string"
    },
    ...
]
```

#### Get Detailed Intro List

- request

`GET /intro/detail`

- response

```json
[
    {
        "title": "string",
        "description": "string",
        "image": "string"
    },
    ...
]
```

### About Link

#### Get Link List

- request

`GET /link/list`

- response

```json
[
    {
        "name": "string",
        "image": "string",
        "url": "string",
        "description": "string"
    },
    ...
]
```

### Server

#### Get Server List

- request

`GET /server/list`

- response

```json
[
    {
        "name": "string",
        "description": "string",
        "online": "boolean",
        "playerCount": "number",
        "capacity": "number",
        "icon": "string",
        "onlineMapUrl": "string",
        "serverUrl": "string",
    },
    ...
]
```

### News

#### Get News Total

- request

`POST /news/total`

```json
{
    "target": "information" | "magazine" | "notice",
}
```

- response

```json
{
    "total": "number"
}
```

#### Get News List

- request

`POST /news/list`

```json
{
    "target": "information" | "magazine" | "notice",
    "page": "number",
    "pageSize": 12, // 只是提醒你是 12，请求时不附带该字段！
}
```

- response

```json
{
    "list": [
        {
            "id": "string",
            "title": "string",
            "brief": "string",
            "date": "string",
            "image": "string",
        },
        ...
    ]
}
```

#### Get News Detail

- request

`POST /news/detail`

```json
{
    "id": "string"
}
```

- response

```json
{
    "entity": {
        "id": "string",
        "title": "string",
        "brief": "string",
        "date": "string",
        "image": "string",
    },
    "content": [
        {
            "type": "markdown" | "pdf_file" | "ppt_file" | "xls_file" | "doc_file",
            "content": "string", // markdown content or file url
        },
        ...
    ],
    "author": {
        "avatar": "string",
        "name": "string",
        "tags": [
            {
                "text": "string",
                "color": "string",
                "tagColor": "string",
            },
            ...
        ],
    },
    "category": "资讯" | "杂志" | "公告",
}
```

### TODO