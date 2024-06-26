const PDFDocument = require('pdfkit');
const db = require('../../database/models');
const sequelize = db.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');

function formatear_monto(monto) {
  return new Intl.NumberFormat(['de-DE']).format(monto);
}

module.exports = {
  comprobante: async (cliente, numero, tipo, res) => {
    try {
      // datos de cliente
      let datos_cliente = await db.clientes.findOne({
        where: { numero: cliente },
        attributes: {
          exclude: ['telefono', 'correo', 'precio_especial', 'transporte'],
        },
        logging: false,
      });
      // datos de comprobante
      let comprobante = await db.comprobantes.findOne({
        where: {
          numero: numero,
          tipo: { [Op.like]: `%${tipo}%` },
        },
        attributes: {
          exclude: ['cliente_num'],
        },
        logging: false,
      });     
      // articulos del comprobante
      let query = '';
      if (tipo === 'Factura') {
        query = `SELECT comp_articulo.articulo_id, comp_articulo.cantidad, 
        (CASE WHEN (comprobantes.pre_esp)='PE' THEN (comp_articulo.precio * 0.5) ELSE comp_articulo.precio END)AS precio , 
        comp_articulo.descripcion,articulos.modelos AS modelos
                        FROM comp_articulo
                        LEFT JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
                        LEFT JOIN comprobantes ON comp_articulo.numero = comprobantes.numero
                        WHERE comp_articulo.numero = ${numero}
                `;
      }
      if (tipo.match(/^Cr.dito$/)) {
        query = `SELECT comp_articulo.articulo_id, comp_articulo.cantidad, (CASE WHEN (comprobantes.pre_esp)='PE' THEN (comp_articulo.precio * 0.5) ELSE comp_articulo.precio END)AS precio, 
        comp_articulo.descripcion
                        FROM comp_articulo
                        LEFT JOIN articulos ON comp_articulo.articulo_id = articulos.codigo
                        LEFT JOIN comprobantes ON comp_articulo.numero = comprobantes.numero
                        WHERE comp_articulo.numero = ${numero}
                `;
      }
      // ejecutar query
      let articulos_db = await sequelize.query(query);
      let articulos = articulos_db[0];
      // variables
      let artPorPag = 42;
      let pagTotal = Math.ceil(articulos.length / artPorPag) + 1;
      
      // generar documento
      const doc = new PDFDocument({
        size: 'A4',
        dpi: 300,
        margin: 0,
        autoFirstPage: false,
      });
      // enviar PDF como respuesta
      doc.pipe(res);

      // cabecera
      doc.on('pageAdded', () => {
        doc.image(
          path.join(__dirname, '../../public/images/comprobantes/modelo_factura.png'),
          0,
          0,
          {
            width: 595,
            height: 822,
            align: 'stretch',
          }
        );
      });

      // Generar factura ------------------
      doc.addPage();
      doc.image(path.join(__dirname, '../../public/images/comprobantes/modelo_factura.png'), 0, 0, {
        width: 595,
        height: 822,
        align: 'stretch',
      });
      // cabecera
      let x = 75;
      let y = 120;
      // datos de factura
      doc.fontSize(20);
      // se utilizan expresiones regulares para imprimir la letra del tipo de comprobante: "A" o "B"
      doc.text(comprobante.tipo.match(/("\w")/)[0].replace(/(")/g, ''), 317, 43);
      doc.fontSize(12);
      doc.text(comprobante.tipo.substring(0, 7), 520, 40);
      doc.fontSize(9);
      doc.text('N° 0003-000' + comprobante.numero, 495, 54);
      doc.fontSize(8);
      let fecha = new Date(comprobante.fecha);
      doc.text(`${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`, 520, 72);
      // datos de cliente
      doc.fontSize(8);
      doc.text(datos_cliente.razon_social, x, y);
      doc.text(datos_cliente.cuit, x, y + 20);
      datos_cliente.situacion_iva == 'I'
        ? doc.text('Responsable Inscripto', x + 90, y + 20)
        : doc.text('Responsable Monotributo', x + 90, y + 20);
      doc.text(datos_cliente.direccion, x + 291, y);
      doc.text(comprobante.pre_esp, x + 220, y + 20);
      // posicion vertical de los renglones
      let artPosition = 218;
      // cuenta de los articulos
      let indice = 0;
      // calcular valores factura
      let descuentoCliente = datos_cliente.obtenerDescuentoCliente();
      let descuento;
      let ivaInsc;
      let subtotal;
      let subtotal_gravado = 0;

      // imprimir articulos en la factura
      doc.fontSize(7);
      for (articulo of articulos) {
        if (comprobante.tipo.match(/("\w")/)[0].replace(/(")/g, '') == 'B') {
          subtotal_gravado += articulo.precio  * articulo.cantidad * 1.21;
        } else {
          subtotal_gravado += articulo.precio  * articulo.cantidad;
        }
        doc.fontSize(6.5);
        doc.text(articulo.articulo_id, 35, artPosition);
        doc.text(articulo.cantidad.toFixed(2), 85, artPosition);
        doc.text(articulo.descripcion.substring(0, 60), 115, artPosition);
        if (articulo.modelos == null) {
          doc.text(articulo.modelos, 290, artPosition);
        }else{
        doc.text(articulo.modelos.substring(0, 50), 290, artPosition);        
        }
        doc.text(articulo.precio , 480, artPosition);
        doc.text((articulo.precio  * articulo.cantidad).toFixed(2), 530, artPosition);
        indice++;
        artPosition += 10;
        if (indice % artPorPag == 0) {
          doc.addPage();
          artPosition = 218;
        }
        if (indice == articulos.length) break;
      }

      descuento = ((descuentoCliente * subtotal_gravado) / 100).toFixed(2);
      subtotal = subtotal_gravado - descuento;

      ivaInsc = (subtotal * 0.21).toFixed(2);

      // Pie de factura
      if (true) {
        doc.text(comprobante.transporte, 60, 707);
        doc.text(formatear_monto(subtotal_gravado), 510, 712);
        doc.text(formatear_monto(subtotal_gravado), 60, 745);
        doc.text('0.00  ' + descuentoCliente + '%', 160, 745);
        doc.text('-' + formatear_monto(descuento), 250, 745);
        doc.text(formatear_monto(subtotal), 340, 745);
        doc.text(formatear_monto(comprobante.perc_ARBA), 450, 745);

        if (comprobante.tipo.match(/("\w")/)[0].replace(/(")/g, '') == 'B') {
          doc.text('', 430, 745);
        } else {
          doc.text(formatear_monto(ivaInsc), 400, 745);
        }

        doc.fontSize(10);        
        doc.text('C.A.E. N°: ' + comprobante.cae, 450, 775);
        doc.font('Helvetica-Bold');
        doc.text(formatear_monto(comprobante.valor), 510, 745);        
        if (tipo.match(/^Cr.dito$/)) {
        doc.text('ATENCION: AL DESCONTARSE N.C. DEBE HACER', 60, 775);
        doc.text('IGUAL DESCUENTO QUE LA FACTURA QUE ABONA', 60, 785);
        }
      }
      // Finalizar PDF --------------------
      doc.end();
    } catch (error) {
      console.log({
        message: 'Error generando comprobante',
        error,
      });
    }
  },
  nota_credito_descuento: async (cliente, numero, res) => {
    try {
      // datos de cliente
      let datos_cliente = await db.clientes.findOne({
        where: {
          numero: cliente,
        },
        attributes: {
          exclude: ['telefono', 'correo', 'precio_especial', 'transporte'],
        },
        logging: false,
      });
      let comprobantes = await db.ncdescuento.findAll({
        where: { numero: numero },
      });

      // generar documento
      const doc = new PDFDocument({
        size: 'A4',
        dpi: 300,
        margin: 0,
      });
      // enviar PDF como respuesta
      doc.pipe(res);

      // fondo factura
      doc.image(path.join(__dirname, '../../public/images/comprobantes/modelo_factura.png'), 0, 0, {
        width: 595,
        height: 822,
        align: 'stretch',
      });
      // cabecera
      let x = 75;
      let y = 120;
      // posicion vertical de los renglones
      let artPosition = 218;
      // datos de factura
      doc.fontSize(20);

      comprobantes[0].tipo == 'CAE' ? doc.text('A', 317, 43) : doc.text('B', 317, 43);

      doc.fontSize(12);
      doc.text('Nota de Crédito', 480, 40);
      doc.fontSize(10);
      doc.text('N° ' + comprobantes[0].numero, 520, 55);
      doc.fontSize(8);

      let fecha = new Date(comprobantes[0].fecha);

      doc.text(`${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`, 520, 70);
      doc.text(datos_cliente.razon_social, x, y);
      doc.text(datos_cliente.cuit, x, y + 20);

      datos_cliente.situacion_iva == 'I'
        ? doc.text('Responsable Inscripto', x + 100, y + 20)
        : doc.text('Responsable Monotributo', x + 100, y + 20);

      doc.text(datos_cliente.direccion, x + 291, y);
      doc.fontSize(7);

      function pasarNumeroAPositivo(numero) {
        return String(numero).replace('-', '');
      }

      for (comp of comprobantes) {
        doc.text('1.0', 88, artPosition);
        
        doc.text('DESCUENTO SOBRE COMPROBANTE   ' + comp.comprobante, 120, artPosition);       
        let monto = comp.tipo == 'CAE' ? (comp.monto / 1.21).toFixed(2) : comp.monto;

        /*repito abajo para calculo de pie*/
        let percArba = Math.max(Math.abs(comp.perc_ARBA));
        let subtotal_gravado = 0;      
      comprobantes.map(comp => {
        if (comp.tipo == 'CAE') {
          subtotal_gravado -= parseFloat(comp.monto );
        } else {
          subtotal_gravado -= parseFloat(comp.monto);
        }
      });          
      let sub_total = ((subtotal_gravado - percArba)/1.21);
      let porcentajePerc = ((((percArba * 100)/sub_total).toFixed(2))/100)+ 1.21; 

        doc.text(pasarNumeroAPositivo((comp.monto / porcentajePerc).toFixed(2)), 430, artPosition);
        artPosition += 10;
      }
      // pie de factura
      let percArba = Math.max(Math.abs(comp.perc_ARBA));
      let subtotal_gravado = 0;
    
      
      comprobantes.map(comp => {
        if (comp.tipo == 'CAE') {
          /*07/03/2023 se agrego:- (comp.perc_ARBA * -1)*/
          subtotal_gravado -= parseFloat(comp.monto );
        } else {
          subtotal_gravado -= parseFloat(comp.monto);
        }
      });      
      let total = subtotal_gravado;
      let iva = ((subtotal_gravado - percArba)/1.21)*0.21;
      let sub_total = ((subtotal_gravado - percArba)/1.21);
      let porcentajePerc = ((((percArba * 100)/sub_total).toFixed(2))/100)+ 1.21; 
      doc.text(formatear_monto(percArba), 460, 745);
      /*28/03/2023 se agregaron variables total,iva y subtotal y se reemplazaron valores de pie por las mismas variables*/
      /*07/03/2023 se cambio a: (((comp.monto - (comp.perc_ARBA * -1))/ 1.21).toFixed(2)) y era: (subtotal_gravado.toFixed(2))*/ 
      doc.text(formatear_monto((sub_total.toFixed(2))*-1), 510, 712);
      doc.text(formatear_monto(sub_total.toFixed(2)), 60, 745);
      doc.text('0.00  25%', 160, 745);
      doc.text('0.00', 250, 745);
      doc.text(formatear_monto(sub_total.toFixed(2)), 340, 745);
      if (comprobantes[0].tipo == 'CAE') {
/*ERA: doc.text(formatear_monto((subtotal_gravado * 0.21).toFixed(2)), 400, 745); SE CAMBIO A: doc.text(formatear_monto(Math.abs((((comp.monto - (comp.perc_ARBA * -1))/ 1.21) * 0.21).toFixed(2))), 400, 745);*/
        doc.text(formatear_monto(iva.toFixed(2)), 400, 745);
      }
      doc.fontSize(10);
      doc.text('C.A.E. N°: ' + comprobantes[0].cae, 450, 775);
      doc.font('Helvetica-Bold');
      comprobantes[0].tipo == 'CAE'
/*ERA: ? doc.text(formatear_monto(subtotal_gravado * 1.21), 510, 745) SE CAMBIO A: ? doc.text(formatear_monto(Math.abs(comp.monto)), 510, 745)*/
       ? doc.text(formatear_monto(total), 510, 745)        
/*? doc.text(formatear_monto(Math.abs(comp.monto)), 510, 745)*/
        : doc.text(formatear_monto(subtotal_gravado), 510, 745);
      // Finalizar PDF --------------------
      doc.end();
    } catch (error) {
      console.log({
        message: 'Error generando comprobante',
        error,
      });
    }
  },
  nota_debito: async (req, res) => {
    try {
    } catch (error) {
      console.log({
        message: 'Error generando comprobante',
        error,
      });
    }
  },
  recibo: async (req, res) => {
    try {
    } catch (error) {
      console.log({
        message: 'Error generando comprobante',
        error,
      });
    }
  },
};
