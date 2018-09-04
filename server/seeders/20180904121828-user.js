const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users',
    [
      {
        firstName: 'Some',
        lastName: 'Author',
        username: 'awesomeAuthor',
        email: 'sa@mail.com',
        role: 'admin',
        hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Some',
        lastName: 'User',
        username: 'randomUser',
        email: 'su@mail.com',
        role: 'user',
        hash: bcrypt.hashSync(process.env.USER_PASSWORD, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'author1',
        lastName: 'Author',
        username: 'randomAuthor1',
        email: 'author1@mail.com',
        role: 'author',
        hash: bcrypt.hashSync(process.env.AUTHOR_PASSWORD, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
