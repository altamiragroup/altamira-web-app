const PDFDocument = require('pdfkit');
const fs = require('fs');
const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const path = require('path');

module.exports = async (req, res) => {
    try {
        const lineas = req.body.linea_id;
        const rubros = req.body.rubro;
        const proveedor = req.body.proveedor;
        const modelos = req.body.modelos;
        const descripcion = req.body.descripcion;
        const destacados = req.body.destacados;
        const nuevos = req.body.nuevos;
        let items = [];

        // nuevos
        if(nuevos) items.push({nuevo : 1})

        // destacados
        if(destacados) items.push({destacado : 1})

        // lineas
        if(lineas){
            if(typeof lineas === 'string'){
                items.push({[Op.or] : { linea_id : lineas}})
            } else {
                let filtros = [];
                for(num of lineas){
                    console.log(lineas)
                    filtros.push({linea_id : num})
                }
                items.push({[Op.or] : filtros})
            }
        }

        // rubros
        if (rubros) {
            if(typeof rubros === 'string'){
                let rubro = await db.rubros.findOne({
                    where : {
                        nombre : rubros
                    }
                })
                items.push({[Op.or] : { rubro_id : rubro.id}})
            } else {
                let filtros = [];
                let rubrosWhere = []; // filtro de nombres
                for (item of rubros) {
                    rubrosWhere.push({
                        nombre: item
                    })
                }
                // buscar rubros con los nombres recibidos
                let rubros_db = await db.rubros.findAll({
                    where: {
                        [Op.or]: rubrosWhere
                    },
                    attributes: ['id'],
                    logging: false
                })
                for (rubro of rubros_db) {
                    filtros.push({
                        rubro_id: rubro.id
                    })
                }
                // sumar rubros al filtro
                items.push({
                    [Op.or]: filtros
                })
            }
        }

        // descripciones
        if(descripcion){
            let filtros = [];
            let items = descripcion.trim().split(" ")
            for(item of items){
                filtros.push({
                    [Op.or] : [
                        {descripcion: {[Op.like]: '%'+ item +'%' }},
                        {caracteristicas: {[Op.like]: '%'+ item +'%' }},
                    ]
                })
            }
            items.push(filtros)
        }
        if(modelos){
            console.log(modelos)
            let filtros = [];
            let models = modelos.trim().split(" ")
            for(item of models){
                console.log(item)
                filtros.push({
                    [Op.or] : [
                        {modelos: {[Op.like]: '%'+ item +'%' }}
                    ]
                })
            }
            items.push(filtros)
        }
        if(proveedor){
            let filtros = [];
            let items = proveedor.trim().split(" ")
            for(item of items){
                filtros.push({
                    [Op.or] : [
                        {proveedor: {[Op.like]: '%'+ item +'%' }}
                    ]
                })
            }
            items.push(filtros)
        }

        // agregar array de filtros al where
        where = {
            estado: 1,
            [Op.and]: items
        }

        // traer articulos
        let articulos = await db.articulos.findAll({
            where : where,
            order : [ 
                ['orden'],['linea_id'],['rubro_id'],['renglon'],['codigo']
            ],
            logging: false
        })
        if(articulos.length == 0) return res.send('Sin resultados')
        //return res.send(articulos)
        // Create a document
        const doc = new PDFDocument({
            'size': 'A4',
            'dpi': 300,
            'margin': 0
        });
        // Pipe its output somewhere, like to a file or HTTP response
        // See below for browser usage
        //doc.pipe(fs.createWriteStream('utilidades/prueba.pdf')); // write to PDF
        doc.pipe(res); // write to PDF
        doc.on('pageAdded', () => {
            doc.image(path.join(__dirname, '../public/images/oferta/fondo.png'), 0, 0, {
                width: 595,
                height: 822,
                align: 'stretch'
            });
        });
        // fin query articulos
        let cuadrosPorPagina = 15;
        let paginasTotal = Math.ceil(articulos.length / cuadrosPorPagina) + 1;
        let cuadrosCuenta = 1;
        let indice = 0;
        for (let numero_pagina = 1; numero_pagina < paginasTotal; numero_pagina++) {
            doc.image(path.join(__dirname, '../public/images/oferta/fondo2.png'), 0, 0, {
                width: 595,
                height: 822,
                align: 'stretch'
            });
            // variables
            let pos_hor = 31;
            let pos_ver = 105;
            let cuenta_cols = 0;
            for (let art = cuadrosCuenta; cuadrosCuenta <= (cuadrosPorPagina * numero_pagina); cuadrosCuenta++) {
                let articulo = articulos[indice];
                // imagen de articulo
                if (fs.existsSync(path.join(__dirname, `../public/images/articulos/${articulo.linea_id}/${articulo.codigo.replace('/','-')}.jpg`))) {
                    doc.image(path.join(__dirname, `../public/images/articulos/${articulo.linea_id}/${articulo.codigo.replace('/','-')}.jpg`), pos_hor + 15, pos_ver + 25, {
                        width: 110,
                        height: 85,
                        align: 'center',
                        valign: 'center'
                    });
                }
                // recuadro
                doc.image(path.join(__dirname, `../public/images/oferta/recuadros/${articulo.linea_id}.png`), pos_hor, pos_ver, {
                    width: 172,
                    height: 122,
                    align: 'center',
                    valign: 'center'
                });
                // informacion
                doc.fillAndStroke('black')
                doc.fillColor('black')
                doc.fontSize(12)
                doc.text(articulo.codigo, pos_hor + 4, pos_ver + 3, {
                    stroke: 2,
                    fill: 'black'
                });
                doc.fillColor('white')
                doc.fontSize(9)
                if (String(articulo.oem).includes('*')) {
                    doc.text(`OEM: ${articulo.oem.split('*')[0]}`, pos_hor + 75, pos_ver + 5);
                } else {
                    doc.text(`OEM: ${articulo.oem}`, pos_hor + 70, pos_ver + 3);
                }
                doc.fillColor('black')
                doc.fontSize(8)
                doc.text(articulo.modelos, pos_hor + 15, pos_ver + 19, {
                    width: 160
                });
                doc.text(articulo.descripcion.substring(0, 31), pos_hor + 4, pos_ver + 112, {
                    width: 165
                });
                doc.fillColor('white')
                doc.fontSize(12)
                doc.fillAndStroke('white')
                doc.text(`$ ${Math.round(articulo.precio / 100)}`, pos_hor + 125, pos_ver + 95, {
                    stroke: 1,
                    fill: 'white',
                    characterSpacing: 1
                });
                doc.fontSize(15)
                doc.text(numero_pagina, 290, 780, {
                    stroke: 2,
                    fill: 'white'
                })
                // agregar espacio entre cuadros
                pos_hor += 172;
                pos_hor += 7;
                // aumentar la cuenta de articulos y el indice
                cuenta_cols++;
                indice++;
                // restablecer medidas cada 3 articulos para hacer el salto de linea
                if (cuenta_cols === 3) {
                    cuenta_cols = 0;
                    pos_hor = 31;
                    pos_ver += 122;
                    pos_ver += 5;
                }
                // si se alcanza la cantidad maxima de articulos, parar el ciclo
                if (cuadrosCuenta == articulos.length) break;
                // agregar pagina cada 15 articulos
                if (indice % 15 == 0) doc.addPage()
            }
            /* if (numero_pagina > 1) {
                doc.addPage()
            } */
        }
        // Finalize PDF file
        doc.end();
    } catch (err) {
        console.log(err)
    }
}