const PDFDocument = require('pdfkit');
const FileSystem = require('fs');

module.exports = (info, data, res) => {

	const doc = new PDFDocument({ size: 'Legal' });
	doc.pipe(FileSystem.createWriteStream('./public/assets/cobranzas/'+ info.usuario +'.pdf'));

   	doc.fontSize(18)
	doc.font('Helvetica')
   	doc.text('Listado de cobranzas', 20, 20);
   	doc.fontSize(10)
	doc.text(info.viajante.nombre,{
		continued : true,
		wordSpacing : 20
	})
	doc.text(' | ',{continued : true})
	doc.text('Fecha: ' + info.fecha)
	doc.moveDown(1);
   	for(item of data){
		doc.moveDown(1);
		doc.fontSize(12)
		doc.font('Helvetica-Bold')
   		doc.text(item.razon_social.substring(0,30));
		doc.font('Helvetica')
		doc.fontSize(11)
   		doc.text(item.direccion + ' | ' + item.telefono);
   		doc.text('Deuda total: $ ' + item.saldo.saldo);
		doc.moveDown(0.5);
		doc.text('comprobante',{
			height : 10,
			continued : true,
			underline : 1,
			wordSpacing : 40
		})
		doc.text('numero',{
			continued : true,
		})
		doc.text('fecha',{
			continued : true,
		})
		doc.text('monto',{
			continued : true,
		})
		doc.text('salida',{
			continued : true,
		})
		doc.text('transporte',{
		})
		doc.moveDown(0.5);
		
		for(comp of item.comprobantes){
			doc.fontSize(10);
			doc.text(comp.tipo.substring(0,7) + '_' + comp.tipo.substring(14,15) + '__', {
				height : 10,
				continued : true,
				wordSpacing : 40
			})
			doc.text(comp.numero, {continued : true})
			doc.text(comp.formatDate(), {continued : true})
			if(String(comp.valor).substring(0,1) == '-'){
				doc.fillColor('green')
				doc.text('$' + comp.valor, {continued : true})
				doc.fillColor('black')
			} else {
				doc.fillColor('red')
				doc.text('$' + comp.valor, {continued : true})
				doc.fillColor('black')
			}
			if(comp.seguimiento != null){
				doc.text(comp.seguimiento.formatDate(comp.seguimiento.salida), {continued : true})
				doc.text(comp.seguimiento.transporte.substring(0,10).replace(' ','_'))
			} else {
				doc.fillColor('white')
				doc.text('----------', {continued : true})
				doc.fillColor('white')
				doc.text('------------')
				doc.fillColor('black')
			}
		}
		doc.moveDown(1);
	}
	// finalize the PDF and end the stream
	doc.end();

	return res.redirect('/viajantes/cobranzas')
}