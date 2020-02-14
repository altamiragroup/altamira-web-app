
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
