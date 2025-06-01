let historialCotizaciones = []

//Funciones
const selectTipo = document.getElementById("select-tipo")
const inputLitros = document.getElementById("input-litros")
const chkPersonalizado = document.getElementById("chk-personalizado")
const contenedorColor = document.getElementById("contenedor-color")
const selectColor = document.getElementById("select-color")
const contenedorAcabado = document.getElementById("contenedor-acabado")
const selectAcabado = document.getElementById("select-acabado")
const btnCotizar = document.getElementById("btn-cotizar")
const divResultado = document.getElementById("resultado")
const textoResultado = document.getElementById("texto-resultado")
const titulos = document.querySelector("h1")

//obtener el precio por litro según el tipo
function obtenerPrecioPorLitro(tipo) {
  const mapaPrecios = {
    latex: 5500,
    sintetico: 7500,
    barniz: 8000,
    laca: 12000
  }
  return mapaPrecios[tipo] || 0
}

//Título Style
titulos.style.letterSpacing = "1px"
titulos.style.color = "darkslateblue"
titulos.style.fontSize = "2.5rem"
titulos.style.fontWeight = "bold"

chkPersonalizado.addEventListener("change", () => {
  if (chkPersonalizado.checked) {
    contenedorColor.style.display = "block"
    contenedorAcabado.style.display = "block"
  } else {
    contenedorColor.style.display = "none"
    contenedorAcabado.style.display = "none"
    selectColor.value = ""
    selectAcabado.value = ""
  }
})

btnCotizar.addEventListener("click", () => {
  if (!selectTipo.value) {
    return
  }
  const litrosVal = parseInt(inputLitros.value)
  if (isNaN(litrosVal) || litrosVal < 1) {
    return
  }
  if (chkPersonalizado.checked) {
    if (!selectColor.value && !selectAcabado.value) {
      return
    }
  }

  //Calcular precio
  const tipoElegido = selectTipo.value
  const precioPorLitro = obtenerPrecioPorLitro(tipoElegido)

  //total sin y con personalización
  let total = precioPorLitro * litrosVal
  const esPersonal = chkPersonalizado.checked
  let colorElegido = ""
  let acabadoElegido = ""
  if (esPersonal) {
    total = Math.round(total * 1.15)
    colorElegido = selectColor.value
    acabadoElegido = selectAcabado.value
  }

  const fechaHora = new Date().toLocaleString()

  //Mostrar resultado
  const texto = "Tipo: " + tipoElegido +
    " | Litros: " + litrosVal +
    (esPersonal
      ? " | Color: " + colorElegido + ", Acabado: " + acabadoElegido
      : " | Sin personalizar"
    ) +
    " → Total: $" + total
  textoResultado.innerText = texto
  divResultado.style.display = "block"

  //crear obj  c/datos de esta cotización
  const objetoCot = {
    fecha: fechaHora,
    tipo: tipoElegido,
    litros: litrosVal,
    personalizado: esPersonal,
    color: colorElegido,
    acabado: acabadoElegido,
    total: total
  }

  //guarda en localStorage
  historialCotizaciones.push(objetoCot)
  localStorage.setItem("historialCotizaciones", JSON.stringify(historialCotizaciones))

  //limpiar
  selectTipo.value = ""
  inputLitros.value = ""
  chkPersonalizado.checked = false
  contenedorColor.style.display = "none"
  contenedorAcabado.style.display = "none"
  selectColor.value = ""
  selectAcabado.value = ""
})
