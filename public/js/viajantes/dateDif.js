let salidas = document.querySelectorAll('.fechaSalida')
let plazos = document.querySelectorAll('.plazoSalida')


function getDate(){
    let fecha = new Date();

    let dd = fecha.getDate();
    let mm = fecha.getMonth() + 1;
    let yyyy = fecha.getFullYear();

    let fechaAct = `${yyyy}-${mm}-${dd}`;
    return fechaAct;
}
function formatDate(fecha){
    let arr = fecha.split('/');
    let fechNueva = `${arr[2]}-${arr[1]}-${arr[0]}`
    return fechNueva;
}
for (let i = 0; i < salidas.length; i++){

    if(salidas[i].innerHTML != ''){

        let fechaAct = moment(getDate());
        //let fechaComp = moment(formatDate(salidas[i].innerHTML));
        fechaComp = salidas[i].innerHTML;
        let plazo = fechaAct.diff(fechaComp, 'days') + 1;
        
       if(plazo) plazos[i].innerHTML = plazo + ' días';
    }
    

}
