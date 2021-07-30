import Anuncio_Auto from "./Anuncio_Auto.js";
import { Etransaccion } from "./app.js";

const Anuncios=JSON.parse(localStorage.getItem("lista")) || []
let anunciosGuardados;
let divTabla = document.getElementById("Tabla");
let checkboxContainer = document.querySelectorAll(".checkboxContainer input");
let checkboxesChecked = {};
let anunciosFiltrados = []; 
let transaccionEnumFiltro = document.getElementById('cmbTransaccionFiltro');
let txtPromedio = document.getElementById('txtPromedio');
let txtPromedioPotencia = document.getElementById('txtPromedioPotencia');
let txtMaxPrecio = document.getElementById('txtMaxPrecio');
let txtMinPrecio = document.getElementById('txtMinPrecio');


window.addEventListener("load", () => {
  getCocineros();
  leerPrefLS();
  inicializarEnumTypescript();
});

window.addEventListener("DOMContentLoaded",()=>{

   document.addEventListener("click",handlerClick);
   document.getElementById("btnAgregar").addEventListener("click",altaCocinero);
   document.getElementById("btnModificar").addEventListener("click",UpdateCocinero);
   document.getElementById("btnEliminar").addEventListener("click",borrarCocinero);
   document.getElementById("btnPreferencias").addEventListener('click', guardarPrefLS);
});

transaccionEnumFiltro.addEventListener('change', (e) => {
  // console.log(e.target.value.toLowerCase());
  const stringDeBusqueda = e.target.value.toLowerCase();
  console.log(stringDeBusqueda);
  // console.log(anunciosGuardados);
  const anunciosEncontrados = anunciosGuardados.filter((anuncio) => {
      return (anuncio.transaccion.toLowerCase().includes(stringDeBusqueda));
  })
  var promedio = anunciosEncontrados
            .map(anuncio => parseFloat(anuncio.precio))//extraigo su precio
            .reduce((previo,actual) => previo+actual)/anunciosEncontrados.length;

  var promediopotencia = anunciosEncontrados
            .map(anuncio => parseFloat(anuncio.potencia))//extraigo La potencia
            .reduce((previo,actual) => previo+actual)/anunciosEncontrados.length;

  var a=0;
  var PrecioMasAlto = anunciosEncontrados
  .map(anuncio => parseFloat(anuncio.precio))//extraigo el precio
  .filter(function(i){
    if (i > a) {
      a = i;
    }
    return i == a;
  });

  var flagMenor = 1;
  var minimo = 0;
  var PrecioMasBajo = anunciosEncontrados
  .map(anuncio => parseFloat(anuncio.precio))//extraigo el precio
  .sort((a,b) => a-b)[0]
  
  console.log(PrecioMasBajo);
  console.log(PrecioMasAlto);
  console.log(promediopotencia);
  console.log(promedio);
  txtPromedio.value = promedio;
  txtPromedioPotencia.value = promediopotencia;
  txtMaxPrecio.value = PrecioMasAlto;
  txtMinPrecio.value = PrecioMasBajo;
  refrescarTabla(divTabla, crearTabla(anunciosEncontrados));
})

function inicializarEnumTypescript(){
  for (const key in Etransaccion) {
    if(isNaN(key)){
      let option = document.createElement('option');
      let texto = document.createTextNode(key);
      option.appendChild(texto);
      option.setAttribute('value', key);
      console.log(option);
      transaccionEnumFiltro.appendChild(option);
    }
  }
}


function almacernaDatos(data){
    localStorage.setItem("lista",JSON.stringify(data));
    handlerLoadList(anunciosGuardados);
  }

function agregarSpinner(){

  let spinner = document.createElement("img");
  spinner.setAttribute("src","./images/rueda.gif");
  spinner.setAttribute("alt","imagen spinner");

  document.getElementById("spinner-container").appendChild(spinner);

}

function handlerLoadList(lista)
{
    renderizarLista(crearTabla(lista),document.getElementById("Tabla"));
}

function renderizarLista(lista, contenedor) {
    while (contenedor.hasChildNodes()) {
      contenedor.removeChild(contenedor.firstChild);
    }
    if(lista)
    {
       contenedor.appendChild(lista);
    }
    
  }

  
function crearTabla(items)
{
  const tabla = document.createElement("table");

  tabla.appendChild(crearThead(items[0]));
  tabla.appendChild(crearTBody(items));

  tabla.classList.add("table");
  tabla.classList.add("table-bordered");
  tabla.classList.add("table-hover");
  tabla.classList.add("mt-5");

  return tabla;
}

