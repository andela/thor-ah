module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('subscription', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Subscription.associate = (models) => {
    const { User } = models;
    // 1:m relationship
    Subscription.belongsTo(User, {
      as: 'subscriber', foreignKey: 'userId'
    });
  };
  return Subscription;
};
