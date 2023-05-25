# Clothing Ecommerce API

This is an API for a clothing e-commerce project developed with Node.js and Express.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Environment Variables](#environment-variables)
- [Dependencies](#dependencies)
- [Contribution](#contribution)
- [License](#license)

## Requirements

- Node.js
- npm or yarn

## Installation

1. Clone this repository.
2. Run `npm install` to install the dependencies.

## Usage

1. Run `npm run start:dev` to start the server.
2. Access the API via `http://localhost:8080`.

* * *
## Endpoints

### Products:
*GET /api/products: Get all products. (Authorization required: user, admin)
*GET /api/products/:pid: Get a specific product by ID. (Authorization required: user, admin)
*POST /api/products: Create a new product. (Authorization required: admin)
*PUT /api/products/:id: Update a product by ID. (Authorization required: admin)
*DELETE /api/products/:pid: Delete a product by ID. (Authorization required: admin)
### Cart:
*GET /api/cart: Get all carts. (Authorization required: user, admin)
*GET /api/cart/:id: Get a specific cart by ID. (Authorization required: user, admin)
*POST /api/cart: Create a new cart.
*DELETE /api/cart/:cid/product/:pid: Delete a product from a cart. (Authorization required: user)
*DELETE /api/cart/:cid: Delete all products from a cart. (Authorization required: user)
*POST /api/cart/:cid/product/:pid: Add a product to a cart. (Authorization required: user)
*PUT /api/cart/:cid/product/:pid: Modify the quantity of a product in a cart. (Authorization required: user)
*POST /api/cart/:cid/purchase: Purchase the items in a cart. (Authorization required: user, admin)
*GET /api/cart/ticket/:tid: Get a specific ticket by ID.
*DELETE /api/cart/ticket/:tid: Delete a specific ticket by ID.
*GET /api/cart/tickets/all: Get all tickets.
### User:
*GET /api/user/failurelogin: Handle failure during login.
*GET /api/user/failureregister: Handle failure during registration.
*POST /api/user/logout: Logout the user.
*GET /api/user/unauthorized: Handle unauthorized access.
*POST /api/user/restore-password: Restore password.
*GET /api/user/google-callback: Google OAuth2 callback.
*GET /api/user/google: Authenticate with Google OAuth2.
*GET /api/user/github-callback: GitHub OAuth callback.
*GET /api/user/github: Authenticate with GitHub OAuth.
*GET /api/user/current: Get the current user's information. (Authentication required)
*POST /api/user/register: Register a new user.
*POST /api/user/login: Login with existing credentials.
###  View:
*GET /register: View the registration form.
*GET /login: View the login form.
*GET /forgot-password: View the forgot password form.
*GET /: View the products. (Authorization required: user, admin)
*GET /view/product/:pid: View a specific product. (Authorization required: user, admin)
*GET /view/cart/:cid: View a specific cart. (Authorization required: user, admin)
*GET /realtimeproducts: View the products in real-time. (Authorization required: admin)
*GET /chat: View the real-time chat. (Authorization required: user)
*GET /profile: View the user profile. (Authorization required: user, admin)
*GET /purchase: View the purchase page. (Authorization required: user)
*GET /view/purchase/:tid: View a specific order. (Authorization required: user)

***
## Environment Variables

This project uses environment variables to configure certain values. Below is an example of the `.env-example` file that you can use as a template to create your `.env` file. Fill in the values for each variable according to your specific configuration:

*PORT: The port number on which the server will run.
*MONGO_URI: The MongoDB connection URI.
*COOKIE_SECRET: The secret key used for signing cookies.
*JWT_SECRET: The secret key used for signing JSON Web Tokens.
*GITHUB_CLIENT_ID: The client ID for GitHub OAuth.
*GITHUB_CLIENT_SECRET: The client secret for GitHub OAuth.
*GITHUB_CALLBACK_URL: The callback URL for GitHub OAuth.
*ADMIN_PASSWORD: The password for the admin user.
*ADMIN_EMAIL: The email address for the admin user.
*GOOGLE_CLIENT_ID: The client ID for Google OAuth.
*GOOGLE_CLIENT_SECRET: The client secret for Google OAuth.
*GOOGLE_CALLBACK_URL: The callback URL for Google OAuth.
*PERSISTENCE: The persistence setting (e.g., 'session', 'cookie').
*GOOGLE_MAILER: The email address for the Google Mailer.

Make sure to create a `.env` file in the root of your project based on the `.env-example` template, and replace the placeholder values with your actual configuration.

Ensure that you replace the placeholder values with your actual configuration for each variable in your `.env` file.

Remember to keep your .env file secure and never commit it to a public repository.

## Dependencies

Here are the dependencies used in the project:

- `@handlebars/allow-prototype-access`: Allows prototype access in Handlebars templates.
- `bcrypt`: Library for password hashing.
- `connect-mongo`: Stores Express sessions in MongoDB.
- `cookie-parser`: Middleware for handling cookies in Express.
- `cors`: Middleware for enabling CORS in Express.
- `dotenv`: Loads environment variables from a `.env` file.
- `express`: Node.js framework for building web applications.
- `express-handlebars`: Template engine for Express based on Handlebars.
- `express-session`: Middleware for session management in Express.
- `jsonwebtoken`: Library for generating and verifying authentication tokens.
- `moment`: Library for manipulating and formatting dates and times.
- `mongoose`: MongoDB object modeling tool (ODM).
- `mongoose-paginate-v2`: Pagination for MongoDB queries with Mongoose.
- `multer`: Middleware for handling file uploads in Express.
- `nodemailer`: Library for sending emails.
- `passport`: Authentication middleware for Express.
- `passport-github2`: Passport authentication strategy for GitHub.
- `passport-google-oauth20`: Passport authentication strategy for Google OAuth 2.0.
- `passport-jwt`: Passport authentication strategy for JSON Web Tokens (JWT).
- `passport-local`: Passport authentication strategy for local authentication.
- `socket.io`: Library for real-time communication based on WebSocket.
- `sweetalert2`: Library for displaying custom alerts and dialogs in the browser.
- `uuid`: Generates unique identifiers.

## Contribution

If you'd like to contribute to this project, you can follow these steps:

1. Fork this repository.
2. Create a branch with your new feature: `git checkout -b feature/new-feature`.
3. Make the necessary changes and commit: `git commit -m "Add new feature"`.
4. Push the changes to your remote repository: `git push origin feature/new-feature`.
5. Open a pull request in this repository.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more information.
