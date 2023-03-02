const PDFDocument = require('pdfkit');
const db = require('../../database/models');

function formatear_monto(monto) {
  return new Intl.NumberFormat(['de-DE']).format(monto);
}

module.exports = async (numero_viajante, res) => {
  try {
    // traer clientes del viajante y sus deudas
    let data = await db.clientes.findAll({
      where: {
        viajante_id: numero_viajante,
      },
      attributes: ['razon_social', 'direccion', 'telefono'],
      include: [
        {
          model: db.saldos,
          as: 'saldo',
          attributes: ['saldo'],
          required: true,
        },
        {
          model: db.comprobantes,
          as: 'comprobantes',
          include: [
            {
              model: db.seguimientos,
              as: 'seguimiento',
              attributes: ['salida', 'transporte'],
              raw: true,
            },
          ],
        },
      ],
      order: ['cod_postal', 'razon_social', [db.comprobantes, 'fecha', 'ASC']],
      logging: false,
    });
    // traer datos del viajante
    let viajante = await db.viajantes.findOne({
      where: {
        numero: numero_viajante,
      },
    });
    // traer fecha actual
    let fecha = new Date();
    // formatear fecha
    for (comp of data) {
      comp.comprobantes.map(item => {
        item.fecha = item.formatDate();
        if (item.seguimiento != null) {
          item.seguimiento.salida = item.seguimiento.formatDate(item.seguimiento.salida);
        }
      });
    }
    // generar documento
    const doc = new PDFDocument({
      size: 'LEGAL',
      dpi: 300,
      margin: 0,
      autoFirstPage: false,
    });
    // enviar PDF como respuesta
    doc.pipe(res);
    // agregar primera página
    doc.addPage();
    // margenes
    let x_inicial = 50;
    let y_inicial = 30;
    let x = x_inicial;
    let y = y_inicial;
    // variables
    let results_por_pag = 10;
    let result_cuenta = 0;
    let paginas_total = Math.ceil(data.length / results_por_pag);
    // Cabecera
    doc.font('Helvetica-Bold');
    doc.text('Listado de cobranzas', x, y);
    doc.font('Helvetica');
    doc.fontSize(10);
    y += 15;
    doc.text(
      `${viajante.nombre.trim()} | Fecha: ${fecha.getDate()}/${
        fecha.getMonth() + 1
      }/${fecha.getFullYear()}`,
      x,
      y
    );
    doc.text('Páginas: ' + paginas_total, x + 450, y);
    y += 20;
    // generar litado
    for (item of data) {
      if (y > 950 || result_cuenta == results_por_pag) {
        doc.addPage();
        result_cuenta = 0;
        y = y_inicial;
        x = x_inicial;
      }
      doc.font('Helvetica-Bold');
      doc.fontSize(9);
      y += 10;
      doc.text(item.razon_social, x, y);
      doc.font('Helvetica');
      y += 10;
      doc.fontSize(8);
      doc.text(`${item.direccion} | ${item.telefono}`, x, y);
      y += 10;
      doc.text(`Deuda total $${item.saldo.saldo}`, x, y);
      y += 15;
      doc.font('Helvetica-Bold');
      doc.text(`Comprobante`, x, y);
      doc.text(`Numero`, x + 90, y);
      doc.text(`Fecha`, x + 140, y);
      doc.text(`Monto`, x + 200, y);
      doc.text(`Salida`, x + 270, y);
      doc.text(`Transporte`, x + 340, y);
      doc.font('Helvetica');
      y += 10;
      for (comprobante of item.comprobantes) {
        doc.text(comprobante.tipo.substring(0, 7), x, y);
        doc.text(comprobante.pre_esp.substring(0, 7), x + 40, y);
        doc.text(comprobante.numero, x + 90, y);
        doc.text(comprobante.fecha, x + 140, y);
        doc.text(formatear_monto(comprobante.valor), x + 200, y);
        if (comprobante.seguimiento != null) {
          doc.text(comprobante.seguimiento.salida, x + 270, y);
          doc.text(comprobante.seguimiento.transporte, x + 340, y);
        }
        y += 10;
      }
      result_cuenta++;
    }

    // Finalizar PDF
    doc.end();
  } catch (error) {
    console.log({
      message: 'error al generar listado de cobranzas',
      error,
    });
  }
};
