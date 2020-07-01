module.exports = (sequelize, dataTypes) => {
  let alias = "articulos";
  let cols = {
    id: {
      autoIncrement: true,
      type: dataTypes.INTEGER
    },
    codigo: {
      primaryKey: true,
      type: dataTypes.STRING,
      allowNull: false
    },
    oem: {
      type: dataTypes.STRING
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
      type: dataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    orden: {
      type: dataTypes.INTEGER
    },
    nuevo: {
      type: dataTypes.INTEGER,
      allowNull: false
    }
  };
  const Articulo = sequelize.define(alias, cols, { timestamps: false });

  Articulo.associate = function(models) {

    Articulo.belongsToMany(models.comprobantes, {
        as: 'comprobantes',
        through: "comp_articulo",
        foreignKey: "articulo_id",
        otherKey: "numero",
        timestamps: false
    }),
    Articulo.belongsTo(models.rubros, {
        as: "rubro",
        foreignKey: "rubro_id"
    }),
    Articulo.belongsTo(models.sub_rubros, {
        as: "sub_rubro",
        foreignKey: "sub_rubro_id"
    }),
    Articulo.hasOne(models.lineas, {
        as : 'linea',
        foreignKey : 'id'
    }),
    Articulo.belongsToMany(models.clientes, {
        as: "clientes",
        through: "pendientes",
        foreignKey: "articulo",
        otherKey: "cliente",
        timestamps: false
     }),
    Articulo.belongsToMany(models.pedidos, {
        as: "pedido",
        through: "pedido_articulo",
        foreignKey: "articulo_id",
        otherKey: "pedido_id",
        timestamps: false
     })
  };

  Articulo.prototype.conGuion = function(){
    return this.codigo.replace('/','-');
  };

  Articulo.prototype.validarStock = function(){

    let art = this.codigo;
    let stock = this.stock;

    if(stock == 1){ 
      return true 
      } else { 
        return false 
        } 
  };

  return Articulo;
};
