let cart = [];
let totalPrice = 0;

const cards = document.querySelectorAll('.card');

// Recuperar del localStorage si existía algo
if (localStorage.getItem('productos')) {
    cart = JSON.parse(localStorage.getItem('productos'));
    totalPrice = parseFloat(localStorage.getItem('total'));
    document.querySelector('.count').textContent = cart.length;
}

// ----------------------
// AGREGAR PRODUCTOS
// ----------------------
cards.forEach(card => {
    const button = card.querySelector('button');
    const titleProduct = card.querySelector('h4').textContent;
    const priceProduct = parseFloat(
        card.querySelector('p:last-child span').textContent.slice(1)
    );

    button.addEventListener('click', () => {

        // Buscar si el producto ya existe en el carrito
        const existingProduct = cart.find(item => item.title === titleProduct);

        if (existingProduct) {
            existingProduct.count++;
            totalPrice += priceProduct;

        } else {
            cart.push({
                title: titleProduct,
                price: priceProduct,
                count: 1,
            });

            totalPrice += priceProduct;
        }

        // Guardar en localStorage
        localStorage.setItem('productos', JSON.stringify(cart));
        localStorage.setItem('total', totalPrice.toString());

        // Actualizar contador visible
        document.querySelector('.count').textContent = cart.length;
    });
});

// ----------------------
//  CARROUSEL
// ----------------------

document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const dotsContainer = document.querySelector(".carousel-dots");

    let index = 0;

    // Crear los dots
    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("span");

    function updateCarousel() {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");
    }

    function nextSlide() {
        index = (index + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        index = (index - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    function goToSlide(i) {
        index = i;
        updateCarousel();
    }

    // Botones
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Auto-play cada 4 segundos
    setInterval(nextSlide, 4000);
});



// ----------------------
// MOSTRAR EL CARRITO
// ----------------------
function handleCart() {
    const cart = JSON.parse(localStorage.getItem('productos')) || [];
    totalPrice = parseFloat(localStorage.getItem('total')) || 0;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

    const table = document.getElementById('cartTable');
    table.innerHTML = "";

    if (cart.length === 0) {
        table.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }

    // Encabezado
    table.innerHTML = `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th class="actions">Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    cart.forEach((producto, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${producto.title}</td>
            <td>$${producto.price}</td>
            <td>${producto.count}</td>
            <td class="actions">
                <button class="btn-cant" onclick="modificarCant(${index}, -1)">-</button>
                <button class="btn-cant" onclick="modificarCant(${index}, 1)">+</button>
                <button class="btn-delete" onclick="eliminarProducto(${index})">X</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


// ----------------------
// BOTONES +  -  X
// ----------------------
function activarBotones() {
    const cart = JSON.parse(localStorage.getItem('productos')) || [];

    // SUMAR CANTIDAD
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const titulo = e.target.dataset.title;
            const item = cart.find(p => p.title === titulo);

            item.count++;

            guardarYActualizar(cart);
        });
    });

    // RESTAR CANTIDAD
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const titulo = e.target.dataset.title;
            const item = cart.find(p => p.title === titulo);

            if (item.count > 1) {
                item.count--;
            } else {
                // Si llega a 0 lo eliminamos
                const index = cart.indexOf(item);
                cart.splice(index, 1);
            }

            guardarYActualizar(cart);
        });
    });

    // ELIMINAR PRODUCTO COMPLETO
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const titulo = e.target.dataset.title;

            const nuevoCarrito = cart.filter(p => p.title !== titulo);

            guardarYActualizar(nuevoCarrito);
        });
    });
}


// ----------------------
// GUARDAR + RECALCULAR + RECARGAR
// ----------------------
function guardarYActualizar(carritoActualizado) {
    // Recalcular total
    let nuevoTotal = carritoActualizado.reduce(
        (acc, p) => acc + (p.price * p.count), 0
    );

    // Guardar en localStorage
    localStorage.setItem('productos', JSON.stringify(carritoActualizado));
    localStorage.setItem('total', nuevoTotal);

    // Actualizar contador del icono del carrito
    document.querySelector('.count').textContent = carritoActualizado.length;

    // Actualizar vista SIN recargar página
    handleCart();
}


// ----------------------
// LIMPIAR CARRITO COMPLETO
// ----------------------
function limpiarCarrito() {
    if (confirm('¿Estás seguro/a de vaciar el Carrito?')) {
        cart = [];
        totalPrice = 0;
        document.querySelector('.count').textContent = 0;
        localStorage.removeItem('productos');
        localStorage.removeItem('total');

        handleCart();
    }
}

document.addEventListener('DOMContentLoaded', handleCart);

function modificarCant(index, cambio) {
    let cart = JSON.parse(localStorage.getItem("productos")) || [];

    cart[index].count += cambio;

    // Si la cantidad llega a cero → eliminar producto
    if (cart[index].count <= 0) {
        cart.splice(index, 1);
    }

    // recalcular total
    totalPrice = cart.reduce((acc, item) => acc + item.price * item.count, 0);

    // guardar cambios
    localStorage.setItem("productos", JSON.stringify(cart));
    localStorage.setItem("total", totalPrice.toString());

    handleCart();
}

function eliminarProducto(index) {
    let cart = JSON.parse(localStorage.getItem("productos")) || [];

    cart.splice(index, 1);

    totalPrice = cart.reduce((acc, item) => acc + item.price * item.count, 0);

    localStorage.setItem("productos", JSON.stringify(cart));
    localStorage.setItem("total", totalPrice.toString());

    handleCart();
}
