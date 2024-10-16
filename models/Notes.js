module.exports = (sequelize, DataTypes) => {
    const Notes = sequelize.define("Notes", {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      DocumentLink:{
        type: DataTypes.STRING,
        allowNull: false
      },
    }, {
      createdAt:'TimeStamp',
      updatedAt:false,
    });
    return Notes;
  };
  