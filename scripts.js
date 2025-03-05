// Crear los botones de adición automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    crearBotonesAdicion();
    actualizarPrecio();
    mostrarBoton();
});

// Función para mostrar/ocultar el botón basado en el scroll
window.onscroll = function () {
    mostrarBoton();
};

function mostrarBoton() {
const scrollButton = document.getElementById("botonarriba");
    if (document.body.scrollTop > 650 || document.documentElement.scrollTop > 650) {
        scrollButton.classList.add('show'); // Muestra el botón si el scroll supera 100px
    } else {
        scrollButton.classList.remove('show'); // Oculta el botón si el scroll es menor
    }
}

// Función para crear botones de adición
function crearBotonesAdicion() {
    const productos = document.querySelectorAll('.listajuegos li');

    productos.forEach((producto) => {
        producto.style.position = "relative";
        if (!producto.querySelector('.add-button')) {
            const addButton = crearBoton("+", "add-button", "blue", function () {
                moverProducto(producto);
            });
            producto.appendChild(addButton);
        }
    });
}
    
    // Funcion para verificar si hay elementos en la lista de descartados
    function hayDescartados(){
    const juegosdescartadosDiv = document.getElementById("juegosdescartados");
    const listaDescartados = juegosdescartadosDiv.querySelectorAll('li');
    juegosdescartadosDiv.style.display = listaDescartados.length > 0 ? "block" : "none";}

// Función para mover un producto al div de resultados
function moverProducto(producto) {
    const resultadosDiv = document.getElementById("resultados");
    const listaResultados = resultadosDiv.querySelector("ul");
    const calculoprecio = document.getElementById("calculoprecio");

    listaResultados.style.display = "flex";
    calculoprecio.style.display = "block";

    // Eliminar botón de añadir si existe
    const addButton = producto.querySelector('.add-button');
    if (addButton) addButton.remove();

    // Crear botón de eliminar
    if (!producto.querySelector('.remove-button')) {
        const removeButton = crearBoton("x", "remove-button", "red", function () {
            devolverProducto(producto);
        });
        producto.appendChild(removeButton);
    }

    listaResultados.appendChild(producto);
    hayDescartados();
    actualizarPrecio();
}

// Función para devolver un producto a juegosdescartadosDiv
function devolverProducto(producto) {
    const juegosdescartadosDiv = document.getElementById("juegosdescartados");
    const listaDescartados = juegosdescartadosDiv.querySelector('ul');

    // Eliminar botón de eliminar
    const removeButton = producto.querySelector('.remove-button');
    if (removeButton) removeButton.remove();

    // Crear botón de añadir
    if (!producto.querySelector('.add-button')) {
        const addButton = crearBoton("+", "add-button", "blue", function () {
            moverProducto(producto);
        });
        producto.appendChild(addButton);
    }


    listaDescartados.appendChild(producto);

    ordenarListaAlfabeticamente(listaDescartados);
    hayDescartados();
    actualizarPrecio();
}

// Función para mover todos los elementos de juegosdescartadosDiv a resultadosDiv
function agregarTodo() {
    const juegosdescartadosDiv = document.getElementById("juegosdescartados");
    const resultadosDiv = document.getElementById("resultados");
    const items = Array.from(juegosdescartadosDiv.querySelectorAll('li'));

    items.forEach(item => {
        moverProducto(item); // Reutilizamos la función para asegurar la lógica consistente
    });
    juegosdescartadosDiv.style.display = "none";
    actualizarPrecio();
}

// Función para borrar todos los elementos de resultadosDiv y moverlos a juegosdescartadosDiv
function eliminarTodo() {
    const resultadosDiv = document.getElementById("resultados");
    const items = Array.from(resultadosDiv.querySelectorAll('li'));

    items.forEach(item => {
        devolverProducto(item); // Reutilizamos la función para asegurar la lógica consistente
    });
    hayDescartados();
    actualizarPrecio();
}

