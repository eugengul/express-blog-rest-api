# Blog REST API

A RESTful API for managing a blog.

## Installation

1. Install dependencies:

    ```bash
    npm install
    ```

2. Set environment variables in `.env` file:

    ```bash
    DATABASE_URL = "postgresql://<db-user>:<password>@localhost:5432/<db-name>?schema=public"

    SERVER_PORT = 3000

    JWT_SECRET = <secret-key>

    JWT_EXPIRES_IN = "15m"
    ```

3. Apply database migrations:

    ```bash
    npx prisma migrate dev
    ```

4. Build and run the server:

    ```bash
    npm run build-and-run
    ```

## API Endpoints

Some endpoints require authentication(e.g. create/update/delete a new post/comment, get an unpublished post).

1. Get the JWT token from `/auth/log-in` endpoint.
2. Send the JWT token in `Authorization` header in the request.

```
Authorization: Bearer <token>
```

### Auth

- **POST** `/auth/sign-up` - Register a new user.

  Request:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

- **POST** `/auth/log-in` - Authenticate and receive a JWT. Successful login returns a JWT token in response.

### Users

- **GET** `/users/me` - Get current user details. *Requires JWT token.*

### Posts

- **GET** `/posts/` - Fetch all **published** posts.
- **GET** `/posts/:postId/` - Get a post by ID. *An unpublished post can be fetched only by the author.*
- **GET** `/users/me/posts/` - Get all posts for the authenticated user. *Requires login*.
- **POST** `/posts/` - Create a new post. *Requires login.*
- **PUT** `/posts/:postId/` - Update a post by ID. *Requires login. Only author can update their post.*
- **DELETE** `/posts/:postId/` - Delete a post by ID. *Requires login. Only author can delete their post.*

### Comments

- **POST** `/posts/:postId/comments/` - Add a comment to a post. *Requires login*
- **GET** `/posts/:postId/comments/` - Fetch all comments for a post.
- **DELETE** `/comments/:commentId/` - Delete a comment by ID. *Requires login. Only author can delete their comment.*

## Possible Response Statuses:

- **201 Created**: Successfully created resource (e.g., user, post).
- **200 OK**: Request successful (e.g., fetched data, updated resource).
- **400 Bad Request**: Data validation error.
- **401 Unauthorized**: Invalid or missing authentication.
- **403 Forbidden**: Access denied (e.g., trying to update/delete others' posts).
- **404 Not Found**: Resource not found (e.g., invalid post/comment ID).
- **409 Conflict**: Conflict (e.g., username already taken).
- **204 No Content**: Successfully deleted resource (no content to return).