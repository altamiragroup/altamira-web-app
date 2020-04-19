tipo2 : (req, res) => {
    // enviar todos los comprobantes del mismo tipo
    let  {tipo, cliente, numero } = req.params;

    let query = "select top 10";
    
    if (tipo == undefined){
        
        query += "nrocta,nrofor,factura,monto,codfor,nrocae from dbo.ncXdto";
    }
    
    if(tipo == 'factura'){
        return res.send('hola')
    }
    if(tipo == 'credito'){
        return res.send('hola')
    }
    if(tipo == 'debito'){
        return res.send('hola')
    }
    
    if(cliente != undefined){ query += " WHERE nrocta = 00" + cliente };
    if(numero != undefined){ query += " WHERE nrofor = 00" + numero };

        sql.connect(config, function(err) {
          if (err) console.log(err);

          var request = new sql.Request();

          request.query(query, function(err, result) {
            if (err) res.send(err);
                if(result){
                    if(result.recordset != undefined){
                    return res.send(result.recordset);
                    }
                }
              });
        });
}