function crearThead(item)
{
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  tr.style.backgroundColor = "blue";
  for(const key in item)
  {

    const th = document.createElement("th");
    th.textContent = key;
    tr.appendChild(th);
    
  };
  thead.appendChild(tr);
  thead.classList.add("thead-dark");
  thead.classList.add("text-capitalize");
  thead.classList.add("text-center");
  return thead;
}

function crearTBody(items)
{
  const Tbody = document.createElement("tbody");

    items.forEach((element) => {
    const tr = document.createElement("tr");   
    for(const key in element)
    {
      
      const td = document.createElement("td");
      td.textContent = element[key];     
      tr.appendChild(td);  

      if(key === "id")
      {
        tr.setAttribute("data-id",element[key]);
      }
 
    }
    Tbody.appendChild(tr);  
  }); 
  Tbody.classList.add("text-center");
  Tbody.classList.add("align-items-cente");
  Tbody.classList.add("text-capitalize");
  return Tbody;
}

function handlerClick(e)
{
  if(e.target.matches("td")){
  let id = e.target.parentNode.dataset.id;
  console.log(id);
  cargarFormulario(id);
  }
  else if(e.target.matches("#btnEliminar"))
  {
     let id = parseInt(document.forms[0].id.value);

     if(confirm("Confimar Eliminacion")){
      agregarSpinner();
      setTimeout(() => {
        let indice = Anuncios.findIndex(el=> el.id == id);
        Anuncios.splice(indice,1);
        almacernaDatos(Anuncios);
        eliminarSpinner();
      }, 2000);
     }
  }
}

function cargarFormulario(id){
  
  let anuncio = anunciosGuardados.filter(n=>n.id == id)[0];
  console.log(anuncio);
  document.forms[0].id.value = anuncio.id;
  document.forms[0].Titulo.value = anuncio.titulo;
  document.forms[0].Transaccion.value = anuncio.transaccion;
  document.forms[0].Descripcion.value = anuncio.descripcion;
  document.forms[0].Precio.value = anuncio.precio;
  document.forms[0].Puertas.value = anuncio.puertas;
  document.forms[0].KMS.value = anuncio.km;
  document.forms[0].Potencia.value = anuncio.potencia;

//   document.getElementById("btnGuardar").value = "Modificar";
//   document.getElementById("btnEliminar").classList.remove("oculto");
}

function eliminarSpinner(){
  document.getElementById("spinner-container").innerHTML="";
}

const altaCocinero = ()=>{


    const nuevoCocinero = {
      titulo : document.forms[0].Titulo.value,
      transaccion: document.forms[0].Transaccion.value,
      descripcion: document.forms[0].Descripcion.value,
      precio: document.forms[0].Precio.value,
      puertas: document.forms[0].Puertas.value,
      km: document.forms[0].KMS.value,
      potencia: document.forms[0].Potencia.value
  };

  //Intanciamos el objeto xmlhttprequest
  const xhr = new XMLHttpRequest();

  //Asignar un handler para la peticion
  xhr.onreadystatechange = () => {
      agregarSpinner();
      if(xhr.readyState == 4)
      {
          if(xhr.status >= 200 && xhr.status < 299)
          {
          const data = JSON.parse(xhr.responseText);  
          console.log(data); 
          }
          else{

              const statusText = xhr.statusText || "Ocurrio un error";
              console.error(`Error:${xhr.status} : ${statusText}`);
          }
          eliminarSpinner();
      }
  }                

      // Abrir la peticion
      xhr.open("POST","http://localhost:3001/Anuncios");

      //seteamos las cabeceras 
      xhr.setRequestHeader("Content-Type" , "application/json;charset=utf-8");

      //Enviar la peticion
      xhr.send(JSON.stringify(nuevoCocinero));
};


const UpdateCocinero = ()=>{

  const id = document.forms[0].id.value;
  const nuevoCocinero = {
    titulo : document.forms[0].Titulo.value,
    transaccion: document.forms[0].Transaccion.value,
    descripcion: document.forms[0].Descripcion.value,
    precio: document.forms[0].Precio.value,
    puertas: document.forms[0].Puertas.value,
    km: document.forms[0].KMS.value,
    potencia: document.forms[0].Potencia.value
  };

  //Intanciamos el objeto xmlhttprequest
  const xhr = new XMLHttpRequest();

  //Asignar un handler para la peticion
  xhr.onreadystatechange = ()=>{
      agregarSpinner();
      if(xhr.readyState === 4)
      {
          if(xhr.status === 200)
          {
          const data = JSON.parse(xhr.responseText);  
          console.log(data);
          }
          else{

              const statusText = xhr.statusText || "Ocurrio un error";
              console.error(`Error:${xhr.status} : ${statusText}`);
          }
          eliminarSpinner();
      }
  }

      // Abrir la peticion
      xhr.open("PUT","http://localhost:3001/Anuncios/"+id);
      //seteamos las cabeceras 
      xhr.setRequestHeader("Content-Type" , "application/json;charset=utf-8");
      //Enviar la peticion
      xhr.send(JSON.stringify(nuevoCocinero));
};  


