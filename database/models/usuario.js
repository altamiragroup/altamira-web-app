module.exports = (sequelize, dataTypes) => {
  let alias = 'usuarios';
  let cols = {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: dataTypes.INTEGER,
    },
    usuario: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    clave: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };
  const Usuario = sequelize.define(alias, cols, { timestamps: false });

  Usuario.associate = function (models) {
    Usuario.belongsTo(models.clientes, {
      as: 'cliente',
      foreignKey: 'numero',
    }),
      Usuario.belongsTo(models.viajantes, {
        as: 'viajante',
        foreignKey: 'numero',
      });
  };

  return Usuario;
};
