const PDFDocument = require('pdfkit');
const fs = require('fs');
const db = require("../../database/models");

module.exports = async (res) => {
    try {
        // traer lineas
        let lineas = await db.lineas.findAll({
            include : { model : db.articulos, as : 'articulos', attributes : ['codigo','precio','proveedor','unidad_min_vta']},
            //order : [['codigo']],
            logging : false,
        })
        // Crear PDF
        const doc = new PDFDocument({
            'size': 'LEGAL',
            'dpi': 300,
            'margin': 0,
            'layout' : 'landscape'
        });
        // Enviar PDF como respuesta
        doc.pipe(res);
        // variables
        let x_inicial = 40;
        let y_inicial = 25;
        let x = x_inicial;
        let y = x_inicial;
        let medida_col = 150;
        let total_articulos = await db.articulos.count();
        let articulos_por_col = 50;
        let total_cols = 6;
        // conteos
        let cuenta_art_vertical = 0;
        let cuenta_cols = 0;
        let numero_pagina = 1;

        doc.on('pageAdded', () => {
            // encabezado
            doc.fontSize(13)
            doc.fillAndStroke('black')
            doc.fillColor('black')
            doc.text('ALTAMIRA GROUP S.A.', 40, 25, {
                stroke: 1,
                fill: 'black'
            });
            let fecha = new Date()
            doc.text(`LISTA DE PRECIOS ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`, 40 + 360, 25, {
                stroke: 1,
                fill: 'black'
            });
            doc.fontSize(7)
            doc.text(`Página ${numero_pagina}`, 40 + 900, 25 + 10)
        })
        // encabezado
        doc.fontSize(13)
        doc.fillAndStroke('black')
        doc.fillColor('black')
        doc.text('ALTAMIRA GROUP S.A.', x, y, {
            stroke: 1,
            fill: 'black'
        });
        let fecha = new Date()
        doc.text(`LISTA DE PRECIOS ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`, x + 360, y, {
            stroke: 1,
            fill: 'black'
        });
        doc.fontSize(7)
        doc.text(`Página ${numero_pagina}`, x + 900, y + 10)
        
        y += 15;
        // iterar sobre cada linea
        for(linea of lineas){
            if(linea.id == 80){
                //doc.addPage()
                y = y_inicial + 45;
                x += medida_col + 10;
                cuenta_cols += 1;
            }
            doc.fontSize(10)
            doc.fillColor('red')
            doc.font('Helvetica');
            doc.text(linea.nombre, x, y)
            y += 10;
            doc.fontSize(9)
            doc.font('Helvetica-Bold');
            doc.fillColor('black')
            doc.text('ARTICULO', x, y)
            doc.text('PRECIO', x + 55, y)
            doc.text('COD', x + 95, y)
            doc.text('U/Vta', x + 125, y)
            cuenta_art_vertical += 2;
            y += 10;
            // iterar sobre los articulos de cada linea
            for(articulo of linea.articulos){
                doc.fillColor('gray')
                doc.text(articulo.codigo, x, y)
                doc.text(articulo.precio, x + 55, y)
                doc.text(articulo.proveedor, x + 95, y)
                doc.text(articulo.unidad_min_vta, x + 125, y)
                if(cuenta_cols != 5){
                    doc.fillColor('black')
                    doc.text('  |', x + 140, y)
                }
                y += 10;
                cuenta_art_vertical++
                if(cuenta_art_vertical % articulos_por_col === 0){
                    cuenta_cols++
                    y = y_inicial + 45;
                    x += medida_col + 10 
                    console.log(cuenta_art_vertical)
                }
                if(cuenta_cols === total_cols){
                    doc.addPage()
                    y = y_inicial + 45;
                    x = x_inicial;
                    cuenta_cols = 0;
                    numero_pagina++;
                    //cuenta_art_vertical = 0;
                }
            }
            if(cuenta_art_vertical == total_articulos){
                break
            }
        }
        // finalizar documento
        doc.end();
    }
    catch(error){
        console.log({
            message : 'error al generar lista de precios',
            error
        })
    }
}