module.exports = (sequelize, DataTypes) => {
  const AuthorRequests = sequelize.define('AuthorRequests', {
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
