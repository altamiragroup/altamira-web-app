
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
