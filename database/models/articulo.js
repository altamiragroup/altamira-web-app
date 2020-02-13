module.exports = (sequelize, dataTypes) => {
  let alias = "articulos";
  let cols = {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: dataTypes.INTEGER
    },
    codigo: {
      type: dataTypes.STRING,
      allowNull: false
    },
    oem: {
      type: dataTypes.STRING
    },
    tipo: {
      type: dataTypes.STRING,
      allowNull: false
    },
    modelos: {
      type: dataTypes.STRING,
      allowNull: false
    },
    rubro_id: {
      type: dataTypes.INTEGER
    },
    sub_rubro_id: {
      type: dataTypes.INTEGER
    },
    renglon: {
      type: dataTypes.INTEGER
    },
    linea_id: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    descripcion: {
      type: dataTypes.STRING,
      allowNull: false
    },
    caracteristicas: {
      type: dataTypes.STRING,
      allowNull: false
    },
    precio: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    unidad_min_vta: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    proveedor: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    stock: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    destacado: {
      type: dataTypes.INTEGER
    },
    estado: {
      type: dataTypes.INTEGER
    },
    orden: {
      type: dataTypes.INTEGER
    }
  };
  const Articulo = sequelize.define(alias, cols, { timestamps: false });

  Articulo.associate = function(models) {

    Articulo.belongsToMany(models.pedidos, {
        as: 'pedido',
        through: "pedido_articulo",
        foreignKey: "id",
        otherKey: "pedido_id",
        timestamps: false
    }),
    Articulo.belongsToMany(models.comprobantes, {
        as: 'comprobante',
        through: "comp_articulo",
        foreignKey: "id",
        otherKey: "numero",
        timestamps: false
    }),
    Articulo.belongsTo(models.rubros, {
        as: "rubro",
        foreignKey: "id"
    }),
    Articulo.hasMany(models.sub_rubros, {
        as: "sub_rubro",
        foreignKey: "id"
    }),
    Articulo.hasMany(models.lineas, {
        as : 'linea',
        foreignKey : 'id'
    })
  };

  return Articulo;
};
