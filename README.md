## Requirement

Objective:
Develop a RESTful API for a cat adoption agency. The API will manage cat profiles, and user interactions.

Key Features:
• Cat Profiles: Create, read, update, and delete profiles for cats available for adoption.

• User Authentication: Secure user registration and login functionality.

• Favorites: Allow authenticated users to mark cats as favorites.

Technical Specifications:

• Implement TypeORM with a PostgreSQL database for data persistence.

• Utilize Passport.js for user authentication with JWT tokens.

• Apply class-validator and class-transformer for input validation and serialization.

Endpoints to Implement:
• POST /auth/register: Register a new user.

• POST /auth/login: Authenticate a user and return a JWT.

• GET /cats: Retrieve a list of all cats.

• POST /cats: Create a new cat profile (admin only).

• GET /cats/{id}: Retrieve a cat profile by ID.

• PUT /cats/{id}: Update a cat profile by ID (admin only).

• DELETE /cats/{id}: Delete a cat profile by ID (admin only).

Submission Guidelines:
• Push the code to your GitHub repository and send the link to us.

• Include a README.md with setup instructions, how to run the application, and a summary of the technologies used.

Evaluation Criteria:
• Functionality: All endpoints work as expected and meet the requirements.

• Code Quality: Clean, organized, and well-documented code.

• Security: Proper implementation of authentication and authorization checks.

• Testing: Unit and integration tests for key components and endpoints.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


##### Seeding

1. Install ORM
npm install --save @nestjs/typeorm typeorm pg
npm install --save @nestjs/jwt
npm install dotenv

2. Configure Users, Auth, Favorites

nest g resource users --no-spec
nest g resource auth --no-spec
nest g resource favorites --no-spec


3. migrations
npm run migration:create --name=users
npm run migrate