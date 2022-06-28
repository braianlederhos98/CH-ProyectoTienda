const card = document.querySelector('#remeras');
const items = document.querySelector('#items')
const footer = document.querySelector('#footer')
const cardCarrito = document.querySelector('#cards');
const templateCard = document.querySelector('#templateCard').content;
const templateCarrito = document.querySelector('#templateCarrito').content;
const templateFooter = document.querySelector('#templateFooter').content;
const finalizarCompra = document.querySelector('#finalizarCompra')

let carro = {};


document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carro = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
});

card.addEventListener('click', (e)=>{
    agregarAlCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const fetchData = async () => {
    try {
        loadingData(true);
        
        const res = await fetch("./productos.json");
        const data = await res.json();

        crearCard(data);
    } catch (error) {
        console.log(error);
    } finally {
        loadingData(false);
    }
};

const loadingData = (estado) => {
    const loading = document.querySelector("#loading");
    if (estado) {
        loading.classList.remove("d-none");
    } else {
        loading.classList.add("d-none");
    }
};


const crearCard = (productos)=>{
    card.textContent = '';
    const fragment = document.createDocumentFragment()
    productos.forEach(item=>{

        const clone = templateCard.cloneNode(true);
        const srcImg = `./img/${item.id}.jpg`;
        const altImg = `Imagen de remera de ${item.nombre}`;

        clone.querySelector('img').setAttribute("src", srcImg);
        clone.querySelector('img').setAttribute("alt", altImg);
        clone.querySelector('.text-primary').textContent = `Remera de ${item.nombre}`;
        clone.querySelector('.text-secondary span').textContent = item.precio;
        clone.querySelector('.btn').dataset.id = item.id
        fragment.appendChild(clone);
    })
    card.appendChild(fragment);
}


const agregarAlCarrito = (e) =>{
    const button = e.target.classList.contains('btn')
    if (button) {
        setCarro(e.target.parentElement)
    }
}

const setCarro = objeto => {
    const producto = {
        id: objeto.querySelector('.btn').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('span').textContent,
        cantidad: 1
    }
    if (carro.hasOwnProperty(producto.id)) {
        producto.cantidad = carro[producto.id].cantidad + 1
    }

    carro[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () =>{
    const fragment = document.createDocumentFragment()
    items.textContent = ''
    Object.values(carro).forEach(producto=>{
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('span').textContent = producto.cantidad*producto.precio;
        
        const clone = templateCarrito.cloneNode(true)

        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
    finalizarCompra.classList.remove('d-none')
    localStorage.setItem('carrito', JSON.stringify(carro))
}



const pintarFooter = () => {
    const fragment = document.createDocumentFragment()
    footer.innerHTML=''
    if (Object.keys(carro).length === 0) {
        finalizarCompra.classList.add('d-none')
        footer.innerHTML=`<th scope="row" colspan="5">Carrito vacío</th>`
        return
    }

    const nCantidad = Object.values(carro).reduce((acc,{cantidad})=>acc + cantidad,0)
    const nPrecio = Object.values(carro).reduce((acc,{cantidad,precio})=> acc + cantidad * precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.querySelector('#vaciarCarrito')
    btnVaciar.addEventListener('click', ()=>{
        alertaVaciar() 
    })
}

const btnAccion = (e)=>{
    if(e.target.classList.contains('btn-info')){ 
        const producto = carro[e.target.dataset.id];
        producto.cantidad++;
        carro[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){ 
        const producto = carro[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carro[e.target.dataset.id];
        }
        pintarCarrito()
    }
    if (Object.keys(carro).length === 0) {
        finalizarCompra.classList.add('d-none')
    }
}


const alerta = ()=>{
    Swal.fire({
        icon: 'success',
        title: 'Perfecto',
        text: '¡Producto añadido con éxito!'
    })
}

const alertaVaciar = () => {
    Swal.fire({
        title: 'Se vaciará el carrito',
        text: "Usted está seguro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, vaciar.'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Vaciadoo con éxito'
            )
            carro = {};
            pintarCarrito()
            finalizarCompra.classList.add('d-none')
        }
    })
}






















