
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    reply: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {});
  Reply.associate = (models) => {
    const { Comment, User } = models;
    Reply.belongsTo(Comment);

    Reply.belongsTo(User);
  };
  return Reply;
};
