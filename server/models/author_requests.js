module.exports = (sequelize, DataTypes) => {
  const AuthorRequests = sequelize.define('AuthorRequests', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('accepted', 'rejected', 'pending'),
      allowNull: false,
    },
    feedback: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {});
  AuthorRequests.associate = (models) => {
    const { User } = models;
    AuthorRequests.belongsTo(User, {
      onDelete: 'CASCADE',
      foreignKey: 'userId'
    });
  };
  return AuthorRequests;
};