// Función para actualizar el precio total
function actualizarPrecio() {
    const resultadosDiv = document.getElementById("resultados");
    const calculoprecio = document.getElementById("calculoprecio");
    const items = resultadosDiv.querySelectorAll('li');
    let total = 0;

    items.forEach(item => {
        const price = parseFloat(item.getAttribute("data-price"));
        if (!isNaN(price)) total += price;
    });

    calculoprecio.textContent = "Precio total: " + total + "$";

    resultadosDiv.style.display = items.length > 0 ? "block" : "none";
    calculoprecio.style.display = items.length > 0 ? "block" : "none";
}

// Función para ordenar alfabéticamente una lista
function ordenarListaAlfabeticamente(lista) {
    const items = Array.from(lista.querySelectorAll('li'));

    items.sort((a, b) => {
        const textA = a.textContent.trim().toLowerCase();
        const textB = b.textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    lista.innerHTML = ""; // Vaciar la lista
    items.forEach(item => lista.appendChild(item));
}

// Función para crear un botón con propiedades
function crearBoton(text, className, color, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.style.marginLeft = "10px";
    button.style.cursor = "pointer";
    button.style.color = color;
    button.onclick = onClick;
    return button;
}

//Función para establecer la búsqueda
function busqueda() {
    const maxPrice = parseFloat(document.getElementById("buscarprecio").value);
    const filtroNombre = document.getElementById("buscarnombre").value.toLowerCase();
    const grupos = document.querySelectorAll('.grupo-juegos');
    const text = document.getElementById("texto");
    let calculoprecio = document.getElementById("calculoprecio");
    let hayResultados = false;
    const botonborrarbusqueda = document.getElementById('botonborrarbusqueda');
    const botonborrarprecio = document.getElementById('botonborrarprecio');
    const cajaNoHayResultados = document.getElementById("cajaNoHayResultados");
    cajaNoHayResultados.style.display = "none";
    const article = document.querySelector("article");
    article.style.display = "block";

    // Mostrar u ocultar los botones de limpieza de búsqueda según corresponda
    botonborrarbusqueda.style.display = filtroNombre ? "inline-block" : "none";
    botonborrarprecio.style.display = isNaN(maxPrice) ? "none" : "inline-block";

    grupos.forEach((grupo) => {
        const productos = grupo.querySelectorAll('.listajuegos li');
        let mostrarGrupo = false;

        productos.forEach((producto) => {
            const productName = producto.querySelector('img')?.getAttribute("title").toLowerCase() || producto.textContent.toLowerCase();
            const productPrice = parseFloat(producto.getAttribute("data-price"));
            let mostrarProducto = true;

            // Filtrar por precio
            if (!isNaN(maxPrice) && productPrice > maxPrice) {
                mostrarProducto = false;
            }

            // Filtrar por nombre
            if (filtroNombre !== "" && !productName.includes(filtroNombre)) {
                mostrarProducto = false;
            }
            
            text.style.display = mostrarProducto ? "flex" : "none";
            producto.style.display = mostrarProducto ? "list-item" : "none";

            if (mostrarProducto) {
                mostrarGrupo = true;
                hayResultados = true;
            }
        });

        grupo.style.display = mostrarGrupo ? "block" : "none";
    });

    // Manejo correcto del texto de "No hay resultados."
    if (!hayResultados) {
        cajaNoHayResultados.style.display = "block";
        cajaNoHayResultados.innerHTML =  "No hay resultados.";
        article.style.display = "none";
     }

    // Mostrar u ocultar el cálculo de precio
    if (calculoprecio.textContent.trim() !== "") {
        calculoprecio.style.display = "block";
    }
}

    // Función para borrar el campo de búsqueda
    function borrarBusqueda() {
    const buscarnombreInput = document.getElementById('buscarnombre');
    // Limpiar el campo de texto
    buscarnombreInput.value = "";
    busqueda();
}
    // Función para borrar el campo de precio
 function borrarPrecio(){
    const filtroprecioInput = document.getElementById('buscarprecio');
    // Limpiar el campo de texto
    filtroprecioInput.value = "";
    busqueda();
 }
 //Función para mostrar solo los titulos nuevos o actualizados
function mostrarJuegosNewOrAct() {
    borrarBusqueda();
    borrarPrecio();
    const grupos = document.querySelectorAll('.grupo-juegos');
    const botonJNA = document.getElementById("botonJNA");
    const botonMostrar = document.getElementById("botonMostrar");
    const encabezadosJuegos = document.querySelectorAll('.encabezadosjuegos');
    const text = document.getElementById("texto");
    const divBusqueda = document.getElementById("buscar");
    let hayResultados = false;
 grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll('.listajuegos li');
    productos.forEach((producto) => {
        if (producto.classList.contains('juegosnuevos') || producto.classList.contains('juegosactualizados')){
        producto.style.display = "list-item";
        hayResultados = true;
    } else {
        producto.style.display = "none";
    }
})
 })
 encabezadosJuegos.forEach((encabezadoJuego) => {
 encabezadoJuego.style.display = "none";})
 divBusqueda.style.opacity = "0";
 text.textContent = hayResultados ? "" : "No hay juegos nuevos o actualizados en esta sección.";
 botonJNA.style.display = "none";
 botonMostrar.style.display = "flex";
}
//Función para mostrar todos los juegos de nuevo
function mostrarJuegos() {
    const grupos = document.querySelectorAll('.grupo-juegos');
    const botonJNA = document.getElementById("botonJNA");
    const botonMostrar = document.getElementById("botonMostrar");
    const encabezadosJuegos = document.querySelectorAll('.encabezadosjuegos');
    const text = document.getElementById("texto");
    const divBusqueda = document.getElementById("buscar");
 grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll('.listajuegos li');
    productos.forEach((producto) => {
        producto.style.display = "list-item";
})
 })
 encabezadosJuegos.forEach((encabezadoJuego) => {
 encabezadoJuego.style.display = "block";})
 divBusqueda.style.opacity = "1";
 botonMostrar.style.display = "none";
 botonJNA.style.display = "flex";
 text.textContent = "Todos funcionan en LAN";
}

