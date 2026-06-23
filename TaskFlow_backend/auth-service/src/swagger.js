const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'User registration, profiles and authentication for TaskFlow'
    },
    servers: [{ url: 'http://localhost:3000' }]
  },
  // path.join + __dirname so this works regardless of the working
  // directory you run `npm start` from
  apis: [path.join(__dirname, 'routes/*.js')]
};

module.exports = swaggerJsdoc(options);