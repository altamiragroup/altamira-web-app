module.exports = {
    fechaActual : () => {
        let fecha = new Date()

        let yyyy = fecha.getFullYear();
        let mm = fecha.getMonth() + 1;
        let dd = fecha.getDate();
        
        let hh = fecha.getHours();
        let mmm = fecha.getMinutes();
        let sss = fecha.getSeconds();

        let fechaAct = `${yyyy}-${mm}-${dd} ${hh}:${mmm}:${sss}`
        return fechaAct
    }
}