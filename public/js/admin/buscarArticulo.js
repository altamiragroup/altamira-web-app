let input = document.querySelector('#busqueda')
let button = document.querySelector('#submit')
let div = document.querySelector('#result_data')
let movimiento = document.querySelector('#movimiento')
let uses = document.querySelector('#uses')
let costo1 = document.querySelector('#componentes')
let valoresOriginales = {};

function fetchData() {
    let busqueda = input.value;
    div.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
    movimiento.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
    uses.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';
    costo1.innerHTML = '<div class="preload"><img src="/images/icons/preload.gif"></div>';

    axios.get(`/api/v2/articulos?buscar=${busqueda}&limit=1`)
        .then((result) => {
            if (result.data[0] == null) {
                div.innerHTML = "Sin resultados";
            } else {
                let item = result.data[0];
                div.innerHTML = `
                <div class="avatar">
                    <img src="/images/articulos/${item.linea_id
                    }/${item.codigo.replace("/", "-")}.jpg" alt="">
                </div>
                <div class="info wrap">
                    <p>Código:</p>
                    <p>${item.codigo}</p>
                    <p>Precio:</p>
                    <p>$ ${item.precio / 100}</p>
                    <p style="font-size: 14px">Costo:</p>
                    <p style="font-size: 14px">${item.costo1}</p> 
                    <p>Unidad vta:</p>
                    <p>${item.unidad_min_vta}</p>
                    <p style="color:red"><b>Stock:</b></p>
                    <p style="color:red"><b>${item.stock}</b></p>
                    <p>Proveedor:</p>
                    <p>${item.proveedor}</p>
                    <p>OEM:</p>
                    <p><input type="text" id="oem" value="${item.oem}" disabled></p>
                                    
                    <p style="font-size: 13px">Descripción:</p>
                    <p><textarea id="descripcion" disabled>${item.descripcion}</textarea></p>
                                    
                    <p style="font-size: 13px">Modelos:</p>
                    <p><textarea id="modelos" disabled>${item.modelos}</textarea></p>
                                    
                    <p style="font-size: 13px">Características:</p>
                    <p><textarea id="caracteristicas" disabled>${item.caracteristicas || ''}</textarea></p>
                                    
                    <div class="acciones">
                    <style>
.btn-dangerous {
                font-family: 'NexaRust';
                display: inline-block;
                padding: 0.375rem 0.75rem;
                font-size: 1rem;
                font-weight: 400;
                line-height: 1.5;
                color: #fff;
                text-align: center;
                text-decoration: none;
                vertical-align: middle;
                cursor: pointer;

                background-color: #dc3545;
                border: 1px solid #dc3545;
                border-radius: 0.375rem;

                user-select: none;

                transition: all 0.15s ease-in-out,
            background-color .15s ease-in-out,
            border-color .15s ease-in-out;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

/* HOVER */
.btn-dangerous:hover {
            background-color: #bb2d3b;
            border-color: #b02a37;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

/* FOCUS */
.btn-dangerous:focus {
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.5);
        }

/* ACTIVE (cuando hacés click) */
.btn-dangerous:active {
            background-color: #b02a37;
            border-color: #a52834;            
            transform: translateY(1px);
            box-shadow: inset 0 3px 5px rgba(0,0,0,0.2);
}

/* DISABLED */
.btn-dangerous:disabled {
            opacity: 0.65;
            cursor: not-allowed;
        }
/* DARK */
.btn-dark {
            font-family: 'NexaRust';
            display: inline-block;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #fff;
            text-align: center;
            text-decoration: none;
            vertical-align: middle;
            cursor: pointer;
            background-color: #212529;
            border: 1px solid #212529;
            border-radius: 0.375rem;
            user-select: none;
            transition: all 0.15s ease-in-out,
            background-color .15s ease-in-out,
            border-color .15s ease-in-out;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);           
            }       

/* HOVER */
.btn-dark:hover {
            background-color: #424649;
            border-color: #373b3e;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }       

/* FOCUS */
        .btn-dark:focus {
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgba(66, 70, 73, 0.5);
        }       

        /* ACTIVE */
        .btn-dark:active {
            background-color: #4d5154;
            border-color: #373b3e;
            box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        }       

        /* DISABLED */
        .btn-dark:disabled {
            background-color: #212529;
            border-color: #212529;
            color: #fff;
            opacity: 0.65;
        }
            /* BTN CANCEL */
            .btn-secondary {
    font-family: 'NexaRust';
    display: inline-block;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    color: #fff;
    cursor: pointer;

    background-color: #6c757d;
    border: 1px solid #6c757d;
    border-radius: 0.375rem;

    transition: all 0.15s ease-in-out;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-secondary:hover {
    background-color: #5c636a;
    border-color: #565e64;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn-secondary:active {
    transform: translateY(1px);
    box-shadow: inset 0 3px 5px rgba(0,0,0,0.2);
}
                    </style>
                        <button type="button" class="btn-dangerous" id="editarArticulo">EDITAR</button>
                        <button type="button" class="btn-dark" id="guardarArticulo" style="display:none">GUARDAR</button> 
                        <button type="button" class="btn-secondary" id="cancelarArticulo" style="display:none">CANCELAR</button>                                               
                    </div>
            `;
                if (item.estado == 0) div.innerHTML += '<p style="color:red">Dado de baja</p>'

                axios.get(`/api/v2/articulos/${item.codigo.replace("/", "-")}?comp=true&uses=true`)
                    .then(result => {
                        let mov = result.data.articulo.comprobantes;
                        movimiento.innerHTML = '<h3>Movimiento de articulo</h3>'
                        if (mov) {
                            mov.forEach(mov => {
                                movimiento.innerHTML += `
                            <ul class="wrap">
                                <li>Cliente: ${mov.cliente_num}</li>
                                <li>${mov.tipo.substring(0, 7)}</li>
                                <li>${mov.numero}</li>
                                <li>
                                    <a href="clientes/comprobantes/${mov.numero}?tipo=${mov.tipo.substring(0, 7)}&cliente=${mov.cliente_num}">
                                        <img src="/images/icons/catalogo/eye-regular.png" alt="">
                                    </a>
                                </li>
                            </ul>
                        `;
                            })
                        }

                        let usesArr = result.data.usesArr;
                        uses.innerHTML = '<h3>Articulos con mismo OEM</h3>'

                        if (usesArr) {
                            usesArr.forEach(use => {
                                uses.innerHTML += `
                            <ul class="wrap">
                                <li>${use.codigo}</li>
                                <li>${use.descripcion}</li>
                            </ul>
                        `;
                            })
                        }

                        axios.get(`/api/v2/articulos/${item.codigo.replace("/", "-")}/componentes`)
                            .then(result => {
                                let cant = result.data.armes;
                                if (cant != -1) {
                                    componentes.innerHTML = `
                            <h3>Componentes</h3>
                            <p>Disponible para armar: ${cant}</p>
                        `
                                } else {
                                    componentes.innerHTML = 'Sin resultados'
                                }
                            })
                    })
            }
        });
}

