const PDFDocument = require('pdfkit');
const fs = require('fs');
const db = require('../../database/models');
const Sequelize = require('sequelize');
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

    // filtros
    if (nuevos) items.push({ nuevo: 1 });
    if (destacados) items.push({ destacado: 1 });

    if (lineas) {
      if (typeof lineas === 'string') {
        items.push({ [Op.or]: { linea_id: lineas } });
      } else {
        let filtros = [];
        for (const num of lineas) filtros.push({ linea_id: num });
        items.push({ [Op.or]: filtros });
      }
    }

    if (rubros) {
      if (typeof rubros === 'string') {
        const rubro = await db.rubros.findOne({ where: { nombre: rubros } });
        items.push({ [Op.or]: { rubro_id: rubro.id } });
      } else {
        let filtros = [], rubrosWhere = [];
        for (const nombre of rubros) rubrosWhere.push({ nombre });
        const rubros_db = await db.rubros.findAll({
          where: { [Op.or]: rubrosWhere },
          attributes: ['id'],
          logging: false
        });
        for (const r of rubros_db) filtros.push({ rubro_id: r.id });
        items.push({ [Op.or]: filtros });
      }
    }

    if (descripcion) {
      let filtros = [];
      const palabras = descripcion.trim().split(' ');
      for (const palabra of palabras) {
        filtros.push({
          [Op.or]: [
            { descripcion: { [Op.like]: `%${palabra}%` } },
            { caracteristicas: { [Op.like]: `%${palabra}%` } }
          ]
        });
      }
      items.push(filtros);
    }

    if (modelos) {
      let filtros = [];
      const palabras = modelos.trim().split(' ');
      for (const palabra of palabras) {
        filtros.push({ [Op.or]: [{ modelos: { [Op.like]: `%${palabra}%` } }] });
      }
      items.push(filtros);
    }

    if (proveedor) {
      let filtros = [];
      const palabras = proveedor.trim().split(' ');
      for (const palabra of palabras) {
        filtros.push({ [Op.or]: [{ proveedor: { [Op.like]: `%${palabra}%` } }] });
      }
      items.push(filtros);
    }

    // where final
    /*para filtrar por modelos y not in en algunos cod
modelos: { [Op.like]: '%CRUZE%' },codigo: { [Op.notIn]: ['3061/53', '3061/55']},*/
    const where = {
      estado: 1,
      destacado: 2,
      [Op.and]: items
    };

    // query
    const articulos = await db.articulos.findAll({
      where,
      order: [['orden'], ['linea_id'], ['rubro_id'], ['renglon'], ['codigo']]
    });
    if (articulos.length === 0) return res.send('Sin resultados');

    // —————— Configuro headers para descarga —no—————
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="catalogo.pdf"');

    // Creo el PDF
    const doc = new PDFDocument({
      size: [595.17, 850.5],
      dpi: 300,
      margin: 0
    });
    const fontDesigner = path.join(__dirname, '../../public/css/fonts/Designer.otf');
    const fontMontserrat = path.join(__dirname, '../../public/css/fonts/Montserrat.ttf');
    const fontMontserratBold = path.join(__dirname, '../../public/css/fonts/Montserrat-Bold.ttf');

    doc.registerFont('Designer', fontDesigner);
    doc.registerFont('Montserrat', fontMontserrat);
    doc.registerFont('Montserrat-Bold', fontMontserratBold);

    // Pipe al response
    doc.pipe(res);

    // Cada vez que agrego página le pongo el fondo
    doc.on('pageAdded', () => {
      doc.image(
        path.join(__dirname, '../../public/images/oferta/fondo3.png'),
        0, 0,
        { width: 595.17, height: 850.5, align: 'stretch' }
      );
    });

    // Contenido inicial
    doc.image(
      path.join(__dirname, '../../public/images/oferta/fondo3.png'),
      0, 0,
      { width: 595.17, height: 850.5 }
    );

    // Variables de paginación
    const cuadrosPorPagina = 15;
    const paginasTotal = Math.ceil(articulos.length / cuadrosPorPagina) + 1;
    let cuadrosCuenta = 1, indice = 0;

    for (let numero_pagina = 1; numero_pagina < paginasTotal; numero_pagina++) {
      // Variables de posición
      let pos_hor = 31, pos_ver = 105, cuenta_cols = 0;

      for (; cuadrosCuenta <= cuadrosPorPagina * numero_pagina; cuadrosCuenta++) {
        const art = articulos[indice];

        // Imagen de artículo
        const imgPath = path.join(
          __dirname,
          `../../public/images/articulos/${art.linea_id}/${art.codigo.replace('/', '-')}.jpg`
        );
        if (fs.existsSync(imgPath)) {
          doc.image(imgPath, pos_hor + 15, pos_ver + 25, {
            width: 85, height: 85, align: 'center', valign: 'center'
          });
        }

        // Recuadro
        doc.image(
          path.join(__dirname, `../../public/images/oferta/recuadros/${art.linea_id}.png`),
          pos_hor, pos_ver,
          { width: 172, height: 122, align: 'center', valign: 'center' }
        );
        // RecuadroNuevo
        if (art.pr_nuevo === 1) {
        doc.image(
          path.join(__dirname, `../../public/images/oferta/nuevo.png`),
          pos_hor + 110, pos_ver + 44,
          { width: 50, height: 40, align: 'center', valign: 'center' }
        )};

        // Texto
        doc
          .fillColor('white')       // color de relleno
          .strokeColor('white')     // color de trazo
          .lineWidth(0.5)           // opcional: grosor del trazo
          .fontSize(11)
          .font('Designer')
          .text(art.codigo, pos_hor + 4, pos_ver + 5, {
            stroke: true,           // activa el trazo además del relleno
            fill: true              // activa el relleno
          });

        // OEM
        doc.fillColor('black').fontSize(8);
        const oemText = String(art.oem).includes('*')
          ? `OEM: ${art.oem.split('*')[0]}`
          : `OEM: ${art.oem}`;
        doc.font('Montserrat') // Normal font
          .text(oemText, pos_hor + 64, pos_ver + 5);

        // Asegurar que todo sea string
        const modelo = String(art.modelos || '');
        const descripcion = String(art.descripcion || '');
        const caracteristicas = String(art.caracteristicas || '');

        // Modelo
        doc.fontSize(6)
          .font('Montserrat-Bold') // Normal font
          .text(modelo, pos_hor + 7, pos_ver + 23, { width: 160, align: 'left' });

        // Descripción en negrita
        doc.fontSize(6)
          .font('Montserrat') // Negrita
          .text(descripcion, pos_hor + 5, pos_ver + 106, { width: 165, align: 'left' });

        // Características en negrita
        doc.fontSize(6)
          .font('Montserrat') // Negrita
          .text(caracteristicas, pos_hor + 110, pos_ver + 38, { width: 50, align: 'left' });

        // --- comentar hasta //fin p/PRECIO EN BLANCO ---
        doc
          .fillColor('white')
          .strokeColor('white')
          .lineWidth(0.4)
          .fontSize(9)
          .font('Designer') 
          /*.text(`$ ${Math.round((art.precio / 100) * 0.57)}`, pos_hor + 116, pos_ver + 94, {
          stroke: false,
          fill: true,
          characterSpacing: 0.5
        });*/
        //

        // --- NÚMERO DE PÁGINA EN BLANCO (relleno) ---
        doc
          .fillColor('white')
          .fontSize(15)
          .text(numero_pagina, 290, 780, {
            stroke: false,  // solo relleno
            fill: true
          });

        // Avanzar posiciones
        pos_hor += 179; // 172 + 7
        cuenta_cols++; indice++;

        // Salto de línea cada 3
        if (cuenta_cols === 3) {
          cuenta_cols = 0;
          pos_hor = 31;
          pos_ver += 127; // 122 + 5
        }
        // Salir si llegamos al final
        if (cuadrosCuenta === articulos.length) break;
      }

      // Agregar nueva página si faltan más artículos
      if (indice % cuadrosPorPagina === 0 && indice < articulos.length) {
        doc.addPage();
      }
    }

    // Finalizar PDF
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al generar el PDF');
  }
}