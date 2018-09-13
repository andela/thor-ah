module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: DataTypes.INTEGER,
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    articleSlug: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'message']
      }
    ]
  });
  Notification.associate = (models) => {
    const { User } = models;

    Notification.belongsTo(User, {
      as: 'user', foreignKey: 'userId'
    });
  };
  return Notification;
};
