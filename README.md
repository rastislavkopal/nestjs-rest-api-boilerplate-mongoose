<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Fact checking API

[![users_service CI](https://github.com/rastislavkopal/fact_checking_ts/actions/workflows/users_service.yml/badge.svg)](https://github.com/rastislavkopal/fact_checking_ts/actions/workflows/users_service.yml)

## Features

- framework TypeScript starter repository([Nest](https://github.com/nestjs/nest))
- ES2017 latest features like Async/Await
<!-- - CORS enabled -->
- Uses [npm](https://www.npmjs.com/)
- Express + MongoDB ([Mongoose](http://mongoosejs.com/))
- Consistent coding styles with [editorconfig](http://editorconfig.org)
- [Docker](https://www.docker.com/) support
<!-- - Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
- Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
- Request validation with [joi](https://github.com/hapijs/joi)
- Gzip compression with [compression](https://github.com/expressjs/compression)
- Linting with [eslint](http://eslint.org)
- Tests with [mocha](https://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org)
- Code coverage with [istanbul](https://istanbul.js.org) and [coveralls](https://coveralls.io) -->
- Git hooks with [husky](https://github.com/typicode/husky)
<!-- - Logging with [morgan](https://github.com/expressjs/morgan) -->
- Authentication and Authorization with [passport](http://passportjs.org)
<!-- - API documentation generation with [apidoc](http://apidocjs.com) -->
- Continuous integration support with Github Actions
<!-- - Monitoring with [pm2](https://github.com/Unitech/pm2) -->

## Requirements

- [Node v16.6+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
- [npm](https://www.npmjs.com/)

## Getting Started

#### Install dependencies:

```bash
npm install
```

#### Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
# development
$ npm run run start

# watch mode
$ npm run run start:dev

# production mode
$ npm run run start:prod
```

## Running in Production

```bash
npm run start
```

## Lint

```bash
# lint code with ESLint
npm run lint
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

## Validate

```bash
# run lint and tests
npm run lint
```

<!-- ## Docker

```bash
# run container locally
npm run docker:dev

# run container in production
npm run docker:prod

# run tests
npm run docker:test
``` -->
