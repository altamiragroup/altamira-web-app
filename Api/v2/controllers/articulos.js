const db = require('../../../database/models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sql = require("mssql");

module.exports = {
    articulos : async (req, res) => {
        let limit = parseInt(req.query.limit);
        let {linea, rubro, oem, destacados, nuevos, buscar} = req.query;

        let query = [];
        let queryBusqueda = [];

        if(linea) query.push({linea_id : linea})
        if(rubro) query.push({rubro_id : linea})
        if(oem) query.push({oem : {[Op.like]: '%'+ oem +'%' }})
        if(destacados) query.push({destacado : 1})
        if(nuevos) query.push({nuevo : 1})
        if(buscar){
            let params = String(buscar).split('*');
            params.forEach(item => {
                query.push({
                    [Op.or] : [
                        {codigo: {[Op.like]: '%'+ item +'%' }},
                        {oem: {[Op.like]: '%'+ item +'%' }},
                        {modelos: {[Op.like]: '%'+ item +'%' }},
                        {descripcion: {[Op.like]: '%'+ item +'%' }}
                    ]
                })
            })
            query.push()
        }
        try {
            let articulos = await db.articulos.findAll({
                where : {
                    [Op.and] : query
                },
                order : [ 
                    ['orden'],['linea_id'],['rubro_id'],['renglon'],['codigo']
                ],
                limit : limit ? limit : null,
                logging: false
            });
            return res
            .status(200)
            .json(articulos)
        }
        catch(err){
            return res
            .status(500)
            .json({
                message : 'Error',
                err
            })   
        }    
    },
    codigo : async (req, res) => {
        let codigo = req.params.codigo.replace('-','/')
        let comp = req.query.comp;
        let uses = req.query.uses;

        try {
            let articulo = await db.articulos.findOne({
                where : { codigo },
                logging: false,
                include : comp ?
                    [{ model: db.comprobantes, as : 'comprobantes', attributes : ['cliente_num','tipo','numero'] }]
                    :
                    '',
                order : [
                    [ db.comprobantes,'numero','desc'],
                    ['orden'],['linea_id'],['rubro_id'],['renglon'],['codigo']
                ],
                logging: false
            });
            let queryUses = []
            function traerUses(){
                let oem = articulo.oem.split('*');
                oem.forEach( item => { 
                    queryUses.push({oem: {[Op.like]: '%'+ item +'%' }}) 
                })
            }
            if(uses) traerUses();

            let usesArr = uses ? await db.articulos.findAll({
                    where : {
                        [Op.or] : queryUses
                    }
                })
                :
                [];

            if(uses){
                return res
                .status(200)
                .json({
                    articulo,
                    usesArr
                })
            } else {
                return res
                .status(200)
                .json(articulo)
            }
        }
        catch(err){
            return res
            .status(500)
            .json({
                message : 'Error',
                err
            })   
        } 

    },
    componentes : async (req, res) => {
        let articulo = req.params.codigo.replace('-','').split('');

        while(articulo.length < 9){
            articulo.unshift('0')
        } 
        articulo = articulo.join('');

        // config for your database
        var config = {
          user: "sa",
          password: "B0mbard3o!",
          server: "190.57.226.9",
          database: "DotAltamira"
        };
        let pool = await sql.connect(config)
        
        try {
            let result = await pool.request()
                .input('Codigo_Arme', articulo)
                //.input('@input_parameter', value)
                //.output('result', sql.VarChar(50))
                .execute('SP_CONSULTA_ARME')
                //.query('EXEC SP_CONSULTA_ARME @input_parameter')
            return res
                .status(200)
                .json({
                    message : 'success',
                    armes : result.recordset[0].cantidad
                })
            sql.on('error', err => {
                throw 'MSSQL Error'
            })
        }
        catch(e){
            return res
                .status(500)
                .json({
                    message : 'Query Error',
                    error: e
                })
        }
        finally {
            pool.close()
        }
    },
    actualizarStock: async (req, res) => {
        // reemplazar la query mssql
        try {
          let pool = await sql.connect(mssqlconfig);
          let insert = await pool
            .request()
            .query(`EXEC SP_ACTUALIZA_PREART_VPS`);    
          sql.on('error', err => {
            throw 'MSSQL Error';
          });
    
          pool.close();

          res.send('ok');
        } catch (err) {
          console.error({
            message: 'error al actualizar stock',
            err,
          });
          res.send(error);
        }
      },
}