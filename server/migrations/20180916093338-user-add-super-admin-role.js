module.exports = {
  up: queryInterface => queryInterface.sequelize
    .query(`
        ALTER TYPE "enum_Users_role" ADD VALUE 'superAdmin';
      `),

  down: queryInterface => queryInterface.sequelize
    .query(`
      CREATE TYPE "enum_Users_role_new"
        AS ENUM('admin', 'user', 'author');
      ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;
      DELETE FROM "Users" WHERE "role" = 'superAdmin';
      ALTER TABLE "Users"
        ALTER COLUMN "role" TYPE "enum_Users_role_new"
          USING ("role"::text::"enum_Users_role_new");
      DROP TYPE "enum_Users_role";
      ALTER TYPE "enum_Users_role_new" RENAME TO "enum_Users_role";
      `),
};
