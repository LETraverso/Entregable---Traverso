let carrito = JSON.parse(localStorage.getItem("carrito")) || []

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://68607ed58e7486408443590c.mockapi.io/api/v1/productos")
    .then(res => res.json())
    .then(data => renderizarTarjetas(data))

  renderizarCarrito()
})

function renderizarTarjetas(productos) {
  const container = document.getElementById("productos-container")
  container.innerHTML = ""

  productos.forEach(prod => {
    const tarjeta = document.createElement("div")
    tarjeta.className = "tarjeta"

    const opciones = prod.presentaciones.map(p =>
      `<option value="${p.litros}">${p.litros}L - $${p.precio}</option>`
    ).join("")

    const traduccionColores = {
      rojo: "red", azul: "blue", verde: "green", amarillo: "yellow", blanco: "white",
      negro: "black", gris: "gray", marrón: "brown", naranja: "orange",
      violeta: "purple", celeste: "skyblue",
      transparente: "rgba(200,200,200,0.3)"
    }

    // Genera spans de colores o mensaje “Sin colores” si no hay array
    
    const colores = Array.isArray(prod.colores) ? prod.colores.map(c => {
      const color = traduccionColores[c.toLowerCase()] || "gray"
      return `<span class="color-tag" data-color="${c}" style="background-color:${color}" title="${c}"></span>`
    }).join("") : "<span style='font-size: 0.85rem; color: gray;'>Sin colores</span>"

    tarjeta.innerHTML = `
      ${prod.imagen ? `<img src="${prod.imagen}" alt="${prod.tipo}" class="imagen-producto" />` : ""}
      <h3>${prod.tipo.toUpperCase()}</h3>
      <p><strong>Marca:</strong> ${prod.marca}</p>
      <p>${prod.descripcion}</p>
      <div class="colores-container"><strong>Colores:</strong> ${colores}</div>
      <label>Litros: <select class="select-litros">${opciones}</select></label>
      <button>Agregar al carrito</button>
    `

    const select = tarjeta.querySelector(".select-litros")
    const button = tarjeta.querySelector("button")
    let colorSeleccionado = null

    tarjeta.querySelectorAll(".color-tag").forEach(tag => {
      tag.addEventListener("click", () => {
        tarjeta.querySelectorAll(".color-tag").forEach(t => t.classList.remove("seleccionado"))
        tag.classList.add("seleccionado")
        colorSeleccionado = tag.getAttribute("data-color")
      })
    })

    button.addEventListener("click", () => {
      const litros = parseInt(select.value)
      const presentacion = prod.presentaciones.find(p => p.litros === litros)
      if (!presentacion) return

      let precio = presentacion.precio
      if (colorSeleccionado) precio *= 1.15

      carrito.push({
        tipo: prod.tipo,
        marca: prod.marca,
        litros,
        precio,
        color: colorSeleccionado || "Sin selección"
      })

      guardarCarrito()
      renderizarCarrito()

      Swal.fire({
        icon: 'success',
        title: 'Producto agregado al carrito',
        text: `${prod.tipo} - ${litros}L - $${precio.toLocaleString()}`,
        timer: 2000,
        showConfirmButton: false
      })
    })

    container.appendChild(tarjeta)
  })
}

function renderizarCarrito() {
  const div = document.getElementById("carrito") || document.createElement("div")
  div.id = "carrito"
  div.innerHTML = "<h3>🛒 Carrito de Compras</h3>"

  const lista = document.createElement("ul")
  carrito.forEach(item => {
    const li = document.createElement("li")
    li.textContent = `${item.tipo} (${item.litros}L) - $${item.precio.toFixed(2)} - Color: ${item.color}`
    lista.appendChild(li)
  })

  div.appendChild(lista)

  const total = carrito.reduce((acc, item) => acc + item.precio, 0)
  const totalElem = document.createElement("p")
  totalElem.className = "total-carrito"
  totalElem.textContent = `Total: $${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
  div.appendChild(totalElem)

  const vaciarBtn = document.createElement("button")
  vaciarBtn.textContent = "Vaciar Carrito"
  vaciarBtn.className = "boton-carrito"
  vaciarBtn.addEventListener("click", () => {
    carrito = []
    guardarCarrito()
    renderizarCarrito()
  })

  const comprarBtn = document.createElement("button")
  comprarBtn.textContent = "Finalizar Compra"
  comprarBtn.className = "boton-carrito"
  comprarBtn.addEventListener("click", () => {
    if (carrito.length === 0) return alert("El carrito está vacío")
    carrito = []
    guardarCarrito()
    renderizarCarrito()
    Swal.fire("¡Compra realizada con éxito!", "Muchas gracias", "success")
  })

  div.appendChild(vaciarBtn)
  div.appendChild(comprarBtn)

  document.body.appendChild(div)
}






