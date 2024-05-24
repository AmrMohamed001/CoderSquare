# CoderSquare

CoderSquare is a web application built with Node.js and Express that provides APIs for managing posts, likes, comments, and user authentication. It also includes rate limiting, security features, and API documentation using Swagger.

## Project Idea

The idea behind CoderSquare is to create a platform where users can share posts about programming topics with useful URLs to other users, similar to [Hacker News](https://news.ycombinator.com/) But related to programming, like and comment on posts, and manage their user accounts. The application provides a set of RESTful APIs to perform these operations. It is designed to be a backend service that can be used by any frontend application, such as a web or mobile app.

The application is built using TypeScript and PostgreSQL as the database. It follows the repository pattern to define raw SQL queries for interacting with the database. For authentication, JWT is used. For the forgot password feature, Gmail is used to send a pin code to the user's email.

## UI Designs

In the `docs` folder under `ui designs`, you can find some screenshots of the application's user interface. Below are some key screenshots:

### Home Page

![Home Page](docs/ui%20designs/1%20home%20page.png)

### Sign Up Page

![Sign Up Page](docs/ui%20designs/6%20sign%20up%20page.png)

### Sign In Page

![Sign In Page](docs/ui%20designs/5%20sign%20in%20page.png)

### Comments Page (Add Comment)

![Comments Page (Add Comment)](<docs/ui%20designs/8%20comments%20page%20(add%20comment).png>)

Key features include:

- **User Authentication**: Secure user registration and login.
- **Post Management**: Create, read, update, and delete posts.
- **Likes and Comments**: Allow users to like and comment on posts.
- **Advanced Query Features**: Support for searching, sorting, selecting specific fields, filtering, limiting results, and pagination.

- **Rate Limiting**: Prevent abuse by limiting the number of requests from a single IP.
- **Security**: Implement security best practices such as data sanitization and HTTP parameter pollution prevention.
- **API Documentation**: Provide clear and interactive API documentation using Swagger.

## API Documentation

The API documentation is generated using Swagger. You can view it by navigating to `http://localhost:3000/api-docs` in your browser.

### Endpoints

### Posts

- **Get Posts**: `GET /posts/list`
- **Add Post**: `POST /posts/new`
- **Get Post by ID**: `GET /posts/{postId}`
- **Delete Post**: `DELETE /posts/{postId}`

### Likes

- **Like Post**: `POST /posts/{postId}/like`
- **Unlike Post**: `DELETE /posts/{postId}/like`

### Comments

- **Add Comment**: `POST /posts/{postId}/comments`
- **Get Comments**: `GET /posts/{postId}/comments`
- **Delete Comment**: `DELETE /posts/{postId}/comments/{commentId}`

### User Authentication

- **Register User**: `POST /auth/register`
- **Login User**: `POST /auth/login`
- **Forgot Password**: `POST /auth/forgot-password`
- **Reset Password**: `POST /auth/reset-password`
- **Change Password**: `POST /auth/change-password`
