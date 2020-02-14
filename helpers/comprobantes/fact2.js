var pagTotal = 37;
var artPorPag;
var numPag = 37;


var imgData = '../partials/comprobantes/imageFact.js'; // incluir imagen de fondo
var doc = new jsPDF('p', 'mm', 'A4'); // portrait, milimetros, formato A4
var cuenta = 1; // llevar la cuenta del artículo que se esta imprimiendo
var montoTotalFactura = 0;
for (let numPag = 1; numPag <= pagTotal; numPag++) {
    if (numPag > 1) {   doc.addPage(); }
    //fondo
    doc.addImage(imgData, 'JPEG', 15, 10, 180, 260)
    //info-----------------------------------
    //tipo de factura
    doc.setFontSize(20);
    doc.setFontType("bold");
    doc.text(109, 24, "A");
    //codigo
    doc.setFontType("normal");
    doc.setFontSize(9)
    doc.text(125, 39, "CODIGO");
    //tipo de comprobante
    doc.setFontSize(13);
    doc.text(155, 18, 'TIPO COMPROBANTE');
    // numero de factura
    doc.setFontSize(10);
    doc.text(155, 22.5, "NUMERO");
    // fecha
    doc.setFontSize(9);
    doc.text(175, 28, "FECHA");
    // cliente
    doc.text(34, 54, "NOMBRE");
    // numero cliente
    doc.text(95, 54, "CLIENTE");
    // vendedor
    doc.text(105, 54, "VENDEDOR");
    // direccion
    doc.text(131, 54, "DIRECCION");
    // cuit
    doc.text(34, 63.4, "CUIT");
    // resp inscripto
    doc.text(70, 63.4, "CONDICION IVA");
    // descuentos fechas
    doc.setFontSize(8);
    doc.text(126, 73.5, "0");
    doc.text(126, 77, "0");
    doc.text(126, 80.2, "0");
    // descuentos montos
    doc.text(170, 73.5, "DESC20");
    doc.text(170, 77, "DESC10");
    doc.text(170, 80.2, "VALOR");

    var posicion = 96; // posición vertical de los renglones
    for (let art = cuenta; cuenta <= (artPorPag * numPag); cuenta++) 
        // calcular subtotal
        var precioArtActual = '';
        // guardar la suma de los artículos
        var montoTotalFactura = montoTotalFactura + precioArtActual
        doc.setFontSize(6.5); // definir tamaño de letra para los artículos
        doc.text(20, posicion, "CODIGO");
        doc.text(38, posicion, "CANTIDAD", 'right');
        doc.text(44, posicion, "DESCRIPCION");
        doc.text(100, posicion, "MODELOS");
        doc.setDrawColor(0); // recuadro gris
        doc.setFillColor(204, 204, 204); // recuadro gris
        doc.rect(140, posicion - 2, 16, 3, 'F'); // recuadro gris
        doc.text(148, posicion, "DESPACHO", 'center');
        doc.text(175, posicion, "PRECIO", 'right');
        doc.text(190, posicion, "PRECIO X CANT", 'right')
        posicion = posicion + 3.5; // modificar posición para agregar salto de línea
        if (cuenta == articulos.length) { // si cuenta es igual al total de los articulos
            break;
        }
    if (numPag == pagTotal) { // agregar el footer solo en la última página
        
        // transporte
        doc.setFontSize(9);
        doc.text(28, 253, "TRANSPORTE");
        // subtotal
        doc.setFontSize(8);
        doc.text(175, 256, "SUBTOTAL FACT");
        doc.setFontSize(9);
        // subtotal gravado
        doc.text(23, 267.5, "SUBTOTAL GRAVADO");
        // subtotal excento
        doc.text(50, 267.5, "0.00", );
        doc.text(63, 267.5, "EXCENTO", );
        // descuento
        doc.text(90, 267.5, "DESCUENTO", "center" );
        // subtotal
        doc.text(110, 267.5, "SUBTOTAL", );
        // IVA insc
        doc.text(140, 267.5, "IVA", );
        // total
        doc.setFontSize(10);
        doc.setFontType("bold");
        doc.text(190, 267.5, "VAL TOTAL", "right");
        doc.setFontType("normal");
        doc.text(190,275,"C.A.E. Nº: CAE","right");

     }
}
var string = doc.output('datauristring');
doc.setProperties({
    title: 'Factura',
    subject: 'Comprobante de Factura',
    author: 'Altamira Group'
});
