
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    reply: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'comment cannot be empty'
        },
        len: {
          args: [2],
          msg: 'comment cannot be less than two characters long'
        }
      },
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
