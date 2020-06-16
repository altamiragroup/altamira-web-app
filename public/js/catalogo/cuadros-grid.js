let css = document.querySelector('#cuadros-grid')
let th2 = document.querySelector('#th-2')
let th3 = document.querySelector('#th-3')
let th4 = document.querySelector('#th-4')

function ajustarGrilla(){
    let grilla = sessionStorage.getItem('grid')
    css.setAttribute('href', grilla)
}
ajustarGrilla()

th2.addEventListener('click',function(){
    sessionStorage.setItem('grid','/css/main/catalogo/cuadros-grid-2.css')
    ajustarGrilla()
})
th3.addEventListener('click',function(){
    sessionStorage.setItem('grid','/css/main/catalogo/cuadros-grid-3.css')
    ajustarGrilla()
})
th4.addEventListener('click',function(){
    sessionStorage.setItem('grid','/css/style.css')
    ajustarGrilla()
})