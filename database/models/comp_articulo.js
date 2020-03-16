module.exports = (sequelize, dataTypes) => {
  let alias = "comp_articulo";
  let cols = {
    numero: {
      type: dataTypes.INTEGER,
      primaryKey: true
    },
    articulo_id: {
      type: dataTypes.STRING,
      allowNull : false
    },
    descripcion: {
      type: dataTypes.STRING,
      allowNull: false
    },
    cantidad : {
        type : dataTypes.INTEGER,
        allowNull : false
    },
    precio : {
        type : dataTypes.INTEGER,
        allowNull : false
    },
    despacho : {
        type : dataTypes.STRING,
        allowNull : true
    }
  };
  const Comp_articulo = sequelize.define(alias, cols, { timestamps: false, tableName : 'comp_articulo' });

  Comp_articulo.associate = function(models) {
      
    Comp_articulo.hasMany(models.articulos, {
      as: "articulos",
      foreignKey: "codigo"
    });
  };

  return Comp_articulo;
};
