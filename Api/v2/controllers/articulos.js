const db = require('../../../database/models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
/*const sql = require("mssql");*/
const { getConnection, sql: mssql } = require('../../../database/config/sqlserver');



module.exports = {
    articulos: async (req, res) => {
        let limit = parseInt(req.query.limit);
        let { linea, rubro, oem, destacados, nuevos, buscar } = req.query;

        let query = [];
        let queryBusqueda = [];

        if (linea) query.push({ linea_id: linea })
        if (rubro) query.push({ rubro_id: rubro })
        if (oem) query.push({ oem: { [Op.like]: '%' + oem + '%' } })
        if (destacados) query.push({ destacado: 1 })
        if (nuevos) query.push({ nuevo: 1 })
        if (buscar) {
            let params = String(buscar).split('*');
            params.forEach(item => {
                query.push({
                    [Op.or]: [
                        { codigo: { [Op.like]: '%' + item + '%' } },
                        { oem: { [Op.like]: '%' + item + '%' } },
                        { modelos: { [Op.like]: '%' + item + '%' } },
                        { descripcion: { [Op.like]: '%' + item + '%' } }
                    ]
                })
            })
        }
        try {
            let articulos = await db.articulos.findAll({
                where: {
                    [Op.and]: query
                },
                order: [
                    ['orden'], ['linea_id'], ['rubro_id'], ['renglon'], ['codigo']
                ],
                limit: limit ? limit : null,
                logging: false
            });
            return res
                .status(200)
                .json(articulos)
        }
        catch (err) {
            console.error('🔥 ERROR ARTICULOS:', err);
                
            return res
                .status(500)
                .json({
                    message: 'Error',
                    err
                })
        }
    },
    codigo: async (req, res) => {
        let codigo = req.params.codigo.replace('-', '/')
        let comp = req.query.comp;
        let uses = req.query.uses;

        try {
            let articulo = await db.articulos.findOne({
                attributes: ['codigo', 'precio', 'unidad_min_vta', 'stock', 'proveedor', 'oem', 'descripcion', 'modelos', 'estado', 'linea_id', 'costo1'],
                where: { codigo },
                logging: false,
                include: comp ?
                    [{ model: db.comprobantes, as: 'comprobantes', attributes: ['cliente_num', 'tipo', 'numero'] }]
                    :
                    '',
                order: [
                    [db.comprobantes, 'numero', 'desc'],
                    ['orden'], ['linea_id'], ['rubro_id'], ['renglon'], ['codigo']
                ],
                logging: false
            });
            let queryUses = []
            function traerUses() {
                let oem = articulo.oem.split('*');
                oem.forEach(item => {
                    queryUses.push({ oem: { [Op.like]: '%' + item + '%' } })
                })
            }
            if (uses) traerUses();

            let usesArr = uses ? await db.articulos.findAll({
                where: {
                    [Op.or]: queryUses
                }
            })
                :
                [];

            if (uses) {
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
        catch (err) {
            return res
                .status(500)
                .json({
                    message: 'Error',
                    err
                })
        }

    },
    costo1: async (req, res) => {
        let codigo = req.params.codigo.replace('-', '/');

        try {
            let articulo = await db.articulos.findOne({
                where: { codigo },
                attributes: ['codigo', 'descripcion', 'costo1'], // solo traés lo que necesitas
                logging: false
            });

            if (!articulo) {
                return res.status(404).json({ message: 'Articulo no encontrado' });
            }

            return res.status(200).json(articulo);

        } catch (error) {
            return res.status(500).json({
                message: 'Error al consultar costo1',
                error
            });
        }
    },
    /*actualizarStock: async (req, res) => {
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
    },*/
    update: async (req, res) => {

        const ipRaw =
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            req.ip;

        const ip = ipRaw ? ipRaw.split(',')[0].trim() : null;

        const { literal } = require('sequelize')
        const { codigo, oem, descripcion, modelos, caracteristicas, flag } = req.body;

        try {

            let articulo = await db.articulos.findOne({
                where: { codigo },
                logging: false
            });

            if (!articulo) {
                return res.status(404).json({
                    message: 'Artículo no encontrado'
                });
            }

            const cambios = (
                articulo.oem !== oem ||
                articulo.descripcion !== descripcion ||
                articulo.modelos !== modelos ||
                articulo.caracteristicas !== caracteristicas                
            );

            if (!cambios) {
                return res.status(200).json({
                    ok: true,
                    message: 'Sin cambios'
                });
            }
            console.log('IP detectada:', ip);
            // ✅ UPDATE MYSQL SOLO SI CAMBIÓ
            await articulo.update({
                oem,
                descripcion,
                modelos,
                caracteristicas,
                flag: 1,
                updated_by: ip
            });

            // 💣 UPDATE SQL SERVER
            try {
                const pool = await getConnection();

                await pool.request()
                    .input('codigo', mssql.VarChar, codigo)
                    .input('oem', mssql.VarChar, oem)
                    .input('descripcion', mssql.VarChar, descripcion)
                    .input('modelos', mssql.VarChar, modelos)
                    .input('caracteristicas', mssql.VarChar, caracteristicas)
                    .input('flag', mssql.VarChar, flag)
                    .query(`
            UPDATE articulos
            SET 
                oem = @oem,
                descripcion = @descripcion,
                modelos = @modelos,
                caracteristicas = @caracteristicas,
                flag = 1
            WHERE codigo = @codigo
        `);
                if (articulo.oem !== oem) console.log('Cambió OEM');
                if (articulo.descripcion !== descripcion) console.log('Cambió descripción');
                if (articulo.modelos !== modelos) console.log('Cambió modelos');
                if (articulo.caracteristicas !== caracteristicas) console.log('Cambió características');

                console.log('🟢 SQL Server actualizado');

            } catch (err) {
                console.error('🔴 Error SQL Server:', err);
            }

            return res.status(200).json({
                ok: true
            });

        } catch (err) {
            console.error('Error al actualizar:', err);
            return res.status(500).json({
                message: 'Error al actualizar artículo',
                err
            });
        }
    },
}