//Api de mockapi
api = 'https://62aa18c0371180affbcf5815.mockapi.io/pedido';
/** METODOS PARA COMUNICARSE CON LA API CREDA */
/** Obtener todos los datos de nuestros  pedido */
getAll = async function () {
    try {
        const respuesta = await fetch(this.api);
        //const data = await respuesta.json();
        if (respuesta.status == 200) {
            let json = await respuesta.json(); // (3)
            //console.log(json);
            return json;
        }
    } catch (error) {
        console.log("ERROR: " + error)
    }
};
/** Eliminar un registro de un producto */
eliminar = async function (id) {
    try {
        const respuesta = await fetch(api + '/' + id, {
            method: "DELETE",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
        const data = await respuesta.json();
        if (respuesta.status == 200) {
            console.log("Registro eliminado: " + data)
            var item = document.getElementById("row-" + id);
            item.parentNode.removeChild(item);
            alert("Registro eliminado!")
        }
    } catch (error) {
        console.log("ERROR: " + error)
    }
};
/** Crear un nuevo registro de un producto */
guardar = async function (pedido) {
    try {
        const respuesta = await fetch(api, {
            method: "POST",
            body: JSON.stringify(pedido),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
        const data = await respuesta.json();
        if (respuesta.status == 201) {
            console.log("Registro creado!")
            return data;
        }
    } catch (error) {
        console.log("ERROR: " + error)
    }
};
/** METODOS PARA actualizar */
modificar = async function (id) {
    let url = this.api + '/' + id;
    const seccion = document.getElementById('seccionModificar');
    seccion.classList.remove("d-none");
    const response = await fetch(url).then(response => response.json());
    seccion.innerHTML += `
        <h2>modificar</h2> 
        <form action="#"> 
            <div class="mb-3"> 
                <label for="fechaS" class="form-label">Fecha</label> 
                <input type="date" class="form-control" id="fechaS" placeholder="Ingrese el fecha del pedido" value="${response.fecha}"> 
            </div> 
            <div class="mb-3"> <label for="codigoS" class="form-label">Codigo</label> 
                <input type="text" class="form-control" id="codigoS" placeholder="Ingrese el codigo en pedido" value="${response.codigo}"> 
            </div> 
            <div class="mb-3"> <label for="destinoS" class="form-label">Destino</label> 
                <input type="text" class="form-control" id="destinoS" placeholder="Ingrese el destino en pedido" value="${response.destino}"> 
            </div> 
            <div class="mb-3"> 
                <input type="button" class="btn btn-primary" value="modificar" onclick="actualizardatos(${response.id})"> 
                <input type="button" class="btn btn-danger" id="btnCancelarM" value="Cancelar" onclick="location.reload()"> 
            </div> 
        </form>`
};
actualizardatos = async function (id) {
    let url = this.api + '/' + id;
    console.log(id);
    const pedido = {
        fecha: document.getElementById('fechaS').value,
        codigo: document.getElementById('codigoS').value,
        destino: document.getElementById('destinoS').value
    };
    console.log(pedido);
    const actualizar = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    });
    document.getElementById('fechaS').value = "";
    document.getElementById('codigoS').value = "";
    document.getElementById('destinoS').value = "";
    limpiarFormulario();
    cargarDatos();
    alert("Actualizado con éxito!");
    location.reload();
    return actualizar.json();
};



/** METODOS PARA LA INTERFAZ GRÁFICA */
/** Función que carga los datos del Api una vez se termina de cargar la
página*/
function cargarDatos() {
    var tablaDatos = document.getElementById("tblDatos");
    var tBodyDatos = document.getElementById("tbdDatos");
    const todos = getAll()
        .then(data => {
            //console.log(data);
            //Varible global
            datosJson = data;
            data.forEach((element, index) => {
                //Por cada registro obtenido se crea una nueva fila y se agrega al Body de la tabla
                var row = document.createElement("TR");
                var col1 = document.createElement("TD");
                col1.innerHTML = element.id;
                var col2 = document.createElement("TD");
                col2.innerHTML = element.fecha;
                var col3 = document.createElement("TD");
                col3.innerHTML = element.codigo;
                var col4 = document.createElement("TD");
                col4.innerHTML = element.destino;
                var col5 = document.createElement("TD");
                col5.innerHTML = `<a class="btn btn-primary me-1 my1" id="modificar" href="#"onclick="modificar(${element.id})">Modificar</a><a class="btn btn-danger"id="eliminar" href="#"onclick="eliminar(${element.id})">Eliminar</a>`;
                row.appendChild(col1);
                row.appendChild(col2);
                row.appendChild(col3);
                row.appendChild(col4);
                row.appendChild(col5);
                row.id = "row-" + element.id
                tBodyDatos.appendChild(row);
            });
        });
}
/** Función para ver formulario para agregar pizza */
document.getElementById("btnAgregar").addEventListener("click", (e) => {
    seccion = document.getElementById("seccionFormulario");
    seccion.classList.remove("d-none");
    e.preventDefault();
});
/** Función que sirve para limpiar los datos del formulario */
function limpiarFormulario() {
    /** Limpiar datos del formulario */
    document.getElementById("fecha").value = "";
    document.getElementById("codigo").value = "";
    document.getElementById("destino").value = "";
}
/** Función para ocultar formulario */
document.getElementById("btnCancelar").addEventListener("click", (e) => {
    seccion = document.getElementById("seccionFormulario");
    seccion.classList.add("d-none");
    /** Limpiar datos del formulario */
    limpiarFormulario()
    e.preventDefault();
});
/** Función para ver formulario para agregar pizza */
document.getElementById("btnGuardar").addEventListener("click", (e) => {
    pedido = {
        //Creamos el objeto a partir de los datos ingresados en elformulario
        fecha: document.getElementById("fecha").value,
        codigo: document.getElementById("codigo").value,
        destino: document.getElementById("destino").value
    }
    guardar(pedido)
        .then(response => {
            console.log(response)
            return response
        })
        .then(data => {
            console.log(data)
            alert("Registro creado con éxito!")
            //Se agrega nueva fila y se agrega al Body de la tabla
            var tBodyDatos = document.getElementById("tbdDatos");
            var row = document.createElement("TR");
            var col1 = document.createElement("TD");
            col1.innerHTML = data.id;
            var col2 = document.createElement("TD");
            col2.innerHTML = data.fecha;
            var col3 = document.createElement("TD");
            col3.innerHTML = data.codigo;
            var col4 = document.createElement("TD");
            col4.innerHTML = data.destino;
            var col5 = document.createElement("TD");
            col5.innerHTML = `<a class="btn btn-primary me-1 my-1"id="modificar" href="#"onclick="">Modificar</a><a class="btn btn-danger" id="modificar"href="#"onclick="eliminar(${data.id})">Eliminar</a>`;
            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);
            row.appendChild(col5);
            row.id = "row-" + data.id
            tBodyDatos.appendChild(row);
            /** Limpiar datos del formulario */
            limpiarFormulario()
        })
        .catch(function (err) {
            console.log("Se presento un error en la petición");
            console.error(err);
        });
    e.preventDefault();
});