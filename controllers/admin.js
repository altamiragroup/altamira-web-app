const db = require("../database/models");
const sequelize = db.sequelize;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const mssqlconfig = require('../database/config/mssqlConfig');
const sql = require("mssql");
const mailer = require('../helpers/mailHelp');
const revista_PDF = require('../helpers/pdf/revista.js');
const lista_precios_PDF = require('../helpers/pdf/lista_precios.js');
const comprobante_PDF = require('../helpers/pdf/comprobantes');

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
    clientes : async (req, res) => {
        let query = req.body.busqueda;
        let where = {};

        if(query){
            where = {
                [Op.and]: [{ 
                    [Op.or] : [
                        { numero : {[Op.like]: '%' + query + '%' }},
                        { direccion : {[Op.like]: '%' + query + '%' }},
                        { razon_social : {[Op.like]: '%' + query + '%' }}
                    ]
                }]
            }
        }

        try {
            let clientes = await db.clientes.findAll({
                where,
                limit : 50, 
			    logging: false,
                include : [{
                    model: db.usuarios, 
                    as: 'usuario', 
                    attributes : ['usuario','clave']
                }]
            })

            return res.render('admin/clientes',{ clientes })
        }
        catch(err){
            console.error(err)
        }
    },
    comprobantes : async (req, res) => {
        let query = req.body.busqueda;
        let where = {}

        if(query){
            where = {
                [Op.and]: [{
                    [Op.or]: [
                        { numero: { [Op.like]: "%" + query + "%" } },
                        { razon_social: { [Op.like]: "%" + query + "%" } }
                    ]
                }]
            }
        }

        try {
            let data = await db.clientes.findAll({
                where,
                limit : 50,
                logging : false,
                attributes : ['numero','razon_social'],
                include : [
                    { model: db.saldos, as: "saldo", attributes: ['saldo'], required: true},
                    { model: db.comprobantes, as : 'comprobantes' }
                ],
                order : ['razon_social', [ db.comprobantes, 'fecha', 'ASC']]
            });

            res.render('admin/comprobantes',{ data })
        }
        catch(err){
            console.error(err)
        }
    },
    detalle_comprobante : (req, res) => {
        let cliente = req.query.cliente;
        let tipo = req.query.tipo;
        let numero = req.params.numero;

        comprobante_PDF.comprobante(cliente, numero, tipo, res)
    },
    registro : (req, res) => {
        res.render('admin/registro')
    },
    prueba : async (req, res) => {
        
        try {
            comprobante_PDF.comprobante(5008, 79614, 'Factura', res)
        }
        catch(e){
            console.error(e)
        }
    },
    setRegistro : async (req, res) => {
        const { usuario, clave, tipo, numero } = req.body;

        try {
            let pool = await sql.connect(mssqlconfig);
            let user = await db.usuarios.create({ usuario, clave, tipo, numero });
            let insert = await pool.request()
                .input('usuario', usuario)
                .input('clave', clave)
                .input('numero',`00${numero}`)
                .query(`
                    UPDATE VTMCLH 
                    SET USR_VTMCLH_USERS=@usuario, 
                    USR_VTMCLH_USRPASS=@clave
                    WHERE VTMCLH_NROCTA=@numero 
                `)
            if(insert.rowsAffected.length < 3) return res.send('Usuario creado, falló al guardar en sofland')
            
            let user_data = await db.clientes.findAll({ where : { numero }, attributes : ['correo']})
            let send_mail = await mailer.registro(usuario, clave, user_data.correo);

            return res.send('Usuario creado')

            sql.on('error', err => {
                throw 'MSSQL Error'
            })
            pool.close()
        }
        catch(err){
            console.error({
                message: 'error en registro',
                err
            })
        }
    },
    seguimiento : async (req, res) => {
        let query = req.body.busqueda;
        let where = {};

        if(query){
            where = {
        		[Op.and]: [{
        		    [Op.or]: [
        		        { numero: { [Op.like]: "%" + query + "%" } },
        		        { direccion: { [Op.like]: "%" + query + "%" } },
        		        { razon_social: { [Op.like]: "%" + query + "%" } }
        		    ]
        		}]
        	}
        }

        try {
            let data = await db.clientes.findAll({
    		    where,
    		    attributes: ['numero',"razon_social"],
    		    include: [{
    		        model: db.seguimientos,
    		        as: "seguimientos",
    		        attributes: { exclude: ["cuenta"] },
    		        required: true
    		    }],
    		    order: ["razon_social"],
			    logging: false
    	    });

            res.render('admin/seguimientos',{ data })
        }
        catch(err){
            console.error(err)
        }
    },
    viajantes : async (req, res) => {
        let query = req.body.busqueda;
        let where = {};

        if(query){
            where = {
                [Op.and]: [{ 
                    [Op.or] : [
                        { numero : {[Op.like]: '%' + query + '%' }},
                        { nombre : {[Op.like]: '%' + query + '%' }},
                        { direccion : {[Op.like]: '%' + query + '%' }}
                    ]
                }]
            }
        }

        try {
            let viajantes = await db.viajantes.findAll({
                where,
                limit : 50, 
			    logging: false,
                include : [{
                    model: db.usuarios, 
                    as: 'usuario', 
                    attributes : ['usuario','clave']
                }]
            })

            return res.render('admin/viajantes',{ viajantes })
        }
        catch(err){
            console.error(err)
        }
    },
    cobranzas : async (req, res) => {
        let query = req.body.busqueda;
        try {
            let clientes = await db.clientes.findAll({
                    where : query ? 
                        {  
                            [Op.or]: [
                                { numero: { [Op.like]: "%" + query + "%" } },
                                { direccion: { [Op.like]: "%" + query + "%" } },
                                { razon_social: { [Op.like]: "%" + query + "%" } }
                            ]
                        }
                        :
                        {},
                    attributes: ["cod_postal", "razon_social", "precio_especial"],
                    include: [{
                            model: db.saldos,
                            as: "saldo",
                            attributes: ['saldo'],
                            required: true
                        },
                        {
                            model: db.comprobantes,
                            as: "comprobantes",
                            include: [{
                                model: db.seguimientos,
                                as: "seguimiento",
                                attributes: ["salida", "transporte"],
                                raw: true
                            }]
                        }
                    ],
                    order: ['cod_postal', 'razon_social', [db.comprobantes, 'fecha', 'ASC']],
                    logging: false,
                    limit : 50
                })
            
            return res.render("admin/cobranzas", {
                clientes
            });
        } 
        catch (err) {
            console.error({
                message: 'error Cobranzas',
                error: err
            })
        }
    },
    pedidos : async (req, res) => {
        try {
            let pedidos = await db.pedidos.findAll({
                include : [{ model: db.clientes, as: 'cliente', attributes: ['razon_social']}],
                limit : 100, 
                order : [['id', 'DESC']]
            });
            let nuevos = await pedidos.filter(pedido => pedido.estado != 0);
            let mas_comprados = await db.pedido_articulo.findAll({
                //include : [{model : db.articulos, as : 'articulo', attributes : ['descripcion']}],
                attributes: ['articulo_id', [sequelize.fn('sum', sequelize.col('cantidad')), 'cantidad']],
                group : 'articulo_id',
                order: [[sequelize.fn('sum', sequelize.col('cantidad')), 'DESC']],
                limit : 30
            })
            let pendientes = await db.pendientes.findAll({
                include : [{model: db.articulos, as : 'articulos', attributes : ['descripcion'], required : true}],
                order : [['cantidad','DESC']]
            })
            res.render('admin/pedidos',{
                pedidos,
                nuevos,
                mas_comprados,
                pendientes
            });
        }
        catch(err){
            console.error(err)
        }
    },
    revista : async (req, res) => {
        try {
            if(req.method == 'POST'){
                return revista_PDF(req, res)
            }
            let lineas = await db.lineas.findAll();
            let rubros = await sequelize.query('SELECT DISTINCT nombre FROM rubros ORDER BY nombre', {
                type: sequelize.QueryTypes.SELECT,
                logging: false
            });
            res.render('admin/revistas', {lineas, rubros})
        }
        catch(err){
            console.error(err)
        }
    },
    precios_pdf : (req, res) => {
        lista_precios_PDF(res)
    }
}