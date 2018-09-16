const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users',
    [
      {
        firstName: 'Sudo',
        lastName: 'Admin',
        username: 'superadmin',
        email: 'superadmin@mail.com',
        role: 'superAdmin',
        hash: bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD, 10),
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
      },
      {
        firstName: 'author2',
        lastName: 'Author2',
        username: 'randomAuthor2',
        email: 'author2@mail.com',
        role: 'author',
        hash: bcrypt.hashSync(process.env.AUTHOR_PASSWORD, 10),
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
        firstName: 'Romeo',
        lastName: 'Canvas',
        username: 'romeo',
        email: 'romeo@mail.com',
        role: 'user',
        hash: bcrypt.hashSync(process.env.USER_PASSWORD, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
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
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
