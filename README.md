# Blog REST API

This is a RESTful API for a blog application.

## Installation

1. Install dependencies

```
npm install
```

2. Create `.env` file and specify environment variables:

```
# PRISMA ORM
DATABASE_URL = "postgresql://<db-user>:<db-user-password>@localhost:5432/<db-name>?schema=public"

# EXPRESS
SERVER_PORT = 3000

# JWT
JWT_SECRET = <secret-key>
JWT_EXPIRES_IN = "15m"
```

3. Apply DB migrations

```bash
npx prisma migrate dev
```

4. Build and run:

```bash
npm run build-and-run
```

## Endpoints

### 1. User Registration

**Endpoint**: `/auth/sign-up`

**Method**: `POST`

**Description**: Registers a new user.

**Request Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:
- **201 Created**: User successfully registered.
- **400 Bad Request**: Data validation error.
- **409 Conflict**: Username already in use.

### 2. User Authentication

**Endpoint**: `/auth/log-in`

**Method**: `POST`

**Description**: Authenticates a user and returns a token.

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
- **200 OK**: Authentication successful, returns a token.
```json
{"token": <jwt-token>}
```
- **401 Unauthorized**: Authentication failed.

### 3. Get Current User

**Endpoint**: `/auth/me`

**Method**: `GET`

**Description**: Retrieves information about the currently logged-in user.

**Headers**:
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response**:
- **200 OK**: Returns user information.
- **401 Unauthorized**: Token is missing or invalid.
