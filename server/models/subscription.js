module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plan: {
      type: DataTypes.ENUM('basic', 'premium'),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    transactionKey: {
      type: DataTypes.STRING,
    }
  }, {});
  Subscription.associate = (models) => {
    const { User } = models;
    // 1:m relationship
    Subscription.belongsTo(User, {
      as: 'subscriber',
      foreignKey: 'userId'
    });
  };
  return Subscription;
};
