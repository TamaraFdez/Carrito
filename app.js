const url = "./tienda.json";
const container = document.querySelector(".container");

const btnCart = document.querySelector(".container-cart");
const containerCartProducts = document.querySelector(".cart");


const countProducts = document.querySelector("#contador-productos");

btnCart.addEventListener("click", () => {
  containerCartProducts.classList.toggle("hidden-cart");
});

// traer datos y renderizarlos
//importante que sea async function
async function getData() {
  //manejo de try catch finally para evitar errores
  //pone un mensaje de cargando si aun no hay datos
  container.innerHTML = "<p>Cargando productos...</p>";
 
  try {
    //variable donde guardar los datos que trae el fetch
    const response = await fetch(url);
    //parsear el json para transformarlo en objeto
    const result = await response.json();
    //devolver el obejto
    return result.items;
  } catch (error) {
    // si hay un error lo enviamos a la consola
    return console.error("ha habido un error en el fetch", error);
  }finally{
    // Elimina el mensaje de cargando cuando termina el fetch 
    container.innerHTML = ''
  }
}

//funcion que renderiza los datos
function renderAll(data) {
  //si no hay datos devolvemos error
  if (!data) {
    return console.error("Los datos estan vacios o no son válidos");
  }
  //iteramos sobre los datos llamando a una funcion
  data.forEach(renderRecipe);
}

//funcion a la que le pasamos los datos desestructurados cada iteracion
function renderRecipe({ name, price, img }) {
  //creo div
  const div = document.createElement("div");
  //le doy una clase para los estilos
  div.classList.add("product-card");
  //relleno el div con los datos y todo lo necesario añadiendo html clases y el boton
  div.innerHTML = `
    <img src="${img}" alt="imagen de ${name}">
    <div class="main-card">
    <h2>${name}</h2>
    <p>${price}€</p>
    </div>
    
    <button class="btn-tienda">Añadir al carrito</button>
    
    `;

  //se lo añadimos al container
  container.append(div);
}

//Añadir al carro

let allProducts = [];

container.addEventListener("click", (e) => {
  //mirar los eventos target y seleccionar el padre del boton que hemos hecho click

  if (e.target.classList.contains("btn-tienda")) {
    const product = e.target.parentElement;
    //Se guarda la informacion del producto en un objeto
    const infoProduct = {
      cantidad: 1,
      precio: product.querySelector("p").textContent,
      item: product.querySelector("h2").textContent,
    };

    //some devuelve true si encuentra coincidencias
    const exits = allProducts.some(
        (product) => product.item == infoProduct.item
      );
    //si existe coincidencia hacemos map para aumentar la cantidad del item del que se encontro coincidencia
      if (exits) {
        const products = allProducts.map((product) => {
          if (product.item === infoProduct.item) {
            product.cantidad++;
            return product;
          } else {
            return product;
          }
        });
        //se guarda el nuevo array editando la cantidad
        allProducts = [...products];
      } else {

        //si no encuentra coincidencias añade producto nuevo
        allProducts = [...allProducts, infoProduct];
      }
    //Añadir producto al array
   

    showCart();
  }
});

const showCart = () => {
    //Limpiamos el carrito antes de enseñar los productos para quitar el mensaje de que no hay productos 
    //y evitar se dupliquen los productos al añadirlos
  containerCartProducts.innerHTML = "";
//si no hay productos crea un div con el mensaje del carrito vacio
  if (!allProducts.length) {
    const div = document.createElement("div");
    div.textContent = "Tu carrito esta vacio";
    containerCartProducts.append(div);
  }

  let total = 0;
  let totalOfProducts = 0;
  //si hay productos itera sobre el array y por cada uno crea un div y lo rellena con la info de producto
  allProducts.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product-cart");
    div.innerHTML = `
        
        <div class="info-cart-product">
        <span class="cantidad-producto-carrito">${product.cantidad}</span>
        <p class="titulo-producto-carrito">${product.item}</p>
        <span class="precio-producto-carrito">${product.precio}</span>
        </div>
        <button class="btn-eliminar">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="icon-close"
        >
        <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
        />
        </svg>
        </button>
        `;
    containerCartProducts.append(div);

    //calculo para cambiar el precio cuando es mas de 1 y los suma en el siguiente
    total = total + parseFloat(product.cantidad * parseFloat(product.precio.replace('€', '')))
    totalOfProducts = totalOfProducts + product.cantidad
  });

  //añadimos un div para enseñar el rpecio total en el carrito
  const div = document.createElement('div')
  div.innerHTML= `
  <div class="cart-total">
      <h3>Total:</h3>
      <span class="total-pagar">${total}€</span>
  `
containerCartProducts.append(div)
//añadimos el contador de productos para que se vea en el icono
  countProducts.textContent = totalOfProducts
};

//Escucha el evento de click sobre la cruz y selecciona al padre/ancestro con closest que tenga esa clase
containerCartProducts.addEventListener("click", (e) => {
  if (e.target.classList.contains("icon-close")) {
    const productDiv = e.target.closest(".product-cart");

//seleccionamos el parrafo que es donde esta el nombre del producto y filtramos con filter todos los que no coincidan
//  y haciendo un nuevo array excluyendo coincidencias
    const item = productDiv.querySelector("p").textContent;
    allProducts = allProducts.filter((product) => product.item !== item);

    showCart();
  }
});

async function init() {
  //funcion de inicio que pide datos a un fetch
  const data = await getData();
  //cuando tiene los datos los renderizamos
  renderAll(data);
}
init();
