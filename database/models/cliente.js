module.exports = (sequelize, dataTypes) => {
let alias = 'clientes';
let cols = {
    numero : {
        primaryKey : true,
        type : dataTypes.INTEGER
    },
    razon_social : {
        type : dataTypes.STRING,
        allowNull : false
    },
    situacion_iva : {
        type : dataTypes.STRING,
        allowNull : false
    },
    cuit : {
        type : dataTypes.STRING,
        allowNull : false
    },
    direccion : {
        type : dataTypes.STRING,
        allowNull : false
    },
    telefono : {
        type : dataTypes.STRING,
        allowNull : false
    },
    correo : {
        type : dataTypes.STRING,
        allowNull : false
    },
    viajante_id : {
        type : dataTypes.INTEGER,
        allowNull : false
    },
    condicion_pago : {
        type : dataTypes.STRING,
        allowNull : false
    },
    precio_especial : {
        type : dataTypes.STRING,
    },
    transporte : {
        type : dataTypes.STRING,
        allowNull : false
    }
}
const Cliente = sequelize.define(alias, cols, { timestamps: false });

Cliente.associate = function(models){
    
      Cliente.hasOne(models.usuarios, {
        as: "usuario",
        foreignKey: "numero"
      }),
      Cliente.belongsTo(models.viajantes, {
        as: "viajante",
        foreignKey: "viajante_id"
      }),
      Cliente.belongsTo(models.saldos, {
        as: "saldo",
        foreignKey: "numero"
      }),
      Cliente.hasMany(models.pedidos, {
        as: "pedidos",
        foreignKey: "cliente_id"
      }),
      Cliente.hasMany(models.comprobantes, {
          as: "comprobantes",
          foreignKey: "cliente_num"
      }),
      Cliente.hasMany(models.seguimientos, {
          as: "seguimientos",
          foreignKey: "cuenta"
      }),
      Cliente.belongsToMany(models.articulos, {
          as: "articulos",
          through: "pendientes",
          foreignKey: "cliente",
          otherKey: "articulo",
          timestamps: false
      })
}

    return Cliente;
}