//Función para mostrar el Menú Desplegable
function mostrarMenu(){
    const menuDesplegado = document.getElementById("menuDesplegado");
    menuDesplegado.style.display = "block";
    const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
    botonMenuDesplegable.style.display = "none";
    const botonMenuDesplegable2 = document.getElementById("botonMenuDesplegable2");
    botonMenuDesplegable2.style.display = "block";
    const botonesMenuDesplegado = document.querySelectorAll('#menuDesplegado a');
    botonesMenuDesplegado.forEach(botonMenu => {
    botonMenu.addEventListener('click', function(){
        cerrarMenu();
        })
    })}

//Función para cerrar el Menú Desplegable
function cerrarMenu(){
    const menuDesplegado = document.getElementById("menuDesplegado");
    const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
    botonMenuDesplegable.style.display = "block";
    const botonMenuDesplegable2 = document.getElementById("botonMenuDesplegable2");
    botonMenuDesplegable2.style.display = "none";
    menuDesplegado.style.display = "none";}

//Función para enviar el listado de juegos agregados por Whatsapp
function enviarListado(){
    const resultadosDiv = document.getElementById("resultados");
    const items = resultadosDiv.querySelectorAll('li');
    let total = 0;
    items.forEach(item => {
        const price = parseFloat(item.getAttribute("data-price"));
        if (!isNaN(price)) total += price;
    });
    const juegos = document.querySelectorAll(".cajaresultados img");
    let mensaje = "Hola! Le escribo para pedirle los siguientes juegos:\n";
    juegos.forEach(juego => {
        mensaje += juego.title + "\n";
    })
    mensaje += "Precio total: " + total + "$";
    //Codificar el mensaje para formato URL
    let mensajeURL = encodeURIComponent(mensaje);
    let URL = `https://wa.me/+5363975093?text=${mensajeURL}`;
    window.open(URL, "_blank");}