<%
var pagTotal = 37;
var artPorPag;
var numPag = 37;


var imgData = '../partials/comprobantes/imageFact.js'; // incluir imagen de fondo
var doc = new jsPDF('p', 'mm', 'A4'); // portrait, milimetros, formato A4
var cuenta = 1; // llevar la cuenta del artículo que se esta imprimiendo
var montoTotalFactura = 0;
for (let numPag = 1; numPag <= pagTotal; numPag++) {
    if (numPag > 1) { // si la factura tiene más de 37 artículos
        doc.addPage(); // agregar nueva página
    } %>
    <%- include('../partials/comprobantes/header'); %>
    <%
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
    
    if (numPag == pagTotal) { %> // agregar el footer solo en la última página
        <%- include('../partials/comprobantes/footer') %>
    <% }
}
var string = doc.output('datauristring');
doc.setProperties({
    title: 'Factura',
    subject: 'Comprobante de Factura',
    author: 'Altamira Group'
});
$('iframe').attr('src', string)

%>