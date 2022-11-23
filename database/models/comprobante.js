module.exports = (sequelize, dataTypes) => {
  let alias = 'comprobantes';
  let cols = {
    cliente_num: {
      type: dataTypes.INTEGER,
    },
    tipo: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    numero: {
      primaryKey: true,
      type: dataTypes.INTEGER,
    },
    fecha: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    cae: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    transporte: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    pre_esp: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    perc_ARBA: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };
  const Comprobante = sequelize.define(alias, cols, { timestamps: false });

  Comprobante.associate = function (models) {
    Comprobante.belongsTo(models.clientes, {
      as: 'cliente',
      foreignKey: 'cliente_num',
    }),
      Comprobante.belongsTo(models.seguimientos, {
        as: 'seguimiento',
        foreignKey: 'numero',
      }),
      Comprobante.hasMany(models.comp_articulo, {
        as: 'articulos',
        foreignKey: 'numero',
      });
    //Comprobante.belongsToMany(models.articulos, {
    //  as: "articulos",
    //  through: "comp_articulo",
    //  foreignKey: "numero",
    //  otherKey: "articulo_id",
    //  timestamps: false
    //})
  };

  Comprobante.prototype.tipoComp = function () {
    let arr = this.tipo.split(' ');
    return arr[0];
  };

  Comprobante.prototype.formatDate = function () {
    let yyyy = this.fecha.getFullYear();
    let mm = this.fecha.getMonth() + 1;
    let dd = this.fecha.getDate();

    return `${dd}/${mm}/${yyyy}`;
  };
  return Comprobante;
};
