const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const queries = require('../helpers/adminQuery');
const mssqlconfig = require('../database/config/mssqlConfig');
const sql = require("mssql");

module.exports = {
    panel : async (req, res) =>{
        try {
            let pedidos = await db.pedidos.findAll({
                attributes : ['id','cliente_id','fecha'],
                include : [{ model: db.clientes, as: 'cliente', attributes: ['razon_social']}],
                order : [['fecha','DESC']],
                limit : 10,
                logging: false
            });
            return res.render('admin/panel', {
                pedidos
            });
        }
        catch(err){
            console.error(err)
        }
    },
    clientes : (req, res) => {
        let where = {};

        if(req.body.busqueda){
            where = { 
                [Op.and]: [{ 
                    [Op.or] : [
                        { numero : {[Op.like]: '%' + req.body.busqueda + '%' }},
                        { direccion : {[Op.like]: '%' + req.body.busqueda + '%' }},
                        { razon_social : {[Op.like]: '%' + req.body.busqueda + '%' }}
                    ]
                }]         
        	}
        }
        db.clientes.findAll({
            where,
            limit : 50, 
			logging: false,
            include : [{model: db.usuarios, as: 'usuario', attributes : ['usuario','clave']}]
        })
        .then(clientes => {
            res.render('admin/clientes',{
                clientes
            })
        })
    },
    comprobantes : (req, res) => {
        let where = {}

        if(req.body.busqueda){
            where = {
                [Op.and]: [
                  {
                    [Op.or]: [
                      { numero: { [Op.like]: "%" + req.body.busqueda + "%" } },
                      { razon_social: { [Op.like]: "%" + req.body.busqueda + "%" } }
                    ]
                  }
                ]
            }
        }
        db.clientes.findAll({
            where,
            limit : 50,
            logging : false,
            attributes : ['numero','razon_social'],
            include : [
                { model: db.saldos, as: "saldo", attributes: ['saldo'], required: true},
                { model: db.comprobantes, as : 'comprobantes' }
            ],
            order : ['razon_social', [ db.comprobantes, 'fecha', 'ASC']]
        })
        .then(data => {
            //return res.send(data)
            res.render('admin/comprobantes',{ data })
        })
    },
    registro : (req, res) => {
        res.render('admin/registro')
    },
    setRegistro : (req, res) => {
        const { usuario, clave, tipo, numero } = req.body;
        // registrar usuario en DB
        db.usuarios.create({ usuario, clave, tipo, numero })
        .then( result => {
            // registrar usuario en softland
            sql.connect(mssqlconfig, (err) => {
                if (err) console.log(err);

                let request = new sql.Request();
                let query = `
                    UPDATE VTMCLH 
                    SET USR_VTMCLH_USERS='${ usuario }' , USR_VTMCLH_USRPASS=${ clave }
                    WHERE VTMCLH_NROCTA='00${ numero }'        
                `;
                request.query(query, (err, result => {
                    if (err) console.log(err);
                    
                    return res.send('usuario creado exitosamente, registro en Softland: ' + result)
                }))
            })
        })
        .catch( error => res.send(error))
    },
    seguimiento : (req, res) => {
        let where = {};

        if(req.body.busqueda){
            where = {
        		[Op.and]: [
        		  {
        		    [Op.or]: [
        		      { numero: { [Op.like]: "%" + req.body.busqueda + "%" } },
        		      { direccion: { [Op.like]: "%" + req.body.busqueda + "%" } },
        		      { razon_social: { [Op.like]: "%" + req.body.busqueda + "%" } }
        		    ]
        		  }
        		]
        	}
        }

        db.clientes.findAll({
    		where,
    		attributes: ['numero',"razon_social"],
    		include: [{
    		    model: db.seguimientos,
    		    as: "seguimientos",
    		    attributes: { exclude: ["cuenta"] },
    		    required: true
    		    }
            ],
    		order: ["razon_social"],
			logging: false
    	})
        .then(data => {
            //return res.send(data)
            res.render('admin/seguimientos',{
                data
            })
        })
        .catch(error => console.log(error))
    }
}