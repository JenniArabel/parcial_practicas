document.addEventListener("DOMContentLoaded", traerDatos);

const burgerMenu = document.querySelector("#menu-icono");
const desktopMenu = document.querySelector(".menu-desktop");
const mobileMenu = document.querySelector(".menu-mobile");

let total = 0;

const carritoIcon = document.getElementById("carrito-icono");

carritoIcon.addEventListener('click', function(event) {
  event.stopPropagation(); //Evita que el evento de click se propague a elementos superiores
  toggleCarrito();
});

burgerMenu.addEventListener('click', toggleDesktopMenu);
burgerMenu.addEventListener('click', toggleMobileMenu);

function traerDatos() {
  const listaRemeras = new XMLHttpRequest();
  listaRemeras.open("GET", "stockRemeras.json", true);

  const filtroInput = document.querySelector(".filtro");
  const filtrarButton = document.querySelector(".filtrar-button");
 
  filtroInput.style.display = "block";
  filtrarButton.style.display = "block";

  filtrarButton.addEventListener("click", function () {
    const filtroInput = document.querySelector(".filtro");
    const remerasDatos = document.querySelector(".remeras-datos");

    const filtroTexto = filtroInput.value.toLowerCase();

    const datosRemeras = JSON.parse(listaRemeras.responseText);

    const datosFiltradosRemeras = datosRemeras.filter(function (itemRemeras) {
      return (
        itemRemeras.articulo.toLowerCase().includes(filtroTexto) ||
        itemRemeras.precio.toString().includes(filtroTexto)
      );
    });

    remerasDatos.innerHTML = "";

    for (let itemRemeras of datosFiltradosRemeras) {
      remerasDatos.innerHTML += `    
        <section> 
          <img src="${itemRemeras.imagen}" alt="${itemRemeras.articulo}">    
          <p>${itemRemeras.articulo}</p>    
          <p>${itemRemeras.talles}</p>    
          <p>${itemRemeras.color}</p>    
          <p>${itemRemeras.precio}</p>
        </section>
      `;
    }
  });

  listaRemeras.onreadystatechange = function () {
    if (listaRemeras.readyState === 4 && listaRemeras.status === 200) {
      let datosRemeras = JSON.parse(listaRemeras.responseText);

      let retornoRemeras = document.querySelector(".remeras-datos");
      retornoRemeras.innerHTML = "";

      for (let itemRemeras of datosRemeras) {
        retornoRemeras.innerHTML += ` 
          <section class="product"> 
            <img src="${itemRemeras.imagen}" alt="${itemRemeras.articulo}">    
            <p>${itemRemeras.articulo}</p>    
            <p>Talles: ${itemRemeras.talles}</p>    
            <p>Color: ${itemRemeras.color}</p>    
            <p>$ ${itemRemeras.precio}</p>
            <button type="button" class="anadir-carrito" onclick="agregarAlCarrito('${itemRemeras.imagen}', '${itemRemeras.articulo}', ${itemRemeras.precio})"> Agregar al carrito </button>
          </section>      
        `;
      }
    }
  };

  listaRemeras.send();
}

function toggleDesktopMenu() {
  const carritoLista = document.getElementById("carrito-list");
  
  carritoLista.style.display = carritoLista.style.display === "block" ? "none" : "none";

  desktopMenu.classList.toggle('inactive');
}

function toggleMobileMenu(){
  const carritoLista = document.getElementById("carrito-list");
  
  carritoLista.style.display = carritoLista.style.display === "block" ? "none" : "none";

  mobileMenu.classList.toggle('inactive');
}

function toggleCarrito() {
  const isDesktopMenuClosed = desktopMenu.classList.contains('inactive');
  const isMobileMenuClosed = mobileMenu.classList.contains('inactive');

  if (!isDesktopMenuClosed) {
    desktopMenu.classList.add('inactive');
  }

  if (!isMobileMenuClosed) {
    mobileMenu.classList.add('inactive');
  }

  const carritoLista = document.getElementById("carrito-list");
  
  carritoLista.style.display = carritoLista.style.display === "none" || carritoLista.style.display === "" ? "block" : "none";
}

function agregarAlCarrito(imagen, articulo, precio) {
  const carritoContainer = document.getElementById("products-carrito");
  const nuevoProducto = document.createElement("div");

  const productId = Date.now().toString(); //Identificador unico para el producto

  nuevoProducto.id = productId;
  nuevoProducto.className = "producto-carrito";
  nuevoProducto.innerHTML = `<img src="${imagen}" alt="${articulo}"> 
                            <p> ${articulo} </p>  
                            <p> $ ${precio} </p>
                            <img src="/parcial_practicas/Imagenes/icon_close.png" alt="Eliminar producto" class="eliminar-producto" onclick="eliminarProducto('${productId}', ${precio})">
                            `;

  carritoContainer.appendChild(nuevoProducto);

  total += precio;
  actualizarTotal();
}

function eliminarProducto (productId, precio) {
  const product = document.getElementById(productId);

  product.remove();

  total -= precio;
  actualizarTotal();
}

function actualizarTotal() {
  const totalAmountElement = document.getElementById("total-amount");
  totalAmountElement.textContent = `$ ${total}`;
}