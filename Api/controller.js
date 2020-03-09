const sql = require("mssql");
const config = {
            user: "sa",
            password: "B0mbard3o!",
            server: "190.57.226.9",
            database: "DotAltamira"
        };

module.exports = {
    credito : (req, res) => {

        sql.connect(config)
        .then(() => {
            return sql.query`select STMPDH_ARTCOD,STMPDH_DESCRP,USR_STMPDH_TITULO from stmpdh `
        })
        .then(result => {

            let output = result.recordset.map(item => {
                return {
                    articulo : item.STMPDH_ARTCOD,
                    descripcion: item.STMPDH_DESCRP,
                    modelos: item.USR_STMPDH_TITULO
                }
            })
            res.json(output);
        })
        .catch(error => {
            res.send(error);
        })
    }
}