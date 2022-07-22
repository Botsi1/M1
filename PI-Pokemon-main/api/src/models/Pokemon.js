const { UUIDV4 } = require('sequelize');
const { DataTypes } = require('sequelize');



mmodule.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
     name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    types: {
      type: DataTypes.STRING,//completar con ENUM()
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
     defense: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
     speed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
     height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
   weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    //agregar imagen aca
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   createdInDb:{
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:true,
   }
  });
};
