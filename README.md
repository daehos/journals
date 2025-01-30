## Endpoints :

List of available endpoints:

- `POST /register`
- `POST /login`

- `POST /journals`
- `POST /generate-response`
- `GET /journals`
- `GET /journals/:id`
- `PUT /journals/:id`
- `DELETE /journals/:id`

&nbsp;

## 1. POST /register

Request:

- body

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "token": "string",
  "user": {
    "id": "integer",
    "email": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Email must be unique"
}
OR
{
  "message": "Password is required"
}

```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 2. POST /login

Request:

- body

```json
{
  "email": "string",
  "password": "string"
}
```

- _Response (200 - OK)_

```json
{
  "token": "string",
  "user": {
    "id": "integer",
    "email": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
OR
```

_Response (401 - Invalid username or email or password)_

```json
{
  "message": "Invalid username or email or password"
}
```

_Response (500 - Internal Server Error)_\

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 3. POST /journals

Request:

- body

```json
{
  "content": "Hari ini aku keterima sebagai pns di PUPR",
  "ai_insight": "Joss kamu luar biasa",
  "date": "2025-01-29T00:00:00.000Z"
}
```

_Response (201 - Created)_

```json
{
  "id": 2,
  "content": "Hari ini aku keterima sebagai pns di PUPR",
  "ai_insight": "Joss kamu luar biasa",
  "date": "2025-01-29T00:00:00.000Z",
  "UserId": 1,
  "updatedAt": "2025-01-30T02:09:16.888Z",
  "createdAt": "2025-01-30T02:09:16.888Z"
}
```

&nbsp;

## 4. GET /journals

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "UserId": 1,
    "date": "2025-01-29T00:00:00.000Z",
    "content": "Hari ini aku merasa sangat produktif",
    "ai_insight": "Kamu sedang mengalami hari yang penuh semangat. Tetap pertahankan!",
    "createdAt": "2025-01-30T02:01:01.912Z",
    "updatedAt": "2025-01-30T02:01:01.912Z"
  },
  {
    "id": 2,
    "UserId": 1,
    "date": "2025-01-29T00:00:00.000Z",
    "content": "Hari ini aku keterima sebagai pns di PUPR",
    "ai_insight": "Joss kamu luar biasa",
    "createdAt": "2025-01-30T02:09:16.888Z",
    "updatedAt": "2025-01-30T02:09:16.888Z"
  }
]
```

&nbsp;

## 5. POST /generate-response

Request:

- body

```json
{
  "userPrompt": "hari ini aku baru sadar ternyata kalo abis bikin error handler harus dipanggil lagi app.use(errorHandler), gara gara kesalahan ini aku jadi gabisa ngerjain livecode nya aku takut nilai ku jelek"
}
```

_Response (200 - OK)_

```json
{
  "message": "Hai!  Memahami error handling di pengembangan aplikasi itu memang menantang, dan wajar sekali merasa frustrasi saat menemukan bug, apalagi menjelang deadline.  Dari entri jurnalmu, aku melihat beberapa hal penting:\n\n1. **Kesalahan adalah bagian dari proses belajar:**  Kamu berhasil mengidentifikasi dan memahami kesalahanmu terkait `app.use(errorHandler)`.  Ini menunjukkan kemampuanmu untuk debugging dan memecahkan masalah.  Jangan berkecil hati karena kesalahan ini, justru jadikan sebagai pelajaran berharga.\n\n2. **Pentingnya memahami urutan eksekusi:** Kesalahanmu menunjukkan pentingnya pemahaman tentang urutan eksekusi middleware dalam framework yang kamu gunakan.  Pastikan kamu sudah benar-benar mengerti bagaimana middleware dijalankan dan bagaimana error handler bekerja di dalamnya."
}
```

&nbsp;

## 6. DELETE /journals/:id

Request:

- params

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "message": "Journal deleted successfully"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Journal not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 7. PUT /journals/:id

Request:

- params

```json
{
  "id": "integer (required)"
}
```

- body

```json
{
  "content": "Hari ini aku keterima sebagai pns di PUPR",
  "ai_insight": "Joss kamu luar biasa",
  "date": "2025-01-29T00:00:00.000Z"
}
```

_Response (200 - OK)_

```json
{
  "id": 2,
  "UserId": 1,
  "date": "2025-01-29T00:00:00.000Z",
  "content": "Hari ini aku keterima sebagai pns di PUPR tapi gatau penempatan dimana",
  "ai_insight": "Jangan khawatir kamu nanti pensiun pun ada tunjangan jadi chill aja brok",
  "createdAt": "2025-01-30T02:09:16.888Z",
  "updatedAt": "2025-01-30T02:26:39.617Z"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Journal not found"
}
```
_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```