const borrarCocinero = ()=>{
            
  const id = document.forms[0].id.value;

  //Intanciamos el objeto xmlhttprequest
  const xhr = new XMLHttpRequest();
  
  //Asignar un handler para la peticion
  xhr.onreadystatechange = () => {
      
    agregarSpinner();
      
      if(xhr.readyState == 4)
      {
          if(xhr.status >= 200 && xhr.status < 299)
          {
          const data = JSON.parse(xhr.responseText);  
          console.log(data); 
          }
          else{

              const statusText = xhr.statusText || "Ocurrio un error";
              console.error(`Error:${xhr.status} : ${statusText}`);
          }
          eliminarSpinner();
      }
  }
   // Abrir la peticion
         xhr.open("DELETE",`http://localhost:3001/Anuncios/${id}`);
                
        //seteamos las cabeceras 
        xhr.setRequestHeader("Content-Type" , "application/json;charset=utf-8");

        //Enviar la peticion
          xhr.send();
};


const getCocineros = ()=>{

  //Intanciamos el objeto xmlhttprequest
  const xhr = new XMLHttpRequest();
  const data = null;
  //Asignar un handler para la peticion
  xhr.onreadystatechange = ()=>{
      agregarSpinner();
      if(xhr.readyState == 4)
      {
          if(xhr.status >= 200 && xhr.status < 299)
          {
            anunciosGuardados = JSON.parse(xhr.responseText);            
            verificarCheckboxesChecked();
            refrescarTabla(divTabla, crearTabla(anunciosGuardados));
          }
          else{

              const statusText = xhr.statusText || "Ocurrio un error";
              console.error(`Error:${xhr.status} : ${statusText}`);
          }
          eliminarSpinner();
      }
  }
      // Abrir la peticion
      xhr.open("GET","http://localhost:3001/Anuncios");

      //Enviar la peticion
      xhr.send();
  }


  function leerPrefLS(){
    let aux = localStorage.getItem("preferencias");
    if(aux){
      checkboxesChecked = JSON.parse(aux);
      inicializoContainerCheckboxes(checkboxesChecked);
    } else {
      inicializarPrefenciasCheckboxes();
    }
  } 

  function refrescarTabla(divTabla, tablaCreada) {
    while (divTabla.hasChildNodes()) {
      divTabla.removeChild(divTabla.firstElementChild);
    }
    divTabla.appendChild(tablaCreada);
  }

  function guardarPrefLS(checkboxes){
    localStorage.setItem("preferencias", JSON.stringify(checkboxesChecked));
    console.log('Preferencias guardadas');
  }

  function inicializoContainerCheckboxes(chequeados){
    for (const key in chequeados) {
      if(key != 'id'){
        const item = document.getElementById(key);
        item.checked = chequeados[key];
      }
    }
    verificarCheckboxesChecked();
  }
  
  function inicializarPrefenciasCheckboxes(){
    checkboxContainer.forEach((checkbox) => {
      checkboxesChecked[checkbox.id] = checkbox.checked;
    });
  }

  function verificarCheckboxesChecked() {
    checkboxContainer.forEach((checkbox) => {
      checkbox.addEventListener("click", (event) => {
        checkboxesChecked["id"] = true;
  
        checkboxContainer.forEach((checkbox) => {
          checkboxesChecked[checkbox.id] = checkbox.checked;
        });
  
        console.log(JSON.parse(localStorage.getItem('anuncios')));
  
        if (event.target.checked == false) {
          anunciosFiltrados = anunciosGuardados.map((e) => {
            return Object.keys(e).reduce((object, key) => {
              // Si la key que estoy recorriendo NO es la que clickie y arma
              // el objeto para devolverlo con las columnas que quiero sacar
              // y me fijo que este checkeado para que no se agreguen los que
              // no estan chequeados
              if (key !== event.target.id && checkboxesChecked[key]) {
                object[key] = e[key];
              }
              return object;
            }, {});
          });
        } else {
          anunciosFiltrados = anunciosGuardados.map((e) => {
            let payload = {};
            for (const key in e) {
              if (checkboxesChecked[key]) payload[key] = e[key];
            }
            return payload;
          });
        }
        guardarPrefLS(checkboxesChecked);
        refrescarTabla(divTabla, crearTabla(anunciosFiltrados));
      });
    });
  }
