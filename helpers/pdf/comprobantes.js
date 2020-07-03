const PDFDocument = require('pdfkit');
const db = require("../../database/models");
const sequelize = db.sequelize;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const path = require('path');

function formatear_monto(monto){
    return new Intl.NumberFormat(["de-DE"]).format(monto)
}

module.exports = {
    comprobante : async (cliente, numero, tipo, res) => {
        try {
            // datos de cliente
            let datos_cliente = await db.clientes.findOne({
                where : { numero : cliente},
                attributes : {
                    exclude : ['telefono','correo','precio_especial','transporte']
                },
                logging: false
            });
            // datos de comprobante
            let comprobante = await db.comprobantes.findOne({
                where : {
                    numero : numero,
                    tipo : {[Op.like] : `%${ tipo }%`}
                },
                attributes : {
                    exclude : ['cliente_num']
                },
                logging: false
            });
            // articulos del comprobante
            let query = '';
            if (tipo === 'Factura') {
                query = `
                SELECT comp_articulo.articulo_id, comp_articulo.cantidad, comp_articulo.precio, comp_articulo.despacho, articulos.descripcion, articulos.modelos
                FROM comp_articulo
                JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
                WHERE numero = ${numero}
                `
            }
            if (tipo.match(/^Cr.dito$/)) {
                query = `
                SELECT comp_articulo.articulo_id, comp_articulo.cantidad, comp_articulo.precio, comp_articulo.descripcion
                FROM comp_articulo
                LEFT JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
                WHERE numero = ${numero}
                `
            }
            // ejecutar query
            let articulos_db = await sequelize.query(query);
            let articulos = articulos_db[0]

            // variables
            let artPorPag = 42;
            let pagTotal = Math.ceil(articulos.length / artPorPag) + 1;

            // generar documento
            const doc = new PDFDocument({
                'size': 'A4',
                'dpi': 300,
                'margin': 0,
                'autoFirstPage' : false
            });
            // enviar PDF como respuesta
            doc.pipe(res)

            // cabecera
            doc.on('pageAdded', () => {
                doc.image(path.join(__dirname, '../../public/images/comprobantes/modelo_factura.png'), 0, 0, {
                    width: 595,
                    height: 822,
                    align: 'stretch'
                });
            });

            // Generar factura ------------------
            doc.addPage()
            doc.image(path.join(__dirname, '../../public/images/comprobantes/modelo_factura.png'), 0, 0, {
                width: 595,
                height: 822,
                align: 'stretch'
            });
            // cabecera
            let x = 75;
            let y = 120;
            // datos de factura
            doc.fontSize(20);
            doc.text(datos_cliente.condicion_pago, 317, 43)
            doc.fontSize(12);
            doc.text(comprobante.tipo.substring(0,7), 520, 40)
            doc.fontSize(10);
            doc.text('N° ' + comprobante.numero, 520, 55)
            doc.fontSize(8);
            let fecha = new Date(comprobante.fecha)
            doc.text(`${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`, 520, 72)
            // datos de cliente
            doc.fontSize(8);
            doc.text(datos_cliente.razon_social, x, y)
            doc.text(datos_cliente.cuit, x, y + 20)
            datos_cliente.situacion_iva == 'I' ?
                doc.text('Responsable Inscripto', x + 100, y + 20)
                :
                doc.text('Responsable Monotributo', x + 100, y + 20)
            doc.text(datos_cliente.direccion, x + 291, y)

            // posicion vertical de los renglones
            let artPosition = 218; 
            // cuenta de los articulos
            let indice = 0; 
            // calcular valores factura
            let descuentoCliente = 25;
            let descuento;
            let ivaInsc;
            let subtotal;
            let subtotal_gravado = 0;
            
            // imprimir articulos en la factura
            doc.fontSize(7);
            for(articulo of articulos){
                subtotal_gravado += (articulo.precio * articulo.cantidad)
                doc.text(articulo.articulo_id, 38, artPosition)
                doc.text(articulo.cantidad.toFixed(2), 88, artPosition)
                doc.text(articulo.descripcion.substring(0,30), 120, artPosition)
                if(articulo.modelos){
                    doc.text(articulo.modelos.substring(0, 40), 255, artPosition)
                }
                doc.text(articulo.precio, 480, artPosition)
                doc.text((articulo.precio * articulo.cantidad).toFixed(2), 530, artPosition)
                indice++;
                artPosition += 10;
                if(indice % artPorPag == 0){
                    doc.addPage()
                    artPosition = 218
                }
                if (indice == articulos.length) break;
            }

            descuento = (descuentoCliente * subtotal_gravado / 100).toFixed(2);
            subtotal = subtotal_gravado - descuento;
            ivaInsc = (subtotal * 0.21).toFixed(2);
            // Pie de factura
            if (true) {
                doc.text(comprobante.transporte, 60, 707)
                doc.text(formatear_monto(subtotal_gravado), 510, 712)
                doc.text(formatear_monto(subtotal_gravado), 60, 745)
                doc.text('0.00  25%', 160, 745)
                doc.text('-' + formatear_monto(descuento), 250, 745)
                doc.text(formatear_monto(subtotal), 340, 745)
                doc.text(formatear_monto(ivaInsc), 430, 745)
                doc.fontSize(10);
                doc.text('C.A.E. N°: ' + comprobante.cae, 450, 775)
                doc.font('Helvetica-Bold');
                doc.text(formatear_monto(comprobante.valor), 510, 745)
            }
            // Finalizar PDF --------------------
            doc.end();
            
        }
        catch(error){
            console.log({
                message : 'Error generando comprobante',
                error
            })
        }

    },
    nota_credito_descuento : async (req, res) => {
        try {

        }
        catch(error){
            console.log({
                message : 'Error generando comprobante',
                error
            })
        }

    },
    nota_debito : async (req, res) => {
        try {

        }
        catch(error){
            console.log({
                message : 'Error generando comprobante',
                error
            })
        }

    },
    recibo : async (req, res) => {
        try {

        }
        catch(error){
            console.log({
                message : 'Error generando comprobante',
                error
            })
        }

    }
}