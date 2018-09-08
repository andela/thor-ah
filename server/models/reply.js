
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    reply: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {});
  Reply.associate = (models) => {
    const { Comment, User } = models;
    Reply.belongsTo(Comment, {
      onDelete: 'CASCADE',
      foreignKey: 'commentId',
      as: 'comment'
    });

    Reply.belongsTo(User, {
      as: 'commenter',
      onDelete: 'CASCADE',
    });
  };
  return Reply;
};
