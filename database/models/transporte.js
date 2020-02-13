module.exports = (sequelize, dataTypes) => {
  let alias = "transportes";
  let cols = {
    id: {
      primaryKey: true,
      type: dataTypes.INTEGER
    },
    nombre: {
      type: dataTypes.STRING,
      allowNull: false
    },
    direccion: {
      type: dataTypes.STRING,
      allowNull: false
    },
    codigo_postal: {
      type: dataTypes.STRING,
      allowNull: false
    },
    telefono: {
      type: dataTypes.INTEGER,
      allowNull: false
    }
  };
  const Transporte = sequelize.define(alias, cols, { timestamps: false });

  Transporte.associate = function(models) {
      Transporte.hasMany(models.clientes,{
        as: "clientes",
        foreignKey: "id"
      })
      Transporte.hasMany(models.pedidos, {
        as: 'pedidos',
        foreignKey: 'id'
      })
  };

  return Transporte;
};
