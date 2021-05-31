module.exports = (sequelize, dataTypes) => {
  let alias = 'viajantes';
  let cols = {
    numero: {
      primaryKey: true,
      type: dataTypes.INTEGER,
    },
    nombre: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    codigo_postal: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    jurisdiccion: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  };
  const Viajante = sequelize.define(alias, cols, { timestamps: false });

  Viajante.associate = function (models) {
    Viajante.belongsTo(models.usuarios, {
      as: 'usuario',
      foreignKey: 'numero',
    }),
      Viajante.hasMany(models.clientes, {
        as: 'cliente',
        foreignKey: 'numero',
      });
  };

  return Viajante;
};
