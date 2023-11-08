## Contacts API
## Technologies

The project was created on the [Node.js](https://nodejs.org/en/docs/) platform using [Express](https://devdocs.io/express/) framework

Communication with the database is provided by using [mongoose](https://mongoosejs.com/docs/documents.html) library through the [MongoDB](https://www.mongodb.com/docs/) database management system

## API description

REST endpoints implemented for contacts operations:
 - Get all contacts
 - Get single contact
 - Create new contact
 - Update existing contact or its status
 - Delete contact

REST endpoints implemented for users operations:
 - Sign up
 - Sign in
 - Logout
 - Get current user
 - Update avatar
 - Verify Email

### Commands:

- `npm install` &mdash; install dependencies
- `npm start` &mdash; server start in production mode
- `npm run start:dev` &mdash; start the server in development mode
- `npm run lint` &mdash; run eslint to check for code errors, should be executed before every PR and fix all linter errors
- `npm lint:fix` &mdash; run eslint and automatically fix simple errors