input.addEventListener('keypress', (e) => {
    if (e.which == 13) {
        e.preventDefault()
        fetchData()
    }
})
button.addEventListener('click', (e) => {
    e.preventDefault()
    fetchData()
})
document.addEventListener("click", function (e) {

        if (e.target.id == "editarArticulo") {

        // guardar valores originales
        valoresOriginales = {
            oem: document.querySelector("#oem").value,
            descripcion: document.querySelector("#descripcion").value,
            modelos: document.querySelector("#modelos").value,
            caracteristicas: document.querySelector("#caracteristicas").value
        };

        // habilitar inputs
        document.querySelector("#oem").disabled = false;
        document.querySelector("#descripcion").disabled = false;
        document.querySelector("#modelos").disabled = false;
        document.querySelector("#caracteristicas").disabled = false;

        // mostrar botones correctos
        document.querySelector("#editarArticulo").style.display = "none";
        document.querySelector("#guardarArticulo").style.display = "inline-block";
        document.querySelector("#cancelarArticulo").style.display = "inline-block";
    }

    if (e.target.id == "guardarArticulo") {

        let data = {
            codigo: document.querySelector("#result_data p:nth-child(2)").innerText,
            oem: document.querySelector("#oem").value,
            descripcion: document.querySelector("#descripcion").value,
            modelos: document.querySelector("#modelos").value,
            caracteristicas: document.querySelector("#caracteristicas").value
        }
        // deshabilitar inputs
document.querySelector("#oem").disabled = true;
document.querySelector("#descripcion").disabled = true;
document.querySelector("#modelos").disabled = true;
document.querySelector("#caracteristicas").disabled = true;

// volver botones
document.querySelector("#editarArticulo").style.display = "inline-block";
document.querySelector("#guardarArticulo").style.display = "none";
document.querySelector("#cancelarArticulo").style.display = "none";

        axios.post("/api/v2/articulos/update", data)
            .then(res => {
                alert("Artículo actualizado correctamente")
            })
            .catch(err => {
                console.error(err)
                alert("Error al actualizar")
            })        
    }
if (e.target.id == "cancelarArticulo") {

    // restaurar valores originales
    document.querySelector("#oem").value = valoresOriginales.oem;
    document.querySelector("#descripcion").value = valoresOriginales.descripcion;
    document.querySelector("#modelos").value = valoresOriginales.modelos;
    document.querySelector("#caracteristicas").value = valoresOriginales.caracteristicas;

    // deshabilitar inputs
    document.querySelector("#oem").disabled = true;
    document.querySelector("#descripcion").disabled = true;
    document.querySelector("#modelos").disabled = true;
    document.querySelector("#caracteristicas").disabled = true;

    // volver botones
    document.querySelector("#editarArticulo").style.display = "inline-block";
    document.querySelector("#guardarArticulo").style.display = "none";
    document.querySelector("#cancelarArticulo").style.display = "none";
}
})